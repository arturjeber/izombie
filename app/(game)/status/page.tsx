"use client"

import { isGameOn } from "@/lib/utilsSurvivor";
import { PlayerLocation } from "./PlayerLocation";
import { PlayerMoviment } from "./PlayerMovement";
import { PlayerStatus } from "./PlayerStatus";


import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RadioPublic from "./RadioPublic";
import { MapaPublic } from "./MapaPublic";


export default function StatusPage() {
	
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-[100px]">
			<PlayerStatus />
			<PlayerLocation />
			{isGameOn() && <PlayerMoviment />}
			<RadioPublic />
			<MapaPublic />
		</div>

		
	)
}


