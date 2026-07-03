'use client';

import { useParams } from 'next/navigation';
import { AssetForm } from '@/components/asset-form';
import { mockAssets } from '@/lib/mock-data';

export default function EditAssetPage() {
  const params = useParams();
  const asset = mockAssets.find((a) => a.id === params.id);
  return <AssetForm mode="edit" asset={asset} />;
}
