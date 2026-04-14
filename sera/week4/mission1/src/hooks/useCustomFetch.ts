import { useState, useEffect } from 'react';

// 훅의 반환 타입 정의
interface UseFetchResult<T> {
  data: T | null;       // 응답 데이터 (아직 없으면 null)
  isLoading: boolean;   // 요청 진행 중 여부
  error: string | null; // 에러 메시지 (없으면 null)
}

// useCustomFetch: URL을 받아서 데이터 패칭, 로딩, 에러를 한 번에 관리하는 커스텀 훅
// 제네릭 <T>를 사용해 어떤 타입의 데이터든 받을 수 있도록 설계
const useCustomFetch = <T>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // 새 요청 시작 전 이전 에러 초기화

      try {
        const res = await fetch(url);
        // HTTP 상태 코드가 200대가 아닐 경우 에러 처리
        if (!res.ok) throw new Error('응답 오류');
        const json = await res.json();
        setData(json);
      } catch {
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        // 성공 / 실패 무관하게 로딩 종료
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]); // url이 바뀔 때마다 자동으로 재요청

  return { data, isLoading, error };
};

export default useCustomFetch;
