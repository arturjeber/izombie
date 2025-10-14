"use client";
import { BoxBase } from "@/components/boxbase";
import RadioLocal from "@/components/RadioLocal";
import { trpc } from "@/lib/trpcClient";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function RadioPublic() {

  return (
		<BoxBase superTitulo={"broadcast"} titulo="Public Radio">			
			<RadioLocal estacao={"public"} />
		</BoxBase>
  );
}
