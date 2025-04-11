'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  dietary_preferences?: string[];
  allergies?: string[];
  health_goals?: string[];
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        router.push('/auth/signin');
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile({
        id: session.user.id,
        email: session.user.email!,
        ...data
      });
      setIsLoading(false);
    };

    fetchProfile();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <Button
              onClick={handleSignOut}
              variant="destructive"
            >
              Sign Out
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Email</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>

            {profile?.name && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Name</h2>
                <p className="text-gray-600">{profile.name}</p>
              </div>
            )}

            {profile?.dietary_preferences && profile.dietary_preferences.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Dietary Preferences</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.dietary_preferences.map((pref, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.allergies && profile.allergies.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Allergies</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.health_goals && profile.health_goals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Health Goals</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.health_goals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 