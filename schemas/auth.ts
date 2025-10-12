
import { trpc } from "@/lib/trpcClient";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

type CreateMessageInput = Parameters<typeof trpc.auth.register.mutate>[0];
type CreateMessageOutput = Awaited<ReturnType<typeof trpc.auth.register.mutate>>;

export const useRegister = (onSuccess?: () => void) => {
  return useMutation<CreateMessageOutput, Error, CreateMessageInput>({
    mutationFn: (input) => trpc.auth.register.mutate(input),
    onSuccess: async (user) => {
      // login automático via NextAuth
			
      await signIn("credentials", {
        redirect: true, // redireciona automaticamente
        email: user.email,
        password: user.password, // senha temporária retornada do backend
        callbackUrl: "//onboarding", // página para redirecionar
      });
		}
  });
};