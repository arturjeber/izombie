"use client"

interface BoxBaseProps {
  titulo: string;
  superTitulo?: React.ReactNode;
	children?: React.ReactNode;
	status?: number | null;
}

export function BoxBase({ superTitulo, titulo, children, status = null }: BoxBaseProps) {
  return (
    <section className="about w-full ">
			
      <div className="box ml-2 mr-2 h-full">
				{superTitulo &&
					<h2 className="box-title2 truncate">
						<div className="flex items-center text-sm gap-2">
							{superTitulo}
						</div>	
					</h2>
				}			
				<h2 className="box-title flex items-center gap-2 ">
					
					<span className="truncate">{titulo}</span>
				</h2>
				
				
				{children}
      </div>
    </section>
  );
}
