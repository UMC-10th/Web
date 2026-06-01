import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../apis/auth';

export default function MyPage() {
  const { user, refetchUser } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState('');

  const { mutate: update, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ['me'] });
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
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              className="border border-gray-600 px-4 py-2 rounded bg-gray-700 text-white w-48"
            />
          </div>
          <p className="text-gray-400 text-sm">{user?.email}</p>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isPending}
            className="self-start rounded bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {isPending ? '수정 중...' : '프로필 수정'}
          </button>
        </div>
      </div>
    </div>
  );
}
