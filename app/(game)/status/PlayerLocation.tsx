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


export const PlayerLocation = () => {
	
	const [error, setError] = useState("");
	
	const { data: player, isLoading } = trpc.user.loaduser.useQuery();
	const location = player?.paths?.[0]?.map

	const {data: localPlayers } = trpc.map.getAllUsersByLocation.useQuery({id:location?.id as number})

	console.log("ooo", localPlayers)
	
	const { data: session, status } = useSession();

	const isOn = useMemo(()=>isGameOn(),[])
	

	const getTitulo = () => {
		if(!isOn) return "Not started"
		if(location == undefined) return "Find a location";
		return location?.name || "loading..."
	}
	
	return(
		<BoxBase titulo={getTitulo()} superTitulo={"current locatoin"}>
			<ListaArmas armas={location?.armas}/>
			<ListaItens comidas={location?.comidas}/>
			<div className="mt-4 text-xl text-gray-300">Local radio - <span className="text-base">listeners: {localPlayers}</span></div>
			<RadioLocal estacao={location?.name as string}/>
			
		</BoxBase>
	)
}

const ListaArmas = ({armas}: {armas: any}) => {

	const getArma = (a: object) => {
		console.log("get arma", a)
	}

	return(
		<>
		<div className="mt-4 text-xl text-gray-300">Weapons</div>
		<div>
			{ (!armas || armas.length == 0) ? "No weapon avaiable" :
				armas?.map((a: any, i: number)=>{ 
					return (
					<div key={i}>
						<span>{a?.name}  </span>
						<span className="text-sm ml-2">( size: {a?.size} )</span>						
						<button onClick={()=>getArma(a)} className="cta-button2 cta-secondary">get</button>
					</div>
					)
				})
			}
		</div>
		</>
	)
}

const ListaItens = ({comidas}: {comidas: any}) => {

	const getComida = (a: object) => {
		console.log("get arma", a)
	}

	return(
		<>
		<div className="mt-4 text-xl text-gray-300">Itens</div>
		<div>
			{ !comidas || comidas.length == 0 ? "No itens avaiable" :
				comidas?.map((a: any, i: number)=>{ 
					return (
					<div key={i}>
						<span>{a?.comida} </span>
						<button onClick={()=>getComida(a)} className="cta-button2 cta-secondary">eat</button>
					</div>
					)
				})
			}
		</div>
		</>
	)
}