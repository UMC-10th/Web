import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../apis/lp';
import { X } from 'lucide-react';

interface LpCreateModalProps {
  onClose: () => void;
}

export default function LpCreateModal({ onClose }: LpCreateModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    tags.forEach((tag) => formData.append('tags', tag));
    if (thumbnail) formData.append('thumbnail', thumbnail);
    mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#2a2a3e] rounded-xl p-6 w-full max-w-md relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* LP 이미지 */}
        <div
          className="flex justify-center mb-4 cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="thumbnail" className="w-32 h-32 rounded-full object-cover" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gray-700" />
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 입력 필드 */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none"
          />
          <input
            type="text"
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded focus:outline-none"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 bg-gray-700 text-white px-4 py-2 rounded focus:outline-none"
            />
            <button
              onClick={handleAddTag}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Add
            </button>
          </div>

          {/* 태그 목록 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-white">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isPending || !title}
            className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isPending ? '등록 중...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
}