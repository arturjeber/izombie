"use client"

import { BoxBase } from "@/components/boxbase"
import MapaComponent from "@/components/MapaComponent"
import dynamic from 'next/dynamic';

import { trpc } from "@/lib/trpcClient"

export const MapaPublic = () => {
	const {data: pontos, isLoading} = trpc.map.getAllByUser.useQuery()

	const Mapa = dynamic(() => import('@/components/MapaComponent'), { ssr: false });

	return(
		<BoxBase superTitulo="known locations" titulo="Map">
 				<Mapa pontos={pontos} />
		</BoxBase>
	)
}