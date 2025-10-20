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
import dynamic from "next/dynamic";
import { util } from "zod";


export const PlayerBunker = () => {
	const [pontos, setPontos] = useState<any>([])
	const [error, setError] = useState<any>([])
	const [showMap, setShowMap] = useState<boolean>(false)

	const utils = trpc.useUtils(); // acesso às funções de cache


	const { data: player, isLoading } = trpc.user.loaduser.useQuery();
	const location = player?.paths?.[0]?.map

	const createBunker = trpc.map.createBunker.useMutation({
		onSuccess: () => {
			setPontos([]);
			setError("");
			utils.user.loaduser.invalidate();
			utils.map.getAllByUser.invalidate();
		},
	});



	const Mapa = dynamic(() => import('@/components/MapaComponent'), { ssr: false });
	
	
	const checkLocation = async () => {
		const location = await getCurrentLocation();
		setPontos([{ latitude: location.latitude, longitude: location.longitude}])
		setError("")
		setShowMap(true)
		
	}
	
	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = {
			name: formData.get("name") as string,
			description: formData.get("description") as string
		};

		const res = await createBunker.mutateAsync({
			name: data.name,
			description: data.description,
			latitude: pontos[0].latitude,
			longitude: pontos[0].longitude,
		})

		setShowMap(false)
		if(!res) setError("Location unable to create bunker")
		else setError("Created")
		

	}
	

	return(
		<BoxBase titulo={"New Bunker"} superTitulo={"create hidden location"}>
			<div className="text-2xl text-center mt-4">{error && <p className="text-red-500">{error}</p>}</div>
			{!showMap ?
				<div className="mt-4">
					<button onClick={checkLocation} className="cta-button cta-primary w-full">Check Location</button>
				</div>
				:
				<>
					
					
						<form onSubmit={handleSubmit} className="form mt-8">
							<div className="form-group">
								<label htmlFor="name">Name</label>
								<input type="text" id="name" name="name" required />
							</div>

							<div className="form-group">
								<label htmlFor="description">Description</label>
								<input type="text" id="description" name="description" />
							</div>
							
							
							
							<button type="submit" className="submit-btn">Create bunker</button>
							
						</form>
					
						<button type="button" onClick={()=>setShowMap(false)} className="cta-button cta-secondary w-full mb-4 mt-4">Cancel</button>
											

				</>
			}
			
			{showMap &&
				<Mapa pontos={pontos} zoom={15} 
				center={[location?.latitude as number || 0, location?.longitude as number || 0]} />
			}
		</BoxBase>
	)
}
