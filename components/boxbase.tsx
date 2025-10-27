'use client';

interface BoxBaseProps {
  titulo: string | React.ReactNode;
  superTitulo?: React.ReactNode;
  children?: React.ReactNode;
  kills?: number | null;
  id?: string;
  icon?: React.ReactNode;
}

export function BoxBase({ superTitulo, titulo, children, kills = null, id, icon }: BoxBaseProps) {
  return (
    <section className="about w-full" id={id}>
      <div className="box ml-2 mr-2 h-full">
        {superTitulo && (
          <h2 className="box-title2 truncate">
            <div className="flex items-center justify-between text-sm gap-2">
              <div className="flex items-center gap-2 truncate">{superTitulo}</div>

              {/* Conteúdo à direita do supertitulo */}
              <div className="text-xs text-gray-400 shrink-0">{kills && `${kills} killed`}</div>
            </div>
          </h2>
        )}

        <h2 className="box-title flex items-center gap-2 ">
          <span className="truncate">{titulo}</span>
        </h2>

        {children}
      </div>
    </section>
  );
}
