import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addLike, removeLike } from "../../apis/lp";
import { useAuth } from "../../context/AuthContext";
import type { LpData } from "../../types/lp";

function usePostLike(lpId: number) {
    const queryClient = useQueryClient();
    const { userId: currentUserId } = useAuth();
    const key = ["lp", String(lpId)];

    return useMutation({
        mutationFn: () => {
            const lp = queryClient.getQueryData<LpData>(key);
            const isLiked = lp?.likes.some((l) => l.userId === currentUserId) ?? false;
            return isLiked ? removeLike(lpId) : addLike(lpId);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: key });
            const previous = queryClient.getQueryData<LpData>(key);
            queryClient.setQueryData<LpData>(key, (old) => {
                if (!old || currentUserId === null) return old;
                const alreadyLiked = old.likes.some((l) => l.userId === currentUserId);
                return {
                    ...old,
                    likes: alreadyLiked
                        ? old.likes.filter((l) => l.userId !== currentUserId)
                        : [...old.likes, { id: Date.now(), userId: currentUserId, lpId }],
                };
            });
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(key, context.previous);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: key });
        },
    });
}

export default usePostLike;
