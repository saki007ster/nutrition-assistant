'use client';

import { useState } from 'react';
import { UserProfile } from '@/types/database';

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
    console.log('Updating profile with:', updates);
    setProfile(prev => ({ ...prev, ...updates }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Tell us about yourself</h2>
          <p className="text-sm text-gray-500 mt-1">Step {step} of {totalSteps}</p>
          {error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error.message}
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Dietary Preferences</label>
              <select
                multiple
                className="w-full p-2 border rounded"
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
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Allergies</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter allergies separated by commas"
                value={profile.allergies?.join(', ') || ''}
                onChange={(e) => updateProfile({
                  allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Health Goals</label>
              <select
                multiple
                className="w-full p-2 border rounded"
                value={profile.health_goals}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  updateProfile({ health_goals: values });
                }}
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="heart-health">Heart Health</option>
                <option value="energy-boost">Energy Boost</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Activity Level</label>
              <select
                className="w-full p-2 border rounded"
                value={profile.activity_level}
                onChange={(e) => updateProfile({ activity_level: e.target.value as UserProfile['activity_level'] })}
              >
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cooking Experience</label>
              <select
                className="w-full p-2 border rounded"
                value={profile.cooking_experience}
                onChange={(e) => updateProfile({ cooking_experience: e.target.value as UserProfile['cooking_experience'] })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meal Plan Preference</label>
              <select
                className="w-full p-2 border rounded"
                value={profile.meal_plan_preference}
                onChange={(e) => updateProfile({ meal_plan_preference: e.target.value as UserProfile['meal_plan_preference'] })}
              >
                <option value="balanced">Balanced</option>
                <option value="low_carb">Low Carb</option>
                <option value="high_protein">High Protein</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Favorite Cuisines</label>
              <select
                multiple
                className="w-full p-2 border rounded"
                value={profile.favorite_cuisines}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  updateProfile({ favorite_cuisines: values });
                }}
              >
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="chinese">Chinese</option>
                <option value="indian">Indian</option>
                <option value="japanese">Japanese</option>
                <option value="thai">Thai</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : step === totalSteps ? 'Save' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}