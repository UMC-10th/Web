import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp } from "../apis/lp";

interface LPWriteModalProps {
  onClose: () => void;
}

const LPWriteModal = ({ onClose }: LPWriteModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [artist, setArtist] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { mutate: submitLp, isPending } = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      onClose();
    },
    onError: () => alert("LP 생성에 실패했습니다. 다시 시도해주세요."),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("LP 제목을 입력해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content.trim());
    if (artist.trim()) formData.append("artist", artist.trim());
    tags.forEach((tag) => formData.append("tags", tag));
    if (file) formData.append("thumbnail", file);
    submitLp(formData);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">

        <div className="flex justify-between items-center">
          <h2 className="text-[#FF1493] text-2xl font-bold">🎵 LP 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div
          className="w-full aspect-video bg-[#1a1a1a] border border-dashed border-[#444] rounded-xl flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#FF1493] transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-sm">📷 클릭하여 LP 이미지 업로드</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <input
          type="text"
          placeholder="LP 제목 *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2 outline-none focus:border-[#FF1493] placeholder-gray-500"
        />

        <input
          type="text"
          placeholder="아티스트"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2 outline-none focus:border-[#FF1493] placeholder-gray-500"
        />

        <textarea
          placeholder="LP 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2 outline-none focus:border-[#FF1493] placeholder-gray-500 resize-none"
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="태그 입력"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            className="flex-1 bg-[#1a1a1a] border border-[#333] text-white rounded-lg px-4 py-2 outline-none focus:border-[#FF1493] placeholder-gray-500"
          />
          <button
            onClick={handleAddTag}
            className="bg-[#FF1493] text-white px-4 py-2 rounded-lg font-bold hover:opacity-90"
          >
            추가
          </button>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#222] text-[#FF1493] border border-[#FF1493] px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button onClick={() => handleRemoveTag(tag)} className="hover:text-white ml-1">
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-[#FF1493] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? "업로드 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default LPWriteModal;