'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
}

export default function InventoryManager() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchIngredients = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', session.user.id)
        .order('name');

      if (error) {
        console.error('Error fetching ingredients:', error);
        return;
      }

      setIngredients(data || []);
      setIsLoading(false);
    };

    fetchIngredients();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Ingredients</h2>
      {ingredients.length === 0 ? (
        <p className="text-gray-500">No ingredients added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="font-semibold">{ingredient.name}</h3>
              <p className="text-gray-600">
                {ingredient.quantity} {ingredient.unit}
              </p>
              {ingredient.expiry_date && (
                <p className="text-sm text-gray-500">
                  Expires: {new Date(ingredient.expiry_date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <Button
        onClick={() => {/* Add ingredient logic */}}
        className="mt-4"
      >
        Add Ingredient
      </Button>
    </div>
  );
}