export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type CookingExperience = 'beginner' | 'intermediate' | 'advanced';
export type MealPlanPreference = 'balanced' | 'high_protein' | 'low_carb' | 'vegetarian' | 'vegan';
export type CookingTime = 'quick' | 'moderate' | 'lengthy';

export interface UserProfile {
  id?: string;
  user_id?: string;
  dietary_preferences?: string[];
  allergies?: string[];
  health_goals?: string[];
  medical_conditions?: string[];
  favorite_cuisines?: string[];
  disliked_ingredients?: string[];
  weight_in_kg?: number;
  height_in_cm?: number;
  activity_level?: ActivityLevel;
  cooking_experience?: CookingExperience;
  meal_plan_preference?: MealPlanPreference;
  cooking_time?: CookingTime;
  created_at?: string;
  updated_at?: string;
}

export interface Ingredient {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  nutritional_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  prep_time: number;
  cook_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dietary_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  meals: {
    day: string;
    recipes: Recipe[];
  }[];
  created_at: string;
  updated_at: string;
} 