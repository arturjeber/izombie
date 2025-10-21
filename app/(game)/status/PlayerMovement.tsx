'use client';

import { BoxBase } from '@/components/boxbase';
import QRCameraScanner from '@/components/qrReader';
import { trpc } from '@/lib/trpcClient';
import { getCurrentLocation } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';

export const PlayerMoviment = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [movePlayerTo, setMovePlayerTo] = useState<any | null>(null);
  const [location, setLocation] = useState<any>(null);

  const { data: player } = trpc.user.loaduser.useQuery();
  const door = trpc.user.openDoor.useMutation();
  const map = trpc.map.getLocationsByScan.useMutation();

  const utils = trpc.useUtils();

  const enterDoor = async () => {
    if (!location || !player || !movePlayerTo) return;

    await door.mutateAsync({
      latitude: location.latitude as number,
      longitude: location.longitude as number,
      accuracy: location.accuracy as number,
      timestamp: location.timestamp,
      playerId: player.id,
      mapId: movePlayerTo.id,
    });

    utils.map.getAllByUser.invalidate();
    utils.user.loaduser.invalidate(); // refaz a query loaduser
    setMovePlayerTo(null);
  };

  const cancelMove = () => {
    setMovePlayerTo(null);
  };

  const newLocation = useCallback(
    async (qrInfo: string) => {
      console.log('jkjdakja', qrInfo);
      const location = await getCurrentLocation();
      const t = await map.mutateAsync({ lat: location.latitude, long: location.longitude });
      console.log('lll', t);
      if (t) {
        setMovePlayerTo(t[0]);
        setLocation(location);
        setLoading(false);
      }
    },
    [map],
  );

  const teste = () => {
    console.log('oi');
  };

  useEffect(() => {
    // Verifica se o hash é "#moveto"
    if (window.location.hash === '#moveto') {
      newLocation('#moveto');
    } else setLoading(false);
  }, [newLocation]); // roda sempre que o hash muda

  return (
    <BoxBase
      titulo={loading ? 'loading' : (movePlayerTo?.name ?? 'Go to')}
      superTitulo={'move to another place'}
    >
      <button type="button" onClick={teste} className="cta-primary btn-primary">
        teste
      </button>
      {loading ? (
        ''
      ) : movePlayerTo ? (
        <QrCodeDoor location={movePlayerTo} enter={enterDoor} cancel={cancelMove} />
      ) : (
        <QRCameraScanner onScanResult={newLocation} />
      )}
    </BoxBase>
  );
};

const QrCodeDoor = ({
  location,
  cancel,
  enter,
}: {
  location: any | null;
  cancel: any;
  enter: any;
}) => {
  if (!location) return null;

  const mural = location?.comunicados ?? []; // garante que seja array

  return (
    <div>
      <div className="subtitle -mt-4! -mb-2!">{location.description}</div>
      <div className="subtitle2">Signs around</div>
      {mural.map((a: any, index: number) => (
        <div key={index}>
          <span>
            #{index + 1} - {a.mensagem}
          </span>
        </div>
      ))}

      <div className="mt-4">
        <button onClick={enter} className="cta-button cta-primary w-full">
          Proceed to the door
        </button>
      </div>
      <div className="mt-4">
        <button onClick={cancel} className="cta-button cta-secondary w-full">
          Cancel
        </button>
      </div>
    </div>
  );
};
