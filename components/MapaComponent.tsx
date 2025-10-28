'use client';

import { useScrollTo } from '@/hooks/useScrollto';
import { trpc } from '@/lib/trpcClient';
import { getCurrentLocation, haversine } from '@/lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type Ponto = {
  latitude: number;
  longitude: number;
  name?: string;
  status?: number;
  id?: number;
};

type MapaProps = {
  pontos?: Ponto[];
  center?: [number, number];
  zoom?: number;
};

export default function MapaComponent({
  pontos = [],
  center = [-33.45, -70.65],
  zoom = 12,
}: MapaProps) {
  console.log('pontos no mapa component', pontos);
  const utils = trpc.useUtils(); // acesso às funções de cache
  const scrollTo = useScrollTo();

  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const door = trpc.user.openDoor.useMutation({
    onSuccess: () => {
      utils.user.loaduser.invalidate();
      scrollTo('mylocation');
    },
  });

  const { data: player } = trpc.user.loaduser.useQuery();

  const checkin = async (ponto: Ponto) => {
    //pega o geolocalização do usuário
    const location = await getCurrentLocation();
    const d = haversine(location.latitude, location.longitude, ponto.latitude, ponto.longitude);

    console.log('distancia do check-in:', d, ponto);

    if (d > 100) setError('Not close enough to check-in (max 100m)');
    else {
      if (!location || !player) return;

      try {
        await door.mutateAsync({
          latitude: location.latitude as number,
          longitude: location.longitude as number,
          accuracy: location.accuracy as number,
          timestamp: location.timestamp,
          playerId: player.id,
          mapId: ponto.id as number,
        });
      } catch (err: any) {
        setError(err.message || 'Error during check-in');
      }
    }
  };

  useEffect(() => {
    setIsClient(true);

    // Corrige ícones padrão do Leaflet
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    });
  }, []);

  if (!isClient) return null;

  return (
    <>
      {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
        <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {pontos.map((ponto, idx) => (
            <Marker key={idx} position={[ponto.latitude, ponto.longitude]}>
              <Popup>
                {ponto.status === 1 ? (
                  <button type="button" className=" cta-map" onClick={() => checkin(ponto)}>
                    <div className="mb-1">
                      <b>Check-in</b>
                    </div>
                    {ponto.name || 'No name'}
                  </button>
                ) : (
                  <div>
                    <b>{ponto.name || 'No name'}</b>
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
