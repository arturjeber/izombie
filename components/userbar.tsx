interface UserBarProps {
  titulo?: string;
  tituloRight?: string;
	valor?: number | null;
	vDecor?: string ;
	cor?: string;
	st?: string;
}

export const UserBar = ({titulo, tituloRight, valor, vDecor, cor, st} : UserBarProps) => {

	const getRight = (): string => {
		if(tituloRight) return tituloRight;
		if (valor === undefined || valor === null) {
			return tituloRight || "";
		}
	
		return `${valor}${vDecor ? ` ${vDecor}` : ""}`;
	};

	const getCor = () => {
		if (valor === undefined || valor === null || isNaN(valor)) {
			return cor ?? "#f5f5f5" // branco ou a cor passada
		}

		return valor === 100 ? "#22c55e" // verde mais claro
    : valor > 80 ? "#16a34a" // verde escuro
    : valor > 50 ? "#facc15" // amarelo
    : valor > 40 ? "#fbbf24" // laranja claro
    : valor > 30 ? "#f97316" // laranja escuro
    : valor > 20 ? "#ef4444" // vermelho claro
    : valor > 10 ? "#dc2626" // vermelho médio
    : valor > 5 ? "#b91c1c" // vermelho escuro
    : valor > 4 ? "#831010" // marrom avermelhado
    : valor > 3 ? "#5c0000" // bordô
    : valor > 2 ? "#3b0000" // bordô escuro
    : valor > 1 ? "#1a0000" // quase preto
    : "#000000" // preto total); // red-800

	}

	const getSizeCor = () => {
		// Limita o valor entre 0 e 100
		const width = Math.min(100, Math.max(0, valor ?? 100));
	
		return {
			backgroundColor: getCor(),
			width: `${width}%`,
			transition: "width 0.3s ease, background-color 0.3s ease",
		};
	};
	

	return(
		<div className={`w-full ${st}`}>
			<div className="flex items-center justify-between gap-4 mb-2">
				<h6
					className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
					{titulo}
				</h6>
				<h6 
					className="block font-sans text-base antialiased leading-relaxed tracking-normal text-blue-gray-900">
					{getRight()}
				</h6>
			</div>
			<div
				className="flex-start flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-700 font-sans text-xs font-medium">
				<div style={getSizeCor()}
					className={`flex items-center justify-center  h-full  overflow-hidden text-white break-all rounded-full`}>
				</div>
			</div>
		</div>
	)
}