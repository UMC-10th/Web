import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLp, uploadImage } from "../apis/lp";

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
  const [thumbnail, setThumbnail] = useState("");

  // 이미지 업로드 → URL 받기
  const { mutate: uploadImg, isPending: isUploading } = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setThumbnail(data.data.imageUrl);
    },
    onError: () => alert("이미지 업로드에 실패했습니다."),
  });

  // LP 생성
  const { mutate: submitLp, isPending: isSubmitting } = useMutation({
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
    setPreviewUrl(URL.createObjectURL(selected));
    uploadImg(selected);
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
    if (!title.trim()) { alert("LP 제목을 입력해주세요."); return; }
    if (!thumbnail) { alert("이미지를 업로드해주세요."); return; }
    submitLp({
      title: title.trim(),
      content: content.trim(),
      thumbnail,
      tags,
      published: true,
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isPending = isUploading || isSubmitting;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-[#FF1493] text-2xl font-bold">🎵 LP 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">✕</button>
        </div>

        {/* 이미지 업로드 */}
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
        {isUploading && <p className="text-gray-400 text-sm text-center">이미지 업로드 중...</p>}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

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

        {/* 태그 */}
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
                <button onClick={() => handleRemoveTag(tag)} className="hover:text-white ml-1">✕</button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending || !thumbnail}
          className="w-full bg-[#FF1493] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          {isSubmitting ? "업로드 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default LPWriteModal;