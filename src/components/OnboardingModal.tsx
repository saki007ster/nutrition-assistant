'use client';

import { useState } from 'react';
import { UserProfile } from '@/types/database';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Target, 
  Apple, 
  Utensils, 
  Scale, 
  Clock, 
  Heart
} from 'lucide-react';
import TagInput from './TagInput';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: Partial<UserProfile>) => Promise<void>;
}

type FormData = Partial<UserProfile>;

interface FormError {
  message: string;
  field?: keyof FormData;
}

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

export default function OnboardingModal({ isOpen, onClose, onSubmit }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<FormError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<FormData>({
    dietary_preferences: [],
    allergies: [],
    health_goals: [],
    medical_conditions: [],
    favorite_cuisines: [],
    disliked_ingredients: [],
    weight_in_kg: undefined,
    height_in_cm: undefined,
    activity_level: 'moderate',
    meal_plan_preference: 'balanced',
    cooking_experience: 'beginner'
  });

  const totalSteps = 3;

  const handleNext = () => {
    setError(null);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        dietary_preferences: profile.dietary_preferences,
        allergies: profile.allergies,
        health_goals: profile.health_goals,
        weight_in_kg: profile.weight_in_kg,
        height_in_cm: profile.height_in_cm,
        activity_level: profile.activity_level,
        medical_conditions: profile.medical_conditions,
        favorite_cuisines: profile.favorite_cuisines,
        disliked_ingredients: profile.disliked_ingredients,
        meal_plan_preference: profile.meal_plan_preference,
        cooking_experience: profile.cooking_experience
      });
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile. Please try again.';
      setError({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setError(null);
    setProfile(prev => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
          <div className="flex items-center gap-3">
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
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Tell us about yourself
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Step {step} of {totalSteps}
              </p>
            </div>
          </div>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
            >
              <Target className="h-5 w-5 text-red-500" />
              {error.message}
            </motion.div>
          )}
        </div>

        {/* Form Content */}
        <div className="p-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Apple className="h-4 w-4 text-green-500" />
                    Dietary Preferences
                  </label>
                  <select
                    multiple
                    className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    value={profile.dietary_preferences}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, option => option.value);
                      updateProfile({ dietary_preferences: values });
                    }}
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="gluten-free">Gluten-free</option>
                    <option value="dairy-free">Dairy-free</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Hold Ctrl/Cmd to select multiple options</p>
                </div>

                <TagInput
                  id="allergies"
                  label="Allergies"
                  icon={<Target className="h-4 w-4 text-red-500" />}
                  tags={profile.allergies || []}
                  onTagsChange={(tags) => updateProfile({ allergies: tags })}
                  placeholder="Type and press Enter to add allergies"
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <TagInput
                  id="health-goals"
                  label="Health Goals"
                  icon={<Target className="h-4 w-4 text-blue-500" />}
                  tags={profile.health_goals || []}
                  onTagsChange={(tags) => updateProfile({ health_goals: tags })}
                  placeholder="Type and press Enter to add health goals"
                />

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-purple-500" />
                    Activity Level
                  </label>
                  <select
                    value={profile.activity_level || ''}
                    onChange={(e) => updateProfile({ activity_level: e.target.value as UserProfile['activity_level'] })}
                    className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="very_active">Very Active</option>
                    <option value="extra_active">Extra Active</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    Cooking Experience
                  </label>
                  <select
                    value={profile.cooking_experience || ''}
                    onChange={(e) => updateProfile({ cooking_experience: e.target.value as UserProfile['cooking_experience'] })}
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
                    onChange={(e) => updateProfile({ meal_plan_preference: e.target.value as UserProfile['meal_plan_preference'] })}
                    className="w-full p-3 border border-blue-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  >
                    <option value="">Select meal plan preference</option>
                    <option value="balanced">Balanced</option>
                    <option value="high_protein">High Protein</option>
                    <option value="low_carb">Low Carb</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                  </select>
                </div>

                <TagInput
                  id="favorite-cuisines"
                  label="Favorite Cuisines"
                  icon={<Utensils className="h-4 w-4 text-purple-500" />}
                  tags={profile.favorite_cuisines || []}
                  onTagsChange={(tags) => updateProfile({ favorite_cuisines: tags })}
                  placeholder="Type and press Enter to add cuisines"
                />

                <TagInput
                  id="disliked-ingredients"
                  label="Disliked Ingredients"
                  icon={<Target className="h-4 w-4 text-red-500" />}
                  tags={profile.disliked_ingredients || []}
                  onTagsChange={(tags) => updateProfile({ disliked_ingredients: tags })}
                  placeholder="Type and press Enter to add ingredients"
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="border-t border-blue-100 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  {step === totalSteps ? 'Complete' : 'Next'}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}