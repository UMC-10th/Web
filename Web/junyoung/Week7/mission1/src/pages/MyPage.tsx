import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile } from '../api/lps';
import { userKeys } from '../api/queryKeys';
import useLocalStorage from '../hooks/useLocalStorage';

const MyPage = () => {
  const queryClient = useQueryClient();
  const [storedNickname, setStoredNickname] = useLocalStorage('nickname', '준영');
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(storedNickname);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const { data: profile } = useQuery({
    queryKey: userKeys.me,
    queryFn: getMyProfile,
  });
  const updateMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (updatedProfile) => {
      setStoredNickname(updatedProfile.nickname);
      queryClient.invalidateQueries({ queryKey: userKeys.me });
      setIsEditing(false);
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateMutation.mutate({
      nickname: nickname.trim() || storedNickname,
      bio,
      avatar,
    });
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">마이페이지</h1>
        <button
          type="button"
          onClick={() => {
            setNickname(profile?.nickname || storedNickname);
            setBio(profile?.bio ?? '');
            setAvatar(profile?.avatar ?? '');
            setIsEditing((prev) => !prev);
          }}
          className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-200 hover:border-gray-500"
        >
          설정
        </button>
      </div>

      <div className="mt-6 rounded-md border border-gray-800 bg-[#151515] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gray-800 text-2xl font-bold text-pink-200">
            {avatar ? <img src={avatar} alt="프로필" className="h-full w-full object-cover" /> : storedNickname[0]}
          </div>
          <div>
            <strong className="text-lg text-white">{storedNickname}</strong>
            <p className="mt-1 text-sm text-gray-400">{profile?.bio || '아직 bio가 없습니다.'}</p>
          </div>
        </div>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 rounded-md border border-gray-800 bg-[#151515] p-5">
          <input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="이름"
            className="h-11 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            placeholder="bio"
            rows={3}
            className="resize-none rounded-md border border-gray-700 bg-transparent px-4 py-3 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="rounded-md border border-gray-700 px-4 py-3 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-pink-500 file:px-3 file:py-1 file:text-white"
          />
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="h-11 rounded-md bg-pink-500 text-sm font-bold text-white hover:bg-pink-600 disabled:bg-gray-700"
          >
            {updateMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </form>
      )}
    </section>
  );
};

export default MyPage;
