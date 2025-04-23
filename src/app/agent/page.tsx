'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ChatInterface from '@/components/ChatInterface';
import OnboardingModal from '@/components/OnboardingModal';
import { UserProfile } from '@/types/database';
import { motion } from 'framer-motion';
import { MessageSquare, Apple, Utensils, Scale, Brain, Info } from 'lucide-react';

const exampleQueries = [
  "What should I eat for breakfast to boost my energy levels?",
  "Can you create a meal plan for weight loss?",
  "What are healthy snack options for afternoon cravings?",
  "How can I increase my protein intake as a vegetarian?",
];

const features = [
  {
    icon: MessageSquare,
    title: "Ask Anything",
    description: "Get instant answers to your nutrition and diet questions"
  },
  {
    icon: Apple,
    title: "Personalized Advice",
    description: "Receive customized recommendations based on your preferences"
  },
  {
    icon: Utensils,
    title: "Meal Planning",
    description: "Get help creating balanced meal plans and recipes"
  },
  {
    icon: Scale,
    title: "Progress Tracking",
    description: "Track your nutrition goals and get feedback"
  }
];

export default function AgentPage() {
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
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl sm:text-3xl font-bold text-gray-900"
                >
                  Welcome to Your Nutrition Agent
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 text-gray-600"
                >
                  Your personal AI assistant for nutrition guidance and meal planning
                </motion.p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Logged in as {user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Chat Section */}
            <div className="lg:col-span-8">
              {userProfile ? (
                <div className="bg-white rounded-xl shadow-sm border h-[calc(100vh-12rem)] flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h2 className="text-lg font-semibold">Chat with Your Nutrition Agent</h2>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Ask questions about nutrition, get meal plans, or seek dietary advice.
                    </p>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <ChatInterface userProfile={userProfile} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                  <p className="text-gray-600">Please complete the onboarding process to start chatting.</p>
                </div>
              )}
            </div>

            {/* Sidebar with Help and Examples */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Features */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">What You Can Do</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Example Queries */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Try These Examples</h3>
                <div className="space-y-3">
                  {exampleQueries.map((query, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors text-sm"
                    >
                      "{query}"
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Pro Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    Be specific with your questions for better answers
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    Include any dietary restrictions or preferences
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    Ask follow-up questions for more detailed information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    Use the example queries as inspiration
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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