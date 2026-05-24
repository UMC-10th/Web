import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../../apis/lp";

function usePostLike(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => toggleLike(lpId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lp", String(lpId)] });
        },
    });
}

export default usePostLike;
