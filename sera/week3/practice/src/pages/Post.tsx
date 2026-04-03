import { navigate } from "../router";

type Props = {
  params: Record<string, string>;
};

export default function Post({ params }: Props) {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>포스트 {params.id}입니다.</h1>
      <br />
      <button onClick={() => navigate("/")}>홈으로</button>
    </div>
  );
}
