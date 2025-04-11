'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ChatInterface from '@/components/ChatInterface';
import OnboardingModal from '@/components/OnboardingModal';
import { UserProfile } from '@/types/database';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/auth/signin');
        return;
      }

      setUser(session.user);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      if (!profile) {
        setShowOnboarding(true);
      } else {
        setUserProfile(profile);
      }

      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  const handleOnboardingSubmit = async (profile: Partial<UserProfile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving profile:', error);
      throw new Error('Failed to save profile');
    }

    setUserProfile(profile as UserProfile);
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
        </div>
        {userProfile ? (
          <ChatInterface userProfile={userProfile} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Please complete the onboarding process to start chatting.</p>
          </div>
        )}
      </div>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => {
          if (userProfile) {
            setShowOnboarding(false);
          }
        }}
        onSubmit={handleOnboardingSubmit}
      />
    </>
  );
}