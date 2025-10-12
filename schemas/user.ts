
import { trpc } from "@/lib/trpcClient";
import { useMutation } from "@tanstack/react-query";
import bcrypt from "bcryptjs";
import { redirect } from "next/dist/server/api-utils";

type CreateUserInput = Parameters<typeof trpc.user.create.mutate>[0];
type CreateUserOutput = Awaited<ReturnType<typeof trpc.user.create.mutate>>;

export const useUpdateUser = (onSuccess?: () => void) => {
  return useMutation<CreateUserOutput, Error, CreateUserInput>({
    mutationFn: async (input) => {
			const data = {
				name: input.name,
				password: input.password
			};
			return trpc.user.update.mutate(data);
		},
    onSuccess: async(user) => {
			//redirect("/status")

		},
  });
};