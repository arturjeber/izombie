"use client"
import { trpc } from "@/lib/trpcClient";



export const Backpack = ({itens, limit}: {itens: any, limit: number}) => {
	const utils = trpc.useUtils(); // acesso às funções de cache

	
	const eat = trpc.user.eat.useMutation({
		onSuccess: () => utils.user.loaduser.invalidate()
	})

	const drop = trpc.user.dropItem.useMutation({
		onSuccess: () => utils.user.loaduser.invalidate()
	})
	
	const dropItem = (id: number) => {
		drop.mutateAsync({id})
	}

	const eatItem = async (id: number) => {
		eat.mutateAsync({id})
	}

	const avaiable = limit - itens?.reduce((acc: number, item:any) => acc + item.size * item.quantity, 0);

	return(
		<>
		<div className="mt-4 mb-3 text-xl text-gray-300">Food, tools & weapons <span className="text-sm float-end mt-1">{avaiable} spots</span></div>
		<div>
			{ !itens || itens.length == 0 ? "No itens avaiable" :
				itens?.filter((a:any) => a.quantity > 0).sort(ordemItens).map((a: any, i: number)=>{ 
					return (
					<div key={i} className="mb-2">
						<span className="item-title"> # {a?.name} ___ {a.quantity} </span>
						
						<button onClick={()=>dropItem(a.id)} className="cta-button2 cta-secondary ml-3">Drop</button>
						{a.kind == 0 && <button onClick={()=>eatItem(a.id)} className="cta-button2 cta-secondary">eat</button>}
					</div>
					)
				})
			}
		</div>
		</>
	)
}

const ordemItens = (a:any, b:any) => {
	return a.kind - b.kind || a.name.localeCompare(b.name)
}