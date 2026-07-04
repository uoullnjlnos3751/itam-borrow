import { supabase } from '../supabase';
import { Asset, AssetCategory } from '../database.types';
import { mockAssets, mockCategories } from '../mock-data';

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

export async function getAssets(): Promise<Asset[]> {
  if (isMock) {
    return Promise.resolve(mockAssets.filter(a => !a.deleted_at));
  }
  
  const { data, error } = await supabase
    .from('assets')
    .select('*, asset_categories(*)')
    .is('deleted_at', null);
    
  if (error) {
    console.error('Error fetching assets:', error);
    return [];
  }
  
  return data as Asset[];
}

export async function getAssetById(id: string): Promise<Asset | null> {
  if (isMock) {
    return Promise.resolve(mockAssets.find(a => a.id === id) || null);
  }

  const { data, error } = await supabase
    .from('assets')
    .select('*, asset_categories(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching asset ${id}:`, error);
    return null;
  }

  return data as Asset;
}

export async function getCategories(): Promise<AssetCategory[]> {
  if (isMock) {
    return Promise.resolve(mockCategories);
  }

  const { data, error } = await supabase
    .from('asset_categories')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as AssetCategory[];
}
