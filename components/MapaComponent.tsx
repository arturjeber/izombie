'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type Ponto = {
  latitude: number;
  longitude: number;
  name?: string;
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
  const [isClient, setIsClient] = useState(false);

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
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
      <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {pontos.map((ponto, idx) => (
          <Marker key={idx} position={[ponto.latitude, ponto.longitude]}>
            <Popup>{ponto.name || 'Local sem nome'}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
