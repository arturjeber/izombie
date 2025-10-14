"use client";
import { BoxBase } from "@/components/boxbase";
import { trpc } from "@/lib/trpcClient";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function RadioLocal({estacao}:{estacao: string}) {

	const [text, setText] = useState("");
	const [canSend, setCanSend] = useState(true);

	const { data: session, status } = useSession();
	const user = session?.user.name;

	const utils = trpc.useUtils();
	const { data: messages } = trpc.chat.getMessages.useQuery(undefined, {
		refetchInterval: 1000, // atualiza a cada 1s
	});

	const sendMessage = trpc.chat.send.useMutation({
		onSuccess: () => {
			setText("");
			utils.chat.getMessages.invalidate();
			setCanSend(false); // 🔒 desabilita botão
			setTimeout(() => setCanSend(true), 5000); // ⏱ habilita após 5s

		},
		//onError: (err) => alert(err.message),
	});



	return (
		
			<>
				<div className="h-50 overflow-y-auto  p-2 mb-3 ">
					{messages?.length ? (
						messages?.filter(msg => msg.estacao === estacao).map((msg) => (
							<div
								key={msg.id}
								className={`p-0 `}
							>
								<strong className={`${
									msg.user === user ? "text-blue-400" : "text-gray-300"
								}`}>{msg.user}:</strong> {msg.text}
							</div>
						))
					) : (
						<div className="text-gray-500 text-center">silence...</div>
					)}
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (!text.trim() || !canSend) return;
						sendMessage.mutate({ user: session?.user.name as string, text, estacao });
					}}
					className="flex gap-2"
				>
					<input
						type="text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Type..."
						className="flex-1 p-2 rounded bg-gray-700"
					/>
					<button
						type="submit"
						disabled={!canSend || sendMessage.isPending}
						className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded"
					>
						{sendMessage.isPending ? "Sending..." : canSend ? "send" : "Wait 5s"}
					</button>
				</form>
			</>
		
	);
}
