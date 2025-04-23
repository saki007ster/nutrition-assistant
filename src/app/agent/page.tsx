'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ChatInterface from '@/components/ChatInterface';
import OnboardingModal from '@/components/OnboardingModal';
import { UserProfile } from '@/types/database';
import { motion } from 'framer-motion';
import { MessageSquare, Apple, Utensils, Scale, Info, Sparkles, Zap, Target, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
    description: "Get instant answers to your nutrition and diet questions",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: Apple,
    title: "Personalized Advice",
    description: "Receive customized recommendations based on your preferences",
    gradient: "from-green-500 to-emerald-400"
  },
  {
    icon: Utensils,
    title: "Meal Planning",
    description: "Get help creating balanced meal plans and recipes",
    gradient: "from-purple-500 to-pink-400"
  },
  {
    icon: Scale,
    title: "Progress Tracking",
    description: "Track your nutrition goals and get feedback",
    gradient: "from-orange-500 to-amber-400"
  }
];

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={pulseAnimation}
                    className="relative w-10 h-10"
                  >
                    <Image
                      src="/logo.svg"
                      alt="Nutrition Assistant Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Welcome to Your Nutrition Agent
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 text-gray-600 flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Your personal AI assistant for nutrition guidance and meal planning
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm bg-blue-50 px-4 py-2 rounded-full text-blue-700"
              >
                <Info className="h-4 w-4" />
                <span>Logged in as {user?.email}</span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Chat Section */}
            <div className="lg:col-span-8">
              {userProfile ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 h-[calc(100vh-12rem)] flex flex-col"
                >
                  <div className="p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={pulseAnimation}
                        className="relative w-7 h-7"
                      >
                        <Image
                          src="/logo.svg"
                          alt="Nutrition Assistant Logo"
                          fill
                          className="object-contain"
                          priority
                        />
                      </motion.div>
                      <h2 className="text-lg font-semibold text-blue-900">Chat with Your Nutrition Agent</h2>
                    </div>
                    <p className="mt-2 text-sm text-blue-700 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Ask questions about nutrition, get meal plans, or seek dietary advice
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto relative">
                    <div className="absolute inset-0">
                      <ChatInterface userProfile={userProfile} />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100">
                  <p className="text-gray-600">Please complete the onboarding process to start chatting.</p>
                </div>
              )}
            </div>

            {/* Sidebar with Help and Examples */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Features */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
                  <Target className="h-5 w-5 text-blue-500" />
                  What You Can Do
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.gradient}`}>
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Example Queries */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Try These Examples
                </h3>
                <div className="space-y-3">
                  {exampleQueries.map((query, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-colors text-sm group flex items-center justify-between"
                    >
                      <span>&ldquo;{query}&rdquo;</span>
                      <ChevronRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Tips Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-900">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Pro Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <motion.li 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600">•</span>
                    Be specific with your questions for better answers
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-start gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600">•</span>
                    Include any dietary restrictions or preferences
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-start gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600">•</span>
                    Ask follow-up questions for more detailed information
                  </motion.li>
                  <motion.li 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-start gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <span className="text-blue-600">•</span>
                    Use the example queries as inspiration
                  </motion.li>
                </ul>
              </motion.div>
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