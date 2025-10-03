"use client";

import { trpc } from "@/lib/trpcClient";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Listar usuários
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => trpc.user.getAll.query(), // ⚡ apenas chama a função do cliente
  });

  // Criar usuário
  const createUser = useMutation({
    mutationFn: (input: { name?: string; email: string }) =>
      trpc.user.create.mutate(input), // ⚡ apenas chama a função
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // Deletar usuário
  const deleteUser = useMutation({
    mutationFn: (id: string) => trpc.user.delete.mutate({ id }), // ⚡ apenas chama a função
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {(error as Error).message}</p>; 
	//	Erro: Unexpected token '<', "<!DOCTYPE "... is not valid JSON



  return (
    <div>
      <h1>Usuários</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => deleteUser.mutate(user.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={() => createUser.mutate({ name, email })}>Criar</button>
    </div>
  );
}
