import { isGameOn } from "./utilsSurvivor";

export const launchDate = "2025-10-11T13:23:00";

export const msToHoursMinutes = (ms: number|null) => {
	if(ms == null) return null;
  const totalMinutes = Math.floor(ms / 60000); // 1 minuto = 60000 ms
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export const gameStatus = () => {
	const r = isGameOn();
	return r == null ? " loading round #7" : "round #7 activated"

}
