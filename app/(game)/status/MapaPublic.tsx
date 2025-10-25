'use client';

import { BoxBase } from '@/components/boxbase';
import dynamic from 'next/dynamic';

import { trpc } from '@/lib/trpcClient';

export const MapaPublic = () => {
  const { data: pontos } = trpc.map.getAllByUser.useQuery();
  console.log('pontos', pontos);

  const Mapa = dynamic(() => import('@/components/MapaComponent'), { ssr: false });

  return (
    <BoxBase superTitulo="known locations" titulo="Map">
      <Mapa pontos={pontos} />
    </BoxBase>
  );
};
