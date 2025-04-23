'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { UserProfile, ActivityLevel, CookingExperience, MealPlanPreference, CookingTime } from '@/types/database';
import { motion } from 'framer-motion';
import { 
  Save, 
  Apple, 
  Target, 
  Scale, 
  Utensils, 
  Clock, 
  Heart,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    dietary_preferences: [],
    allergies: [],
    health_goals: [],
    medical_conditions: [],
    favorite_cuisines: [],
    disliked_ingredients: [],
    weight_in_kg: undefined,
    height_in_cm: undefined,
    activity_level: undefined,
    cooking_experience: undefined,
    meal_plan_preference: undefined,
    cooking_time: undefined
  });

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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

      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };

    getProfile();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: session.user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
    } else {
      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    setSaving(false);
  };

  const handleNumberInput = (field: 'weight_in_kg' | 'height_in_cm') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const handleActivityLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as ActivityLevel | '';
    setProfile({
      ...profile,
      activity_level: value || undefined
    });
  };

  const handleCookingExperience = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CookingExperience | '';
    setProfile({
      ...profile,
      cooking_experience: value || undefined
    });
  };

  const handleMealPlanPreference = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MealPlanPreference | '';
    setProfile({
      ...profile,
      meal_plan_preference: value || undefined
    });
  };

  const handleCookingTime = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as CookingTime | '';
    setProfile({
      ...profile,
      cooking_time: value || undefined
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Profile Settings
            </h1>
          </div>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Customize your nutrition preferences and goals
          </p>
        </motion.div>

        {/* Messages */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 max-w-2xl mx-auto"
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <p className="text-green-700">{successMessage}</p>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 max-w-2xl mx-auto"
          >
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{errorMessage}</p>
          </motion.div>
        )}
        
        <motion.form 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          onSubmit={handleSubmit} 
          className="max-w-2xl mx-auto space-y-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Apple className="h-4 w-4 text-green-500" />
                Dietary Preferences
              </label>
              <input
                type="text"
                value={profile.dietary_preferences?.join(', ') || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  dietary_preferences: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter preferences separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                Allergies
              </label>
              <input
                type="text"
                value={profile.allergies?.join(', ') || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter allergies separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Heart className="h-4 w-4 text-pink-500" />
                Health Goals
              </label>
              <input
                type="text"
                value={profile.health_goals?.join(', ') || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  health_goals: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter goals separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                Medical Conditions
              </label>
              <input
                type="text"
                value={profile.medical_conditions?.join(', ') || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  medical_conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter conditions separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-orange-500" />
                Favorite Cuisines
              </label>
              <input
                type="text"
                value={profile.favorite_cuisines?.join(', ') || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  favorite_cuisines: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter cuisines separated by commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                Disliked Ingredients
              </label>
              <input
                type="text"
                value={profile.disliked_ingredients?.join(', ') || ''}
                onChange={(e) => setProfile({
                  ...profile,
                  disliked_ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter ingredients separated by commas"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-500" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight_in_kg || ''}
                  onChange={handleNumberInput('weight_in_kg')}
                  className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  placeholder="Enter weight in kg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-green-500" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={profile.height_in_cm || ''}
                  onChange={handleNumberInput('height_in_cm')}
                  className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  placeholder="Enter height in cm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Scale className="h-4 w-4 text-indigo-500" />
                Activity Level
              </label>
              <select
                value={profile.activity_level || ''}
                onChange={handleActivityLevel}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select activity level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Utensils className="h-4 w-4 text-yellow-500" />
                Cooking Experience
              </label>
              <select
                value={profile.cooking_experience || ''}
                onChange={handleCookingExperience}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select cooking experience</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Apple className="h-4 w-4 text-green-500" />
                Meal Plan Preference
              </label>
              <select
                value={profile.meal_plan_preference || ''}
                onChange={handleMealPlanPreference}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select meal plan preference</option>
                <option value="balanced">Balanced</option>
                <option value="high_protein">High Protein</option>
                <option value="low_carb">Low Carb</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Preferred Cooking Time
              </label>
              <select
                value={profile.cooking_time || ''}
                onChange={handleCookingTime}
                className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              >
                <option value="">Select preferred cooking time</option>
                <option value="quick">Quick (15-30 mins)</option>
                <option value="moderate">Moderate (30-60 mins)</option>
                <option value="lengthy">Lengthy (60+ mins)</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
} 