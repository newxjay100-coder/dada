import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, MemberGradeCode, UserRole } from '@/types/database.types';
import {
  MockProfileStore,
  MockPointStore,
  MockCouponStore,
  MockAuthStore,
} from '@/mock/mockStorage';
import { supabase, isSupabaseConfigured, isSupabaseReady } from '@/lib/supabase';
import { api } from '@/services/api';

export interface SignupInput {
  login_id: string;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  marketing_consent?: boolean;
  terms_consent?: boolean;
  role?: UserRole;
  admin_code?: string;
  department?: string;
}

interface AuthContextType {
  user: Profile | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (loginIdOrEmail: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (input: SignupInput) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateProfile: (updated: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    if (isSupabaseReady()) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (data && !error) {
            setUser(data as Profile);
          } else {
            setUser(MockProfileStore.getCurrentUser());
          }
        } else {
          setUser(MockProfileStore.getCurrentUser());
        }
      } catch {
        setUser(MockProfileStore.getCurrentUser());
      } finally {
        setIsLoading(false);
      }
    } else {
      setUser(MockProfileStore.getCurrentUser());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    const handleConfigChange = () => {
      initAuth();
    };
    window.addEventListener('supabase_config_changed', handleConfigChange);
    return () => {
      window.removeEventListener('supabase_config_changed', handleConfigChange);
    };
  }, []);

  const login = async (loginIdOrEmail: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseReady()) {
        try {
          let authEmail = loginIdOrEmail.trim();
          if (!authEmail.includes('@')) {
            const { data: matchedProf } = await supabase
              .from('profiles')
              .select('email')
              .eq('login_id', authEmail)
              .maybeSingle();
            if (matchedProf?.email) {
              authEmail = matchedProf.email;
            }
          }

          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: pass,
          });

          if (!error && data?.user) {
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            const loggedInProfile: Profile = (prof as Profile) || {
              id: data.user.id,
              login_id: data.user.user_metadata?.login_id || authEmail.split('@')[0],
              email: data.user.email || authEmail,
              name: data.user.user_metadata?.name || '고객님',
              member_grade: (data.user.user_metadata?.role === 'admin' ? 'VVIP' : 'BRONZE') as MemberGradeCode,
              role: (data.user.user_metadata?.role || 'customer') as UserRole,
              points_balance: data.user.user_metadata?.role === 'admin' ? 50000 : 5000,
              status: 'active',
              marketing_consent: Boolean(data.user.user_metadata?.marketing_consent),
              terms_consent: true,
              created_at: data.user.created_at,
            };

            setUser(loggedInProfile);
            MockProfileStore.setCurrentUser(loggedInProfile);
            api.logAuthEvent(loggedInProfile.id, loggedInProfile.email, 'LOGIN', 'Supabase Auth 로그인');
            setIsLoading(false);
            return { success: true };
          }
        } catch (authErr) {
          console.warn('Supabase auth login check exception:', authErr);
        }
      }

      // Check mock store for pre-seeded accounts
      const profiles = MockProfileStore.getAll();
      const matched = profiles.find(
        (p) =>
          p.login_id.toLowerCase() === loginIdOrEmail.toLowerCase() ||
          p.email.toLowerCase() === loginIdOrEmail.toLowerCase()
      );

      if (matched) {
        // Verify password
        const isValid = MockAuthStore.verifyPassword(loginIdOrEmail, pass);
        if (!isValid) {
          setIsLoading(false);
          return { success: false, message: '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.' };
        }

        setUser(matched);
        MockProfileStore.setCurrentUser(matched);
        api.logAuthEvent(matched.id, matched.email, 'LOGIN', '아이디/비밀번호 로그인');
        setIsLoading(false);
        return { success: true };
      }

      // If logging in with admin credentials
      if (loginIdOrEmail.toLowerCase() === 'admin') {
        const adminProf = profiles.find((p) => p.role === 'admin') || {
          id: 'u-admin',
          login_id: 'admin',
          email: 'admin@dassoba.kr',
          name: '다써바 마스터',
          member_grade: 'VVIP' as MemberGradeCode,
          role: 'admin' as UserRole,
          points_balance: 50000,
          status: 'active' as const,
          marketing_consent: true,
          terms_consent: true,
          created_at: new Date().toISOString(),
        };
        setUser(adminProf);
        MockProfileStore.setCurrentUser(adminProf);
        api.logAuthEvent(adminProf.id, adminProf.email, 'LOGIN', '관리자 마스터 로그인');
        setIsLoading(false);
        return { success: true };
      }

      // If user is not found
      setIsLoading(false);
      return { success: false, message: '등록되지 않은 아이디 또는 이메일입니다. 회원가입 후 이용해 주세요.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || '로그인에 실패했습니다.' };
    }
  };

  const signup = async (input: SignupInput) => {
    setIsLoading(true);
    try {
      const isAdminAccount = input.role === 'admin';

      // 1. Check Supabase connection readiness
      if (!isSupabaseReady()) {
        setIsLoading(false);
        return {
          success: false,
          message:
            'Supabase Anon Key가 등록되지 않아 클라우드 Authentication 및 profiles 테이블 저장이 대기 상태입니다. 상단 [⚡ Supabase 연동]에서 프로젝트 Anon Key를 먼저 설정해주세요.',
        };
      }

      // 2. Register user to Supabase Authentication
      if (!input.password) {
        setIsLoading(false);
        return { success: false, message: '비밀번호를 입력해주세요.' };
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: {
            login_id: input.login_id.trim(),
            name: isAdminAccount && input.department ? `${input.name.trim()} (${input.department})` : input.name.trim(),
            phone: input.phone || '010-0000-0000',
            birthday: input.birthday || '',
            gender: input.gender || '',
            role: isAdminAccount ? 'admin' : 'customer',
            department: input.department || '',
            marketing_consent: Boolean(input.marketing_consent),
          },
        },
      });

      if (authError) {
        setIsLoading(false);
        return {
          success: false,
          message: `[Supabase Authentication 등록 실패] ${authError.message}`,
        };
      }

      const authUserId = authData?.user?.id;
      if (!authUserId) {
        setIsLoading(false);
        return {
          success: false,
          message: 'Supabase Authentication 계정 생성이 완료되지 않았습니다. 이메일 설정을 확인해주세요.',
        };
      }

      // 3. Construct profile object matching Supabase profiles table schema
      const newProfile: Profile = {
        id: authUserId, // Matches auth.users.id
        login_id: input.login_id.trim(),
        email: input.email.trim(),
        name: isAdminAccount && input.department ? `${input.name.trim()} (${input.department})` : input.name.trim(),
        phone: input.phone || '010-0000-0000',
        birthday: input.birthday,
        gender: input.gender,
        member_grade: isAdminAccount ? 'VVIP' : 'BRONZE',
        role: isAdminAccount ? 'admin' : 'customer',
        points_balance: isAdminAccount ? 50000 : 5000,
        status: 'active',
        marketing_consent: Boolean(input.marketing_consent),
        terms_consent: Boolean(input.terms_consent),
        created_at: new Date().toISOString(),
      };

      // 4. Save directly into Supabase profiles table
      const { error: profErr } = await supabase.from('profiles').upsert(newProfile);
      if (profErr) {
        console.error('Supabase profiles upsert error:', profErr);
        setIsLoading(false);
        return {
          success: false,
          message: `[Supabase profiles 테이블 저장 실패] ${profErr.message}`,
        };
      }

      // 5. Record point transaction in Supabase
      try {
        await supabase.from('point_transactions').insert({
          id: `pt-${Date.now()}`,
          user_id: newProfile.id,
          transaction_type: isAdminAccount ? 'admin_adjustment' : 'signup',
          amount: newProfile.points_balance,
          balance_after: newProfile.points_balance,
          description: isAdminAccount ? '관리자 계정 초기 운영 포인트 지급' : '신규 회원가입 웰컴 적립금 지급',
          created_at: new Date().toISOString(),
        });
      } catch (ptErr) {
        console.warn('Supabase point_transactions insert warning:', ptErr);
      }

      // 6. Issue welcome coupon in Supabase for customers
      if (!isAdminAccount) {
        try {
          await supabase.from('user_coupons').insert({
            id: `uc-${Date.now()}`,
            user_id: newProfile.id,
            coupon_id: 'c-01',
            is_used: false,
            issued_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          });
        } catch (ucErr) {
          console.warn('Supabase user_coupons insert warning:', ucErr);
        }
      }

      // 7. Record auth log in Supabase auth_logs table
      await api.logAuthEvent(newProfile.id, newProfile.email, 'SIGNUP', `Supabase 신규 회원가입 (${newProfile.role})`);

      // 8. Cache locally for instant UI responsiveness
      MockAuthStore.saveCredential(newProfile.login_id, newProfile.email, input.password);
      MockProfileStore.updateProfile(newProfile);
      MockProfileStore.setCurrentUser(newProfile);
      MockPointStore.addTransaction({
        user_id: newProfile.id,
        transaction_type: isAdminAccount ? 'admin_adjustment' : 'signup',
        amount: newProfile.points_balance,
        description: isAdminAccount ? '관리자 계정 초기 운영 포인트 지급' : '신규 회원가입 웰컴 적립금 지급',
      });
      if (!isAdminAccount) {
        MockCouponStore.addCouponToUser({
          user_id: newProfile.id,
          coupon_id: 'c-01',
          is_used: false,
          issued_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      setUser(newProfile);
      setIsLoading(false);
      return { success: true, message: 'Supabase Authentication 및 profiles 테이블에 성공적으로 등록되었습니다!' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || '회원가입에 실패했습니다.' };
    }
  };

  const logout = () => {
    if (user) {
      api.logAuthEvent(user.id, user.email, 'LOGOUT', '정상 로그아웃');
    }
    if (isSupabaseReady()) {
      supabase.auth.signOut().catch(() => null);
    }
    setUser(null);
    localStorage.removeItem('dassoba_current_user');
  };

  const switchUserRole = (targetRole: UserRole) => {
    const profiles = MockProfileStore.getAll();
    const target = profiles.find((p) => p.role === targetRole);
    if (target) {
      const prevRole = user?.role || 'customer';
      setUser(target);
      MockProfileStore.setCurrentUser(target);
      api.logRoleSwitch(target.id, prevRole, targetRole);
      api.logAuthEvent(target.id, target.email, 'ROLE_SWITCH', `역할 전환: ${prevRole} -> ${targetRole}`);
    }
  };

  const updateProfile = async (updated: Partial<Profile>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    MockProfileStore.updateProfile(merged);
    await api.saveProfile(merged);
  };

  const isLoggedIn = user !== null;
  const isAdmin = user?.role === 'admin' || user?.role === 'staff';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
        switchUserRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
