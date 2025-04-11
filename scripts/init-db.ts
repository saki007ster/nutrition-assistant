import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const sampleRecipes = [
  {
    name: 'Quinoa Buddha Bowl',
    ingredients: [
      { name: 'quinoa', quantity: 100, unit: 'g' },
      { name: 'chickpeas', quantity: 200, unit: 'g' },
      { name: 'sweet potato', quantity: 1, unit: 'pcs' },
      { name: 'kale', quantity: 100, unit: 'g' },
      { name: 'avocado', quantity: 1, unit: 'pcs' }
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Roast chickpeas and diced sweet potato with olive oil and spices',
      'Massage kale with olive oil and lemon juice',
      'Assemble bowl with quinoa base, roasted vegetables, and sliced avocado'
    ],
    nutritional_info: {
      calories: 450,
      protein: 15,
      carbs: 65,
      fat: 18,
      fiber: 12
    },
    prep_time: 15,
    cook_time: 20,
    difficulty: 'easy',
    cuisine: 'international',
    dietary_categories: ['vegetarian', 'vegan', 'gluten-free']
  },
  {
    name: 'Grilled Chicken Salad',
    ingredients: [
      { name: 'chicken breast', quantity: 200, unit: 'g' },
      { name: 'mixed greens', quantity: 100, unit: 'g' },
      { name: 'cherry tomatoes', quantity: 100, unit: 'g' },
      { name: 'cucumber', quantity: 1, unit: 'pcs' },
      { name: 'olive oil', quantity: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Season chicken breast with salt, pepper, and herbs',
      'Grill chicken until cooked through',
      'Wash and chop vegetables',
      'Slice grilled chicken',
      'Assemble salad and drizzle with olive oil and balsamic vinegar'
    ],
    nutritional_info: {
      calories: 350,
      protein: 35,
      carbs: 10,
      fat: 20,
      fiber: 4
    },
    prep_time: 10,
    cook_time: 15,
    difficulty: 'easy',
    cuisine: 'international',
    dietary_categories: ['high-protein', 'low-carb', 'gluten-free']
  }
];

async function initializeDatabase() {
  try {
    const now = new Date().toISOString();
    
    // Insert sample recipes
    const { error: recipesError } = await supabase
      .from('recipes')
      .insert(
        sampleRecipes.map(recipe => ({
          ...recipe,
          created_at: now,
          updated_at: now
        }))
      );

    if (recipesError) {
      throw recipesError;
    }

    console.log('Successfully initialized database with sample recipes');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase(); 