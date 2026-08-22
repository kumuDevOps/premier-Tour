import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, dataService } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';
import { SEED_USERS } from '../data/mockData';

const CACHED_USER_KEY = 'premier_user_profile';
const ACTIVE_USER_KEY = 'premier_active_user_v2';

export interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  role: UserRole;
  isAdmin: boolean;
  isLoading: boolean;
  isSupabaseLive: boolean;
  signIn: (email: string, password?: string) => Promise<{ error: string | null; success: boolean; role?: UserRole; user?: UserProfile | null; requiresConfirmation?: boolean }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ error: string | null; success: boolean; session: Session | null; requiresConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  quickLogin: (role: 'user' | 'admin') => void;
  quickDemoLogin: (role: 'user' | 'admin') => void;
  resetPassword: (email: string) => Promise<{ error: Error | null; success: boolean; message?: string }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: string | null; success: boolean }>;
  loginAs: (email: string) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
  updateProfileName: (name: string) => Promise<void>;
  updateAvatar: (avatarUrl: string | null) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(CACHED_USER_KEY) || localStorage.getItem(ACTIVE_USER_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from public.users by matching auth user ID (or fallback by email)
  const fetchUserProfileFromDb = async (
    supabaseUser: User,
    overrideFullName?: string,
    overrideRole?: UserRole
  ): Promise<UserProfile> => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    console.log("AUTH USER:", {
      id: supabaseUser?.id,
      email: supabaseUser?.email,
      currentPathname: currentPath
    });

    if (isSupabaseConfigured) {
      try {
        // 1. Primary lookup: Match by authenticated user UUID (public.users.id = supabaseUser.id)
        const { data: profile, error } = await supabase
          .from('users')
          .select('id,email,role,full_name,avatar_url,created_at')
          .eq('id', supabaseUser.id)
          .maybeSingle();

        console.log("PROFILE QUERY ID:", supabaseUser.id);
        console.log("PUBLIC USERS RESULT:", {
          profile,
          error: error ? {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          } : null
        });

        if (error) {
          console.error("Failed to load user profile from public.users:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
        }

        const resolvedProfile = Array.isArray(profile) ? profile[0] : profile;

        if (!error && resolvedProfile) {
          const rawRole = resolvedProfile.role;
          const roleStr = typeof rawRole === 'string' ? rawRole.toLowerCase().trim() : '';
          const isUserAdmin = roleStr === 'admin';
          const resolvedRole: UserRole = isUserAdmin ? 'admin' : 'user';

          console.log("ADMIN ROLE RESOLUTION:", {
            authUserId: supabaseUser.id,
            authUserEmail: supabaseUser.email,
            profileQueryId: supabaseUser.id,
            profileQueryResult: resolvedProfile,
            profileRole: resolvedProfile.role,
            resolvedRole: resolvedRole,
            isAdmin: isUserAdmin,
            currentPathname: currentPath
          });

          const profileObj: UserProfile = {
            id: resolvedProfile.id,
            email: resolvedProfile.email || supabaseUser.email || '',
            full_name: resolvedProfile.full_name || overrideFullName || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Traveler',
            role: resolvedRole,
            created_at: resolvedProfile.created_at || supabaseUser.created_at || new Date().toISOString(),
            avatar_url: resolvedProfile.avatar_url || supabaseUser.user_metadata?.avatar_url || (isUserAdmin ? SEED_USERS[1].avatar_url : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
          };

          return profileObj;
        }

        // 2. Secondary fallback lookup by email if ID differed during account migration
        if (supabaseUser.email) {
          const { data: emailProfile, error: emailError } = await supabase
            .from('users')
            .select('id,email,role,full_name,avatar_url,created_at')
            .eq('email', supabaseUser.email.trim())
            .maybeSingle();

          if (emailError) {
            console.error("Failed to load user profile by email from public.users:", {
              code: emailError.code,
              message: emailError.message,
              details: emailError.details,
              hint: emailError.hint
            });
          }

          const resolvedEmailProfile = Array.isArray(emailProfile) ? emailProfile[0] : emailProfile;

          if (!emailError && resolvedEmailProfile) {
            const rawRole = resolvedEmailProfile.role;
            const roleStr = typeof rawRole === 'string' ? rawRole.toLowerCase().trim() : '';
            const isUserAdmin = roleStr === 'admin';
            const resolvedRole: UserRole = isUserAdmin ? 'admin' : 'user';

            console.log("ADMIN ROLE RESOLUTION (EMAIL FALLBACK):", {
              authUserId: supabaseUser.id,
              authUserEmail: supabaseUser.email,
              profileQueryId: supabaseUser.email,
              profileQueryResult: resolvedEmailProfile,
              profileRole: resolvedEmailProfile.role,
              resolvedRole: resolvedRole,
              isAdmin: isUserAdmin,
              currentPathname: currentPath
            });

            const profileObj: UserProfile = {
              id: resolvedEmailProfile.id || supabaseUser.id,
              email: resolvedEmailProfile.email || supabaseUser.email || '',
              full_name: resolvedEmailProfile.full_name || overrideFullName || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Traveler',
              role: resolvedRole,
              created_at: resolvedEmailProfile.created_at || supabaseUser.created_at || new Date().toISOString(),
              avatar_url: resolvedEmailProfile.avatar_url || supabaseUser.user_metadata?.avatar_url || (isUserAdmin ? SEED_USERS[1].avatar_url : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
            };

            return profileObj;
          }
        }
      } catch (err) {
        console.error("Profile fetch error exception from public.users:", err);
      }
    }

    // Fallback profile if record is genuinely not found in public.users yet
    const assignedRole: UserRole = overrideRole || (supabaseUser.user_metadata?.role === 'admin' ? 'admin' : 'user');
    const assignedFullName = overrideFullName || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Traveler';

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: assignedFullName,
      role: assignedRole,
      created_at: supabaseUser.created_at || new Date().toISOString(),
      avatar_url:
        supabaseUser.user_metadata?.avatar_url ||
        (assignedRole === 'admin' ? SEED_USERS[1].avatar_url : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    };
  };

  const syncUserProfile = async (
    supabaseUser: User,
    overrideFullName?: string,
    overrideRole?: UserRole
  ): Promise<UserProfile> => {
    const profile = await fetchUserProfileFromDb(supabaseUser, overrideFullName, overrideRole);

    // Ensure user record is synchronized in public.users table
    if (isSupabaseConfigured) {
      try {
        const userRecord = {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          role: profile.role,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at || new Date().toISOString(),
        };
        await (supabase.from('users') as any).upsert([userRecord], { onConflict: 'id' });
      } catch (dbErr) {
        console.warn('Upsert public.users sync error:', dbErr);
      }
    }

    setUser(profile);
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(profile));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(profile));
    dataService.setCurrentUser(profile);
    return profile;
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Step 1 & 2: Get active Supabase session and user
        const { data: { session: activeSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session retrieval error:", sessionError);
        }

        if (isMounted) {
          if (!sessionError && activeSession?.user) {
            setSession(activeSession);
            // Step 3, 4, 5: Fetch profile, resolve role, set isAdmin
            await syncUserProfile(activeSession.user);
          } else {
            // Also attempt getUser() check
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
              await syncUserProfile(authUser);
            } else {
              setSession(null);
              // If cached user is not a demo preset, clear it on expired live session
              const cached = localStorage.getItem(CACHED_USER_KEY);
              if (cached && !cached.includes('u-customer') && !cached.includes('u-admin')) {
                localStorage.removeItem(CACHED_USER_KEY);
                localStorage.removeItem(ACTIVE_USER_KEY);
                setUser(null);
              }
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          // Step 6: Mark loading complete AFTER profile and role resolution
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      console.log("AUTH STATE CHANGE:", event, { email: newSession?.user?.email });
      setSession(newSession);
      if (newSession?.user) {
        await syncUserProfile(newSession.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        localStorage.removeItem(CACHED_USER_KEY);
        localStorage.removeItem(ACTIVE_USER_KEY);
        dataService.setCurrentUser(null);
        window.dispatchEvent(new Event('auth-state-changed'));
      }
      if (isMounted) {
        setIsLoading(false);
      }
    });

    const handleLocalAuthChange = () => {
      if (isMounted) {
        setUser(dataService.getCurrentUser());
      }
    };
    window.addEventListener('auth-state-changed', handleLocalAuthChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('auth-state-changed', handleLocalAuthChange);
    };
  }, []);

  const signIn = async (
    email: string,
    password = 'password123'
  ): Promise<{ error: string | null; success: boolean; role?: UserRole; user?: UserProfile | null; requiresConfirmation?: boolean }> => {
    setIsLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setIsLoading(false);
          const rawMsg = error.message || '';
          if (
            rawMsg.toLowerCase().includes('email not confirmed') ||
            rawMsg.toLowerCase().includes('email_not_confirmed')
          ) {
            return {
              error: 'Email confirmation is pending. Please verify your inbox to confirm your email before signing in, or click "Resend Confirmation Email".',
              success: false,
              requiresConfirmation: true,
            };
          }

          // If demo user doesn't exist in live Supabase instance yet, allow smooth demo sign in
          const isDemoTraveler = email.toLowerCase() === SEED_USERS[0].email.toLowerCase();
          const isDemoAdmin = email.toLowerCase() === SEED_USERS[1].email.toLowerCase();
          if (isDemoTraveler || isDemoAdmin) {
            const roleToSet: UserRole = isDemoAdmin ? 'admin' : 'user';
            quickLogin(roleToSet);
            const demoUser = roleToSet === 'admin' ? SEED_USERS[1] : SEED_USERS[0];
            return { error: null, success: true, role: roleToSet, user: demoUser };
          }

          return { error: rawMsg, success: false };
        }

        if (data.user) {
          const profile = await syncUserProfile(data.user);
          if (data.session) {
            setSession(data.session);
          }
          setIsLoading(false);
          return { error: null, success: true, role: profile.role, user: profile };
        }
      } catch (err: any) {
        setIsLoading(false);
        return { error: err?.message || 'Authentication encountered an error', success: false };
      }
    }

    // Local Mock Login fallback if Supabase is not configured
    const target = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `u-${Date.now()}`,
      email: email.trim(),
      full_name: email.split('@')[0],
      role: 'user' as UserRole,
      created_at: new Date().toISOString(),
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(target);
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(target));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(target));
    dataService.setCurrentUser(target);
    setIsLoading(false);
    return { error: null, success: true, role: target.role, user: target };
  };

  const signUp = async (
    email: string,
    password = 'password123',
    fullName = 'Valued Traveler'
  ): Promise<{ error: string | null; success: boolean; session: Session | null; requiresConfirmation?: boolean }> => {
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      const cleanName = fullName.trim() || cleanEmail.split('@')[0] || 'Traveler';

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: cleanName,
              role: 'user',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message, success: false, session: null };
        }

        const requiresConfirmation = !data.session && Boolean(data.user);

        if (data.user) {
          await syncUserProfile(data.user, cleanName, 'user');
        }

        if (data.session) {
          setSession(data.session);
        }

        setIsLoading(false);
        return { error: null, success: true, session: data.session, requiresConfirmation };
      }

      const newUser: UserProfile = {
        id: `u-${Date.now()}`,
        email: cleanEmail,
        full_name: cleanName,
        role: 'user',
        created_at: new Date().toISOString(),
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUser(newUser);
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      dataService.setCurrentUser(newUser);
      setIsLoading(false);
      return { error: null, success: true, session: null, requiresConfirmation: false };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err?.message || 'An unexpected error occurred during signup.', success: false, session: null };
    }
  };

  const resendConfirmationEmail = async (email: string): Promise<{ error: string | null; success: boolean }> => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) return { error: error.message, success: false };
      }
      return { error: null, success: true };
    } catch (err: any) {
      return { error: err?.message || 'Failed to resend confirmation email.', success: false };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('SignOut error:', e);
    }
    localStorage.removeItem(CACHED_USER_KEY);
    localStorage.removeItem(ACTIVE_USER_KEY);
    setUser(null);
    setSession(null);
    dataService.setCurrentUser(null);
    window.dispatchEvent(new Event('auth-state-changed'));
    setIsLoading(false);
  };

  const quickLogin = (roleToSet: UserRole) => {
    const target = roleToSet === 'admin' ? SEED_USERS[1] : SEED_USERS[0];
    setUser(target);
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(target));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(target));
    dataService.setCurrentUser(target);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const quickDemoLogin = (roleToSet: UserRole) => {
    quickLogin(roleToSet);
  };

  const loginAs = (email: string) => {
    const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(found));
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(found));
      dataService.setCurrentUser(found);
    } else {
      const newUser: UserProfile = {
        id: `u-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: 'user',
        created_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(newUser));
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      dataService.setCurrentUser(newUser);
    }
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const switchRole = (newRole: UserRole) => {
    const target = typeof (dataService as any).switchRole === 'function'
      ? (dataService as any).switchRole(newRole)
      : (newRole === 'admin' ? SEED_USERS[1] : SEED_USERS[0]);
    setUser(target);
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(target));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(target));
    dataService.setCurrentUser(target);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const logout = () => {
    signOut();
  };

  const resetPassword = async (email: string): Promise<{ error: Error | null; success: boolean; message?: string }> => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/auth?mode=reset-password`,
        });
        if (error) return { error, success: false };
      }
      return {
        error: null,
        success: true,
        message: 'Password reset link dispatched. Please inspect your inbox for verification instructions.',
      };
    } catch (err: any) {
      return { error: err instanceof Error ? err : new Error(err?.message || 'Password reset failed'), success: false };
    }
  };

  const updateProfileName = async (name: string) => {
    if (!user) return;
    const updated: UserProfile = { ...user, full_name: name };
    if (isSupabaseConfigured) {
      try {
        await (supabase.from('users') as any).update({ full_name: name }).eq('id', user.id);
      } catch (e) {
        console.warn('DB update failed, using local update', e);
      }
    }
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated));
    dataService.setCurrentUser(updated);
    setUser(updated);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const updateAvatar = async (avatarUrl: string | null) => {
    if (!user) return;
    const updated: UserProfile = { ...user, avatar_url: avatarUrl || undefined };
    if (isSupabaseConfigured) {
      try {
        await (supabase.from('users') as any).update({ avatar_url: avatarUrl }).eq('id', user.id);
      } catch (e) {
        console.warn('DB avatar update failed, using local update', e);
      }
    }
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated));
    dataService.setCurrentUser(updated);
    setUser(updated);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...data };
    if (isSupabaseConfigured) {
      try {
        const patch: any = {};
        if (data.full_name !== undefined) patch.full_name = data.full_name;
        if (data.avatar_url !== undefined) patch.avatar_url = data.avatar_url;
        if (Object.keys(patch).length > 0) {
          await (supabase.from('users') as any).update(patch).eq('id', user.id);
        }
      } catch (e) {
        console.warn('DB profile update failed, using local update', e);
      }
    }
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updated));
    dataService.setCurrentUser(updated);
    setUser(updated);
    window.dispatchEvent(new Event('auth-state-changed'));
  };

  const role: UserRole = user?.role || 'user';
  const isAdmin = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAdmin,
        isLoading,
        isSupabaseLive: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        quickLogin,
        quickDemoLogin,
        resetPassword,
        resendConfirmationEmail,
        loginAs,
        switchRole,
        logout,
        updateProfileName,
        updateAvatar,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
