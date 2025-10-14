"use client"

import { BoxBase } from "@/components/boxbase";
import { UserBar } from "@/components/userbar";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { Kills } from "@/components/Kills";
import { trpc } from "@/lib/trpcClient";
import { getCurrentLocation, launchDate, msToHoursMinutes } from "@/lib/utils";
import { isGameOn } from "@/lib/utilsSurvivor";

import Image from "next/image";


export const PlayerStatus = () => {
	const [error, setError] = useState("");
	const [timeLeftQrCode, setTimeLeftQrCode] = useState<number>();
	const [energy, setEnergy] = useState<number>(100);
	const [kills, setKills] = useState<string>("Loading...");
	const [movePlayerTo, setMovePlayerTo] = useState<object | null>(null);

	const { data: player, isLoading } = trpc.user.loaduser.useQuery();
	const updatePlayer = trpc.user.update.useMutation();
	const map = trpc.map.getLocationsByScan.useMutation();
	

	const { data: session, status } = useSession();

	const isOn = useMemo(()=>isGameOn(),[])

	const updateStatus = () => {
		
	}
	const updateEnergy = () => {
		setEnergy((p)=>{
			if(p <= 0) { updateStatus(); return 0; }
			updatePlayer.mutate({ energy: p });
			return p <= 0 ? 0 : p-1
		})
	}

	const stringTimeLeft = () => {
		console.log("isOn", player, timeLeftQrCode)
		if(!isOn) return "loading round #7"
		if(timeLeftQrCode == undefined) return "loading..."
		return msToHoursMinutes(timeLeftQrCode) || ""
	}

	const valorTimeLeft = () => {
		return (timeLeftQrCode||0)*100/(1000*60*60*24)
	}
	const stringEnergy = () => {
		if(!isOn) return ""
	}

	const getSuperTitulo = () => {
		const status = player?.status;
		return (
			<>
				<Image className="dark:invert"
					src={status == 0  ? "/survivorWhite.png" : status == 1  ? "/zombieWhite.png" : "/eyeWhite.png" }
					hidden={status == null}
					alt="zombie hand"
					width={30}
					height={30}
					priority
				/>
				{status == 0  ? "Survivor" : status == 1  ? "Zombie" : "Watcher" }
			</>
		)
	}
	useEffect(() => {
		
		if(!player) return;
		if(!isOn) return;
		setEnergy(player.energy)
		
		let lastCheck = new Date(launchDate);

		if(player.lastPathId != null) lastCheck = player.paths[0].timestamp // colocar horario leitura qr code

		console.log("gggggg", player, lastCheck, launchDate)

		const startTime = 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(lastCheck).getTime())
		
		setTimeLeftQrCode(startTime < 0 ? 0 : startTime);

		const timerTick = 1000 * 60; // 1 min
		const timer = setInterval(() => {
			setTimeLeftQrCode((prev) => {
				if(prev == undefined) return 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(lastCheck).getTime())
 				if (prev <= 1) {
					updateEnergy()
					return 0;
				}
				console.log("tick")
				return 24 * 60 * 60 * 1000 - (new Date().getTime() - new Date(lastCheck).getTime())
			});
		}, timerTick);

		return () => clearInterval(timer);
		
  }, [player]);

	return(
		<BoxBase superTitulo={getSuperTitulo()} titulo={session?.user?.name || "loading..."} status={player?.status}>			
			<UserBar  titulo={"Time left to scan"} valor={valorTimeLeft()} tituloRight={stringTimeLeft()}  st={"mb-5"} />
			<UserBar titulo={"Energy"} valor={energy} vDecor={"%"} tituloRight={stringEnergy()} st={"mb-5"} />
			<Kills kills={player?._count.mortes||0}/>
		</BoxBase>
	)
}

/*
<UserBar titulo={"Energy"} valor={92} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={82} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={72} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={62} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={52} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={42} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={32} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={22} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={12} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={6} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={5} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={4} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={3} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={2} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={1} tituloRight={stringEnergy()} st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={0} tituloRight={stringEnergy()} st={"mb-5"} />
			*/