'use client';
import { BoxBase } from '@/components/boxbase';
import { trpc } from '@/lib/trpcClient';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function RadioLocal({ estacao }: { estacao: string }) {
  const [text, setText] = useState('');
  const [canSend, setCanSend] = useState(true);

  const { data: session, status } = useSession();
  const user = session?.user.name;

  const utils = trpc.useUtils();
  const { data: messages } = trpc.chat.getMessages.useQuery(undefined, {
    refetchInterval: 1000, // atualiza a cada 1s
  });

  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: () => {
      setText('');
      utils.chat.getMessages.invalidate();
      setCanSend(false); // 🔒 desabilita botão
      setTimeout(() => setCanSend(true), 5000); // ⏱ habilita após 5s
    },
    //onError: (err) => alert(err.message),
  });

  return (
    <>
      <div className="flex flex-col h-[400px] overflow-hidden">
        {/* Lista de mensagens */}
        <div className="flex-1 overflow-y-auto p-2 mb-2">
          {messages?.length ? (
            messages
              ?.filter((msg) => msg.estacao === estacao)
              .map((msg) => (
                <div key={msg.id} className="p-0">
                  <strong className={`${msg.user === user ? 'text-[#FF5E00]' : 'text-gray-300'}`}>
                    {msg.user}:
                  </strong>{' '}
                  {msg.text}
                </div>
              ))
          ) : (
            <div className="text-gray-500 text-center">silence...</div>
          )}
        </div>

        {/* Form fixo no bottom do container */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim() || !canSend) return;
            sendMessage.mutate({ user: session?.user.name as string, text, estacao });
          }}
          className="flex gap-2 p-2 "
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type..."
            className="flex-1 p-2 rounded bg-gray-700 chatInput"
          />
          <button
            type="submit"
            disabled={!canSend || sendMessage.isPending}
            className="cta-button2 cta-secondary ml-3"
          >
            {sendMessage.isPending ? 'Sending...' : canSend ? 'send' : 'Wait 5s'}
          </button>
        </form>
      </div>
    </>
  );
}
