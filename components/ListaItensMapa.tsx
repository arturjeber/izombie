'use client';
import { trpc } from '@/lib/trpcClient';
import { useState } from 'react';

export const ListaItensMapa = ({ location }: { location: any }) => {
  const [error, setError] = useState<string>('');
  const utils = trpc.useUtils(); // acesso às funções de cache

  const { data: player } = trpc.user.loaduser.useQuery();

  const eat = trpc.user.eat.useMutation({
    onSuccess: () => utils.user.loaduser.invalidate(),
    onError: () => utils.user.loaduser.invalidate(),
  });

  const get = trpc.user.getItem.useMutation({
    onSuccess: () => utils.user.loaduser.invalidate(),
    onError: () => {
      setError('backpack full');
      utils.user.loaduser.invalidate();
    },
  });

  const getItem = (id: number) => {
    setError('');
    get.mutateAsync({ id });
  };

  const eatItem = async (id: number) => {
    eat.mutateAsync({ id, contaminate: player?.status === 1 });
  };

  const filterItens = (item: any) => {
    if (!player) return false;
    const playerStatus = player.status;
    if (item.quantity <= 0) return false;
    if (item.kind !== 0 && playerStatus == 1) return false;
    if ((item.effect || '')?.includes('contaminate') && playerStatus == 1) return false;

    return true;
  };
  const itens = location?.itens?.filter(filterItens);

  return (
    <>
      <div className="mt-4 text-xl  text-gray-300 ">
        Food, tools & weapons{' '}
        <span className="float-right text-sm text-amber-300 mt-1">{error}</span>
      </div>
      <div>
        {!itens || itens.length == 0
          ? 'No itens avaiable'
          : itens.sort(ordemItens).map((a: any, i: number) => {
              return (
                <div key={i} className="mb-2">
                  <span className="item-title">
                    {' '}
                    # {a?.name} ___ {a.quantity}{' '}
                  </span>
                  {player?.status === 0 && (
                    <button
                      onClick={() => getItem(a.id)}
                      className="cta-button2 cta-secondary ml-3"
                    >
                      get
                    </button>
                  )}
                  {a.kind == 0 && (
                    <button onClick={() => eatItem(a.id)} className="cta-button2 cta-secondary">
                      {player?.status === 0 ? 'eat' : 'contaminate'}
                    </button>
                  )}
                </div>
              );
            })}
      </div>
    </>
  );
};

const ordemItens = (a: any, b: any) => {
  return a.kind - b.kind || a.name.localeCompare(b.name);
};
