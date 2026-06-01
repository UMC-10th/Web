import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../api/lps';
import { lpKeys } from '../api/queryKeys';
import useLocalStorage from '../hooks/useLocalStorage';

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LpCreateModal = ({ isOpen, onClose }: LpCreateModalProps) => {
  const queryClient = useQueryClient();
  const [nickname] = useLocalStorage('nickname', '준영');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lpKeys.lists() });
      setTitle('');
      setContent('');
      setThumbnail('');
      setTagInput('');
      setTags([]);
      onClose();
    },
  });

  if (!isOpen) {
    return null;
  }

  const addTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag || tags.includes(nextTag)) {
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setTagInput('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setThumbnail(URL.createObjectURL(file));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      thumbnail,
      tags,
      author: nickname,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onMouseDown={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-md border border-gray-700 bg-[#151515] p-5 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">LP 글 작성</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-700 px-3 py-1 text-sm text-gray-300 hover:text-white"
          >
            X
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="LP 제목"
            className="h-11 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="LP 소개"
            rows={4}
            className="resize-none rounded-md border border-gray-700 bg-transparent px-4 py-3 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="rounded-md border border-gray-700 px-4 py-3 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-pink-500 file:px-3 file:py-1 file:text-white"
          />
          {thumbnail && (
            <img src={thumbnail} alt="LP 미리보기" className="aspect-video rounded-md object-cover" />
          )}

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="태그 입력"
              className="h-11 flex-1 rounded-md border border-gray-700 bg-transparent px-4 text-sm outline-none placeholder-gray-500 focus:border-pink-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-md bg-gray-700 px-4 text-sm font-semibold text-white hover:bg-gray-600"
            >
              추가
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                  className="rounded-md bg-pink-500/15 px-3 py-1 text-sm text-pink-100"
                >
                  #{tag} x
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending || !title.trim() || !content.trim()}
          className="mt-5 h-11 w-full rounded-md bg-pink-500 text-sm font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-700"
        >
          {createMutation.isPending ? '추가 중...' : 'Add LP'}
        </button>
      </form>
    </div>
  );
};

export default LpCreateModal;
