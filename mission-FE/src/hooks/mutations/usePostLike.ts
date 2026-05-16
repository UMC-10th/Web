import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    // data -> API 성공 응답데이터
    // variables -> mutate에 전달한 값
    // context -> onMutate에서 반환한 값
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },

    // error: 요청 실패시 발생한 에러
    // variables: mutate에 전달한 값
    // context: onMutate에서 반환한 값

    // onMutate: 요청 직전에 실행

    // onSettled: 요청이 끝난 후 항상 실행됨
    // 로딩상태를 초기화할 때 조금 유용하다.
  });
}

export default usePostLike;
