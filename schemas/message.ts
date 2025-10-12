
import { trpc } from "@/lib/trpcClient";
import { useMutation } from "@tanstack/react-query";

type CreateMessageInput = Parameters<typeof trpc.message.create.mutate>[0];
type CreateMessageOutput = Awaited<ReturnType<typeof trpc.message.create.mutate>>;

export const useCreateMessage = (onSuccess?: () => void) => {
  return useMutation<CreateMessageOutput, Error, CreateMessageInput>({
    mutationFn: (input) => trpc.message.create.mutate(input),
    onSuccess,
  });
};