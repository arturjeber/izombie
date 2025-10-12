interface BoxBaseProps {
  titulo: string;
	children?: React.ReactNode;
}

export function BoxBase({ titulo, children }: BoxBaseProps) {
  return (
    <section className="contact w-full">
      <div className="box ml-2 mr-2">
				<h2 className="box-title truncate">{titulo}</h2>
				{children}
      </div>
    </section>
  );
}
