import { isGameOn } from './utilsSurvivor';

export const launchDate =
  process.env.NODE_ENV === 'production' ? '2025-11-11T23:23:23.000Z' : '2025-10-26T08:18:00.000Z';

export const msToHoursMinutes = (ms: number | null) => {
  if (ms == null) return null;
  const totalMinutes = Math.floor(ms / 60000); // 1 minuto = 60000 ms
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const gameStatus = () => {
  const r = isGameOn();
  return r == null ? ' loading round #7' : 'round #7 activated';
};

/**
 * Pega a localização atual do usuário via GPS.
 * Retorna uma Promise que resolve com { latitude, longitude, accuracy, timestamp }.
 */
export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalização não suportada'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        resolve({ latitude, longitude, accuracy, timestamp: pos.timestamp });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000; // raio da Terra em metros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distância em metros
}

export const calculateEnergy = (player: any) => {
  if (!player) return;
  console.log('Calculating energy for player:', player);

  const lastCheck = player.lastPathId
    ? new Date(player.paths[player.paths.length - 1]?.timestamp ?? launchDate)
    : new Date(launchDate);

  const DECAY_NORMAL = 0.028 / 100; // fração por minuto (0.028%)
  const DECAY_FAST = 0.167 / 100; // fração por minuto (0.167%)
  const MAX_TIME = 24 * 60 * 60 * 1000; // 24h

  const elapsed = Date.now() - lastCheck.getTime();
  const minutesSinceCheck = elapsed / 60000;

  let energyNow = player.energy ?? 100;

  if (minutesSinceCheck <= 24 * 60) {
    // fase normal
    energyNow = energyNow * Math.pow(1 - DECAY_NORMAL, minutesSinceCheck);
  } else {
    // fase normal + fase acelerada
    const minutesFast = minutesSinceCheck - 24 * 60;
    const afterNormal = energyNow * Math.pow(1 - DECAY_NORMAL, 24 * 60);
    energyNow = afterNormal * Math.pow(1 - DECAY_FAST, minutesFast);
  }

  energyNow = Math.max(0, energyNow);
  const timeLeft = Math.max(MAX_TIME - elapsed, 0);

  return { energyNow, timeLeft };
};
