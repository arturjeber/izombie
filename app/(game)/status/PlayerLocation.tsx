"use client"

import { BoxBase } from "@/components/boxbase";
import { UserBar } from "@/components/userbar";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

import { Kills } from "@/components/Kills";
import { trpc } from "@/lib/trpcClient";
import { getCurrentLocation, launchDate, msToHoursMinutes } from "@/lib/utils";
import { isGameOn } from "@/lib/utilsSurvivor";
import { useRouter } from "next/navigation";
import RadioLocal from "@/components/RadioLocal";
import { ListaItensMapa } from "@/components/ListaItensMapa";
import Countdown from "@/components/Countdown";


export const PlayerLocation = () => {
	
	const { data: player, isLoading } = trpc.user.loaduser.useQuery();
	const location = player?.paths?.[0]?.map

	const {data: localPlayers } = trpc.map.getAllUsersByLocation.useQuery({id: (location?.id || 0)})
	
	const isOn = useMemo(()=>isGameOn(),[])
	
	const getTitulo = () => {
		if(!isOn) return "Waiting room"
		if(location == undefined) return "Find a location";
		return location?.name || "loading..."
	}
	
	return(
		<BoxBase titulo={getTitulo()} superTitulo={"current locatoin"}>
			{!isOn && <Countdown targetDate={launchDate}/>}
			<ListaItensMapa location={location} />
			<div className="mt-4 text-xl text-gray-300">Local radio <span className="text-base float-end mt-1">{!!localPlayers && `${localPlayers} listeners`}</span></div>
			<span className="text-base"> {!localPlayers && "Not avaible"}</span>
			{!!localPlayers && <RadioLocal estacao={location?.name as string}/>}
			
		</BoxBase>
	)
}
