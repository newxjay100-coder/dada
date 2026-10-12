import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, MemberGradeCode, UserRole } from '@/types/database.types';
import {
  MockProfileStore,
  MockPointStore,
  MockCouponStore,
  MockAuthStore,
} from '@/mock/mockStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
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

  useEffect(() => {
    // Check initial user from storage or Supabase session
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // fetch profile
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUser(data as Profile);
              } else {
                setUser(MockProfileStore.getCurrentUser());
              }
              setIsLoading(false);
            });
        } else {
          setUser(MockProfileStore.getCurrentUser());
          setIsLoading(false);
        }
      });
    } else {
      setUser(MockProfileStore.getCurrentUser());
      setIsLoading(false);
    }
  }, []);

  const login = async (loginIdOrEmail: string, pass: string) => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
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

          if (!error && data.user) {
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            if (prof) {
              setUser(prof as Profile);
              MockProfileStore.setCurrentUser(prof as Profile);
              api.logAuthEvent(prof.id, prof.email, 'LOGIN', 'Supabase Auth 로그인');
              setIsLoading(false);
              return { success: true };
            }
          }
        } catch (authErr) {
          console.warn('Supabase auth login check exception:', authErr);
        }
      }

      // Check mock store
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

      // Check duplicated login_id
      if (MockAuthStore.isLoginIdTaken(input.login_id)) {
        setIsLoading(false);
        return { success: false, message: '이미 가입된 아이디입니다. 다른 아이디를 입력해 주세요.' };
      }

      // Check duplicated email
      if (MockAuthStore.isEmailTaken(input.email)) {
        setIsLoading(false);
        return { success: false, message: '이미 등록된 이메일 주소입니다. 다른 이메일을 입력해 주세요.' };
      }

      if (isAdminAccount && input.admin_code) {
        const trimmedCode = input.admin_code.trim().toUpperCase();
        if (trimmedCode !== 'DASSOBA2026' && trimmedCode !== 'ADMIN') {
          setIsLoading(false);
          return {
            success: false,
            message: '관리자 보안 인증 코드가 올바르지 않습니다. (인증 힌트: DASSOBA2026)',
          };
        }
      }

      const newProfile: Profile = {
        id: isAdminAccount ? `admin-${Date.now()}` : `u-${Date.now()}`,
        login_id: input.login_id.trim(),
        email: input.email.trim(),
        name: isAdminAccount && input.department ? `${input.name} (${input.department})` : input.name,
        phone: input.phone || '010-0000-0000',
        birthday: input.birthday,
        gender: input.gender,
        member_grade: isAdminAccount ? 'VVIP' : 'BRONZE',
        role: isAdminAccount ? 'admin' : 'customer',
        points_balance: isAdminAccount ? 50000 : 5000, // 50,000 for admin, 5,000 for customer
        status: 'active',
        marketing_consent: Boolean(input.marketing_consent),
        terms_consent: Boolean(input.terms_consent),
        created_at: new Date().toISOString(),
      };

      // Save credentials for authentication
      if (input.password) {
        MockAuthStore.saveCredential(newProfile.login_id, newProfile.email, input.password);
      }

      // Record point transaction in ledger
      MockPointStore.addTransaction({
        user_id: newProfile.id,
        transaction_type: isAdminAccount ? 'admin_adjustment' : 'signup',
        amount: newProfile.points_balance,
        description: isAdminAccount ? '관리자 계정 초기 운영 포인트 지급' : '신규 회원가입 웰컴 적립금 지급',
      });

      // Issue welcome coupon for customers
      if (!isAdminAccount) {
        MockCouponStore.addCouponToUser({
          user_id: newProfile.id,
          coupon_id: 'c-01',
          is_used: false,
          issued_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      if (isSupabaseConfigured && input.password) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: input.email.trim(),
            password: input.password,
            options: {
              data: {
                login_id: input.login_id.trim(),
                name: newProfile.name,
                phone: newProfile.phone,
                role: newProfile.role,
                department: input.department,
              },
            },
          });

          if (authError) {
            console.warn('Supabase Auth signUp warning:', authError.message);
          } else if (authData?.user?.id) {
            newProfile.id = authData.user.id;
          }

          // Directly sync to profiles table in Supabase
          const { error: profErr } = await supabase.from('profiles').upsert(newProfile);
          if (profErr) {
            console.warn('Supabase profiles upsert warning:', profErr.message);
          }
        } catch (e: any) {
          console.warn('Supabase Auth signup exception:', e);
        }
      }

      MockProfileStore.updateProfile(newProfile);
      MockProfileStore.setCurrentUser(newProfile);
      setUser(newProfile);
      api.logAuthEvent(newProfile.id, newProfile.email, 'SIGNUP', `신규 회원가입 (${newProfile.role})`);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || '회원가입에 실패했습니다.' };
    }
  };

  const logout = () => {
    if (user) {
      api.logAuthEvent(user.id, user.email, 'LOGOUT', '정상 로그아웃');
    }
    if (isSupabaseConfigured) {
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
