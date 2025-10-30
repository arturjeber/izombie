'use client';

import { BoxBase } from '@/components/boxbase';
import { UserBar } from '@/components/userbar';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { trpc } from '@/lib/trpcClient';
import { calculateEnergy, launchDate, msToHoursMinutes } from '@/lib/utils';
import { isGameOn } from '@/lib/utilsSurvivor';

import { Backpack } from '@/components/Backpack';
import Image from 'next/image';

export const PlayerStatus = () => {
  const utils = trpc.useUtils(); // acesso às funções de cache

  const { data: player } = trpc.user.loaduser.useQuery();
  const updateStatus = trpc.user.updateStatus.useMutation({
    onSuccess: () => {
      utils.user.invalidate();
    },
  });

  const { data: session } = useSession();

  const [timeLeftQrCode, setTimeLeftQrCode] = useState<number>();
  const [energy, setEnergy] = useState<number | undefined>(undefined);

  const isOn = isGameOn();

  const stringTimeLeft = () => {
    if (!isOn) return 'loading round #7';
    if (timeLeftQrCode == undefined) return 'loading...';
    return msToHoursMinutes(timeLeftQrCode) || '';
  };

  const valorTimeLeft = () => {
    if (timeLeftQrCode === 0) return 0;
    return ((timeLeftQrCode || 1000 * 60 * 60 * 24) * 100) / (1000 * 60 * 60 * 24);
  };
  const stringEnergy = () => {
    if (!isOn) return '';
    if (energy == undefined) return 'loading...';
  };

  const getSuperTitulo = () => {
    const status = player?.status;
    return (
      <>
        <Image
          className="dark:invert"
          src={
            status == 0 ? '/survivorWhite.png' : status == 1 ? '/zombieWhite.png' : '/eyeWhite.png'
          }
          hidden={status == null}
          alt="zombie hand"
          width={30}
          height={30}
          priority
        />
        {status == 0 ? 'Survivor' : status == 1 ? 'Zombie' : 'Watcher'}
      </>
    );
  };
  useEffect(() => {
    if (!player || !isOn) return;

    console.log('h');
    // cálculo imediato ao carregar
    const r = calculateEnergy(player);

    if (!r) return;
    setEnergy(r.energyNow);
    setTimeLeftQrCode(r.timeLeft);

    // atualiza a cada 2 segundos (para interface suave)
    const timer = setInterval(
      () => {
        const a = calculateEnergy(player);
      },
      (60 / 60) * 1000,
    );

    return () => clearInterval(timer);
  }, [player, isOn, launchDate]);

  useEffect(() => {
    if (energy == 0 && player?.status == 0) {
      updateStatus.mutate({ status: 1, energy: 0 }); // transforma em zumbi se energia zerar
    }
  }, [energy]);

  /*
	const updateStatus = trpc.user.updateStatus.useMutation();
	if(energyNow === 0) {
		const updateStatus = trpc.user.updateStatus.useMutation();
		updateStatus.mutate({ status: 1 }); // transforma em zumbi se energia zerar
	}
	
	/**/
  return (
    <BoxBase
      superTitulo={getSuperTitulo()}
      titulo={session?.user?.name || 'loading...'}
      kills={player?._count.mortes || null}
      id="status"
    >
      <UserBar
        titulo={'Time left to scan'}
        valor={valorTimeLeft()}
        tituloRight={stringTimeLeft()}
        st={'mb-5'}
      />
      <UserBar
        titulo={'Energy'}
        valor={Math.round(energy || 100)}
        vDecor={'%'}
        tituloRight={stringEnergy()}
        st={'mb-5'}
      />
      <Backpack itens={player?.backpack} limit={player?.limitItens || 0} />
    </BoxBase>
  );
};
