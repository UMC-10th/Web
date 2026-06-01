import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../apis/auth';

export default function MyPage() {
  const { user, refetchUser, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  const { mutate: update, isPending } = useMutation({
    mutationFn: updateMe,
    onMutate: async (formData) => {
      const newName = formData.get('name') as string;
      // 서버 응답 전에 즉시 UI 업데이트
      updateUser(newName);
    },
    onSuccess: () => {
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: () => {
      // 에러 시 원래 이름으로 롤백
      refetchUser();
    },
  });

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append('name', name);
    if (bio) formData.append('bio', bio);
    update(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 p-8">
      <div className="flex items-center gap-8">
        {/* 프로필 이미지 */}
        <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-4xl">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : '👤'}
        </div>

        {/* 이름/bio 수정 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-600 px-4 py-2 rounded bg-gray-700 text-white w-48"
            />
            <button
              onClick={handleUpdate}
              disabled={isPending}
              className="text-green-500 hover:text-green-400"
            >
              ✓
            </button>
          </div>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="border border-gray-600 px-4 py-2 rounded bg-gray-700 text-white w-48"
          />
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}