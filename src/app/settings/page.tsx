'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { UserProfile, ActivityLevel, CookingExperience, MealPlanPreference, CookingTime } from '@/types/database';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      alert('Failed to save profile. Please try again.');
    } else {
      alert('Profile saved successfully!');
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dietary Preferences (comma-separated)
          </label>
          <input
            type="text"
            value={profile.dietary_preferences?.join(', ') || ''}
            onChange={(e) => setProfile({
              ...profile,
              dietary_preferences: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Allergies (comma-separated)
          </label>
          <input
            type="text"
            value={profile.allergies?.join(', ') || ''}
            onChange={(e) => setProfile({
              ...profile,
              allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Health Goals (comma-separated)
          </label>
          <input
            type="text"
            value={profile.health_goals?.join(', ') || ''}
            onChange={(e) => setProfile({
              ...profile,
              health_goals: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Medical Conditions (comma-separated)
          </label>
          <input
            type="text"
            value={profile.medical_conditions?.join(', ') || ''}
            onChange={(e) => setProfile({
              ...profile,
              medical_conditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Favorite Cuisines (comma-separated)
          </label>
          <input
            type="text"
            value={profile.favorite_cuisines?.join(', ') || ''}
            onChange={(e) => setProfile({
              ...profile,
              favorite_cuisines: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Disliked Ingredients (comma-separated)
          </label>
          <input
            type="text"
            value={profile.disliked_ingredients?.join(', ') || ''}
            onChange={(e) => setProfile({
              ...profile,
              disliked_ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              value={profile.weight_in_kg || ''}
              onChange={handleNumberInput('weight_in_kg')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              value={profile.height_in_cm || ''}
              onChange={handleNumberInput('height_in_cm')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Activity Level
          </label>
          <select
            value={profile.activity_level || ''}
            onChange={handleActivityLevel}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700">
            Cooking Experience
          </label>
          <select
            value={profile.cooking_experience || ''}
            onChange={handleCookingExperience}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select cooking experience</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Meal Plan Preference
          </label>
          <select
            value={profile.meal_plan_preference || ''}
            onChange={handleMealPlanPreference}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700">
            Preferred Cooking Time
          </label>
          <select
            value={profile.cooking_time || ''}
            onChange={handleCookingTime}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select preferred cooking time</option>
            <option value="quick">Quick (15-30 mins)</option>
            <option value="moderate">Moderate (30-60 mins)</option>
            <option value="lengthy">Lengthy (60+ mins)</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 