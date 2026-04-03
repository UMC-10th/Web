import { navigate } from "../router";

export default function About() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>개인 페이지입니다.</h1>
      <br />
      <button onClick={() => navigate("/")}>홈으로</button>
    </div>
  );
}
