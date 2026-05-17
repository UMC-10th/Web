// EditProfileModal 구조 예시
interface EditProfileModalProps {
  userInfo: { name: string; email: string; avatar?: string; bio?: string };
  onClose: () => void;
  onSave: (newNickname: string) => void; // 👈 새로 추가된 프롭스
  isSubmitting: boolean;
}

const EditProfileModal = ({ userInfo, onClose, onSave, isSubmitting }: EditProfileModalProps) => {
  const [nickname, setNickname] = useState(userInfo.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지 (초요구사항)
    if (!nickname.trim()) return;
    
    onSave(nickname); // 마이페이지에 있는 낙관적 업데이트 Mutation 작동!
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={nickname} 
        onChange={(e) => setNickname(e.target.value)} 
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : "저장"}
      </button>
    </form>
  );
};