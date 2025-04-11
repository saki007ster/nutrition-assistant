import { createClient } from '@supabase/supabase-js';
import { UserProfile, Ingredient, Recipe } from '../types/database';

// Access environment variables directly from process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with auto refresh token settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Allow session persistence for client-side usage
    persistSession: true, 
    // Automatically refresh the token
    autoRefreshToken: true,
    // Detect session changes from other tabs/windows
    detectSessionInUrl: true,
  },
});

// User Profile Functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert([profile]) // Changed insert to upsert for potential flexibility
    .select()
    .single();

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(profile)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return data;
}

// Ingredient Functions
export async function getUserIngredients(userId: string): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
  return data ?? [];
}

export async function addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([ingredient])
    .select()
    .single();
  
  if (error) {
    console.error("Error adding ingredient:", error);
    throw error;
  }
  return data;
}

export async function updateIngredient(id: string, updates: Partial<Ingredient>): Promise<Ingredient> {
  const { data, error } = await supabase
    .from('ingredients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating ingredient:", error);
    throw error;
  }
  return data;
}

export async function deleteIngredient(id: string): Promise<void> {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting ingredient:", error);
    throw error;
  }
}

// Recipe Functions
export async function getRecipes(filters?: {
  cuisine?: string;
  difficulty?: string;
  dietary_categories?: string[];
}): Promise<Recipe[]> {
  let query = supabase.from('recipes').select('*');
  
  if (filters?.cuisine) {
    query = query.eq('cuisine', filters.cuisine);
  }
  
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  
  if (filters?.dietary_categories) {
    // Check if array is not empty before adding contains filter
    if (filters.dietary_categories.length > 0) {
      query = query.contains('dietary_categories', filters.dietary_categories);
    }
  }
  
  const { data, error } = await query.order('name', { ascending: true }); // Added sorting
  
  if (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
  return data ?? [];
}

interface FavoriteRecipeJoin {
  recipe_id: string;
  recipes: Recipe;
}

export async function getFavoriteRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('user_favorite_recipes')
    .select(`
      recipe_id,
      recipes:recipes(*)
    `)
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error fetching favorite recipes:", error);
    throw error;
  }
  return (data as unknown as FavoriteRecipeJoin[])?.map(item => item.recipes) ?? [];
}

export async function toggleFavoriteRecipe(userId: string, recipeId: string): Promise<boolean> {
  // First check if the recipe is already favorited
  const { count, error: checkError } = await supabase
    .from('user_favorite_recipes')
    .select('*', { count: 'exact', head: true }) // More efficient check
    .eq('user_id', userId)
    .eq('recipe_id', recipeId);

  if (checkError && checkError.code !== 'PGRST116') { // Ignore 'not found' error
     console.error("Error checking favorite status:", checkError);
     throw checkError;
  }
  
  // Check the count directly from the response
  const isFavorited = count === 1;

  if (isFavorited) {
    // Remove from favorites
    const { error: deleteError } = await supabase
      .from('user_favorite_recipes')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId);
    
    if (deleteError) {
      console.error("Error removing favorite:", deleteError);
      throw deleteError;
    }
    return false; // Indicates recipe was unfavorited
  } else {
    // Add to favorites
    const { error: insertError } = await supabase
      .from('user_favorite_recipes')
      .insert([{ user_id: userId, recipe_id: recipeId }]);
    
    if (insertError) {
      console.error("Error adding favorite:", insertError);
      throw insertError;
    }
    return true; // Indicates recipe was favorited
  }
} 