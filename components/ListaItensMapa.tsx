'use client';
import { trpc } from '@/lib/trpcClient';
import { useState } from 'react';

export const ListaItensMapa = ({ location }: { location: any }) => {
  const [error, setError] = useState<string>('');
  const utils = trpc.useUtils(); // acesso às funções de cache

  const itens = location?.itens;
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
    eat.mutateAsync({ id });
  };

  return (
    <>
      <div className="mt-4 text-xl  text-gray-300 ">
        Food, tools & weapons{' '}
        <span className="float-right text-sm text-amber-300 mt-1">{error}</span>
      </div>
      <div>
        {!itens || itens.length == 0
          ? 'No itens avaiable'
          : itens
              ?.filter((a: any) => a.quantity > 0)
              .sort(ordemItens)
              .map((a: any, i: number) => {
                return (
                  <div key={i} className="mb-2">
                    <span className="item-title">
                      {' '}
                      # {a?.name} ___ {a.quantity}{' '}
                    </span>

                    <button
                      onClick={() => getItem(a.id)}
                      className="cta-button2 cta-secondary ml-3"
                    >
                      get
                    </button>
                    {a.kind == 0 && (
                      <button onClick={() => eatItem(a.id)} className="cta-button2 cta-secondary">
                        eat
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
