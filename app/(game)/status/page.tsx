"use client"

import { BoxBase } from "@/components/boxbase";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { UserBar } from "@/components/userbar";

import { trpc } from "@/lib/trpcClient";
import { launchDate, msToHoursMinutes } from "@/lib/utils";
import { isGameOn, timeLeftQrCode } from "@/lib/utilsSurvivor";
import { redirect } from "next/dist/server/api-utils";
import { Kills } from "@/components/Kills";
import { kill } from "process";




export default function StatusPage() {
	const [error, setError] = useState("");
	const [player, setPlayer] = useState<any>(null);
	const [timeLeftQrCode, setTimeLeftQrCode] = useState<number>();
	const [energy, setEnergy] = useState<number>(100);
	const [kills, setKills] = useState<string>("Loading...");

	const { data: session, status } = useSession();

	const isOn = useMemo(()=>isGameOn(),[])

	const updateStatus = () => {
		
	}
	const updateEnergy = () => {
		setEnergy((p)=>{
			if(p <= 0) { updateStatus(); return 0; }
			return p-33 < 0 ? 0 : p-33
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

	const loadUser = async() => {
		setPlayer(await trpc.user.loaduser.mutate());	
		
	}
	useEffect(() => {
		
		if(!player) return;
		if(!isOn) return;
		
		let lastCheck = launchDate;
		if(player.lastPathId != null) lastCheck = launchDate // colocar horario leitura qr code
		
		setTimeLeftQrCode(new Date().getTime() - new Date(lastCheck).getTime());

		const timerTick = 1000 * 60; // 1 min
		const timer = setInterval(() => {
			setTimeLeftQrCode((prev) => {
				if(prev == undefined) return new Date().getTime() - new Date(lastCheck).getTime()
 				if (prev <= 1) {
					updateEnergy()
					return 0;
				}
				return new Date().getTime() - new Date(lastCheck).getTime();
			});
		}, timerTick);

		return () => clearInterval(timer);
		
  }, [player]);

	useEffect(()=>{
		loadUser()
	},[])

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
			<BoxBase titulo={session?.user?.name || "loading..."}>
				<UserBar titulo={"Time left to scan"} valor={valorTimeLeft()} tituloRight={stringTimeLeft()}  st={"mb-5"} />
				<UserBar titulo={"Energy"} valor={energy} vDecor={"%"} tituloRight={stringEnergy()} st={"mb-5"} />
				<Kills kills={player._count.mortes}/>
			</BoxBase>
		</div>

		
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