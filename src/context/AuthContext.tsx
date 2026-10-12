import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, MemberGradeCode, UserRole } from '@/types/database.types';
import { MockProfileStore } from '@/mock/mockStorage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginIdOrEmail,
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
            setIsLoading(false);
            return { success: true };
          }
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
        setUser(matched);
        MockProfileStore.setCurrentUser(matched);
        setIsLoading(false);
        return { success: true };
      }

      // If logging in with admin credentials
      if (loginIdOrEmail === 'admin') {
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
        setIsLoading(false);
        return { success: true };
      }

      // Fallback create demo user
      const newMockUser: Profile = {
        id: `u-${Date.now()}`,
        login_id: loginIdOrEmail.includes('@') ? loginIdOrEmail.split('@')[0] : loginIdOrEmail,
        email: loginIdOrEmail.includes('@') ? loginIdOrEmail : `${loginIdOrEmail}@dassoba.kr`,
        name: loginIdOrEmail,
        member_grade: 'BRONZE',
        role: 'customer',
        points_balance: 5000,
        status: 'active',
        marketing_consent: true,
        terms_consent: true,
        created_at: new Date().toISOString(),
      };
      setUser(newMockUser);
      MockProfileStore.setCurrentUser(newMockUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || '로그인에 실패했습니다.' };
    }
  };

  const signup = async (input: SignupInput) => {
    setIsLoading(true);
    try {
      const newProfile: Profile = {
        id: `u-${Date.now()}`,
        login_id: input.login_id,
        email: input.email,
        name: input.name,
        phone: input.phone || '010-0000-0000',
        birthday: input.birthday,
        gender: input.gender,
        member_grade: 'BRONZE',
        role: 'customer',
        points_balance: 5000, // 5,000 welcome bonus points
        status: 'active',
        marketing_consent: Boolean(input.marketing_consent),
        terms_consent: Boolean(input.terms_consent),
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured && input.password) {
        await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              login_id: input.login_id,
              name: input.name,
            },
          },
        });
      }

      MockProfileStore.updateProfile(newProfile);
      MockProfileStore.setCurrentUser(newProfile);
      setUser(newProfile);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, message: err.message || '회원가입에 실패했습니다.' };
    }
  };

  const logout = () => {
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
      setUser(target);
      MockProfileStore.setCurrentUser(target);
    }
  };

  const updateProfile = async (updated: Partial<Profile>) => {
    if (!user) return;
    const merged = { ...user, ...updated };
    setUser(merged);
    MockProfileStore.updateProfile(merged);
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
