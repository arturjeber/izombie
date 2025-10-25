'use client';

import { BoxBase } from '@/components/boxbase';
import { UserBar } from '@/components/userbar';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { trpc } from '@/lib/trpcClient';
import { launchDate, msToHoursMinutes } from '@/lib/utils';
import { isGameOn } from '@/lib/utilsSurvivor';

import { Backpack } from '@/components/Backpack';
import Image from 'next/image';

export const PlayerStatus = () => {
  const { data: player } = trpc.user.loaduser.useQuery();
  const updatePlayer = trpc.user.update.useMutation();

  const { data: session } = useSession();

  const [timeLeftQrCode, setTimeLeftQrCode] = useState<number>();
  const [energy, setEnergy] = useState<number>(player?.energy ?? 100);

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

    const lastCheck =
      player.lastPathId != null ? new Date(player.paths[0].timestamp) : new Date(launchDate);

    const DECAY_NORMAL = 0.028; // % por minuto
    const DECAY_FAST = 0.167; // % por minuto após 24h sem QR
    const MAX_TIME = 24 * 60 * 60 * 1000; // 24h em ms
    const timerTick = 1000; // 1s

    const timer = setInterval(() => {
      const elapsed = Date.now() - lastCheck.getTime();
      const minutesSinceCheck = elapsed / 60000;

      setTimeLeftQrCode(Math.max(MAX_TIME - elapsed, 0));

      const decayRate = minutesSinceCheck < 24 * 60 ? DECAY_NORMAL : DECAY_FAST;

      setEnergy((prevEnergy) => {
        console.log('JHHH', player.energy, prevEnergy);
        if (prevEnergy !== player?.energy) prevEnergy = player.energy ?? 100;

        let newEnergy = prevEnergy - decayRate / 60;

        if (newEnergy < 0) newEnergy = 0;
        if (newEnergy > 100) newEnergy = 100;

        // atualiza backend somente se houver diferença
        if (Math.round(newEnergy) !== Math.round(prevEnergy)) {
          updatePlayer.mutate({ energy: Math.round(newEnergy) });
        }

        return newEnergy;
      });
    }, timerTick);

    return () => clearInterval(timer);
  }, [player, isOn]);

  return (
    <BoxBase
      superTitulo={getSuperTitulo()}
      titulo={session?.user?.name || 'loading...'}
      kills={player?._count.mortes || null}
    >
      <UserBar
        titulo={'Time left to scan'}
        valor={valorTimeLeft()}
        tituloRight={stringTimeLeft()}
        st={'mb-5'}
      />
      <UserBar
        titulo={'Energy'}
        valor={Math.round(energy)}
        vDecor={'%'}
        tituloRight={stringEnergy()}
        st={'mb-5'}
      />
      <Backpack itens={player?.backpack} limit={player?.limitItens || 0} />
    </BoxBase>
  );
};
