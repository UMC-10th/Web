import { navigate } from "../router";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p>존재하지 않는 페이지입니다.</p>
      <p>현재 URL: <code>{window.location.pathname}</code></p>
      <br />
      <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
    </div>
  );
}
