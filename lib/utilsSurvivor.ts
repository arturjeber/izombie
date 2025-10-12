import { launchDate } from "./utils";
import { msToHoursMinutes } from "./utils";

export const isGameOn = () => {
	const diffStart = new Date().getTime() - new Date(launchDate).getTime()
	if(diffStart < 0) return null;

	return diffStart;
}

export const timeLeftQrCode = (player: any) => {
	if (!player) return 0;
	
	const diffStart = new Date().getTime() - new Date(player.lastPathId).getTime();

	if(diffStart < 0) return 0
	else return diffStart
}

