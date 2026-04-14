// ❌ 불편함 1: URL 파라미터를 직접 파싱해야 한다
// React Router의 useParams() 같은 건 없음 — 손으로 짜야 함

export type Route = {
  path: string; // "/posts/:id" 같은 패턴
  component: string; // 어떤 컴포넌트를 렌더링할지
};

// "/posts/:id" 패턴과 실제 URL "/posts/3" 을 비교해서 매칭되는지 확인
export function matchRoute(
  pattern: string,
  pathname: string
): Record<string, string> | null {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(":")) {
      // ":id" → params.id = "3"
      params[patternParts[i].slice(1)] = pathParts[i];
    } else if (patternParts[i] !== pathParts[i]) {
      return null; // 패턴이 안 맞으면 null
    }
  }

  return params;
}

// ❌ 불편함 2: navigate 함수도 직접 만들어야 한다
// React Router의 useNavigate() 같은 훅이 없음
export function navigate(path: string) {
  window.history.pushState({}, "", path);
  // pushState는 popstate 이벤트를 발생시키지 않기 때문에
  // 직접 이벤트를 만들어서 dispatch 해야 함
  window.dispatchEvent(new PopStateEvent("popstate"));
}
