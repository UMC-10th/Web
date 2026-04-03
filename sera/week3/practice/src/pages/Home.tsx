import { navigate } from "../router";

export default function Home() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>sera main 페이지입니다.</h1>
      <br />
      <div>
        <button onClick={() => navigate("/")}>홈</button>
        <button onClick={() => navigate("/about")}>개인페이지</button>
      </div>
      <br />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {[1, 2, 3].map((id) => (
          <li key={id} style={{ marginBottom: "8px" }}>
            <button onClick={() => navigate(`/posts/${id}`)}>
              포스트 {id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
