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
  const [timeLeftQrCode, setTimeLeftQrCode] = useState<number>();
  const [energy, setEnergy] = useState<number>(100);

  const { data: player } = trpc.user.loaduser.useQuery();
  const updatePlayer = trpc.user.update.useMutation();

  const { data: session } = useSession();

  const isOn = isGameOn();

  const updateStatus = () => {};
  const updateEnergy = (lastCheck: Date) => {
    const DURACAO_TOTAL_MS = 60 * 60 * 1000; // 1 hora em milissegundos

    const diffs =
      DURACAO_TOTAL_MS -
      (new Date().getTime() - new Date(lastCheck).getTime() - 24 * DURACAO_TOTAL_MS);

    let energy = Math.round((diffs / DURACAO_TOTAL_MS) * 100);

    // limitar entre 0 e 100
    if (energy > 100) energy = 100;
    if (energy < 0) energy = 0;

    updatePlayer.mutate({ energy });
    setEnergy(energy);
  };

  const stringTimeLeft = () => {
    if (!isOn) return 'loading round #7';
    if (timeLeftQrCode == undefined) return 'loading...';
    return msToHoursMinutes(timeLeftQrCode) || '';
  };

  const valorTimeLeft = () => {
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
    console.log('play', player);
    if (!player) return;
    if (!isOn) return;

    setEnergy(player.energy);

    let lastCheck = new Date(launchDate);
    if (player.lastPathId != null) lastCheck = player.paths[0].timestamp; // colocar horario leitura qr code

    const startTime = 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(lastCheck).getTime());

    if (startTime < 0) {
      setTimeLeftQrCode(0);
      updateEnergy(lastCheck);
    } else setTimeLeftQrCode(startTime);

    const timerTick = 1000; // * 60; // 1 min
    const timer = setInterval(() => {
      setTimeLeftQrCode((prev) => {
        console.log('PREV', prev);
        if (prev == undefined) return startTime;
        if (prev < 1000 * 60) {
          updateEnergy(lastCheck);
          return 1;
        }
        return 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(lastCheck).getTime());
      });
    }, timerTick);

    return () => clearInterval(timer);
  }, [player]);

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
        valor={energy}
        vDecor={'%'}
        tituloRight={stringEnergy()}
        st={'mb-5'}
      />
      <Backpack itens={player?.backpack} limit={player?.limitItens || 0} />
    </BoxBase>
  );
};
