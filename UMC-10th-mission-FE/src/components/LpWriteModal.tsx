import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp, patchLp } from "../apis/lp";

interface InitialData {
  title: string;
  content: string;
  thumbnail?: string | null;
  tags: string[];
}

interface LpWriteModalProps {
  onClose: () => void;
  mode?: "create" | "edit";
  lpId?: number;
  initialData?: InitialData;
}

const LpWriteModal = ({
  onClose,
  mode = "create",
  lpId,
  initialData,
}: LpWriteModalProps) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  // 수정 모드: 기존 URL로 미리보기, 새 파일 선택 전까지 File은 null
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.thumbnail ?? null
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // blob URL인 경우에만 revoke (http URL은 revoke 불필요)
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    setThumbnailFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (target: string) => {
    setTags((prev) => prev.filter((t) => t !== target));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const isEdit = mode === "edit" && lpId !== undefined;

  const { mutate: saveLp, isPending } = useMutation({
    mutationFn: (body: { title: string; content: string; thumbnail: File | null; tags: string[] }) =>
      isEdit
        ? patchLp(lpId!, { ...body, thumbnail: body.thumbnail ?? null })
        : postLp({ ...body, thumbnail: body.thumbnail ?? null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ["lp", String(lpId)] });
      }
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return;
    saveLp({ title: title.trim(), content: content.trim(), thumbnail: thumbnailFile, tags });
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
    >
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">
            {isEdit ? "LP 수정" : "새 LP 등록"}
          </h2>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-sm font-semibold">LP 사진</span>
          <label className="w-full aspect-square bg-[#111] border-2 border-dashed border-[#333] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF1493] transition-colors overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <span className="text-5xl text-gray-600 leading-none">+</span>
                <span className="text-gray-500 text-sm mt-2">
                  사진을 선택하세요
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm font-semibold" htmlFor="lp-title">
            제목 <span className="text-[#FF1493]">*</span>
          </label>
          <input
            id="lp-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP 제목을 입력하세요"
            className="bg-[#111] text-white border border-[#333] rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF1493] transition-colors"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-400 text-sm font-semibold" htmlFor="lp-content">
            내용
          </label>
          <textarea
            id="lp-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP에 대한 설명을 입력하세요"
            rows={3}
            className="bg-[#111] text-white border border-[#333] rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF1493] transition-colors resize-none"
          />
        </div>

        {/* Tag input */}
        <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-sm font-semibold">태그</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="태그 입력 후 추가 또는 엔터"
              className="flex-1 bg-[#111] text-white border border-[#333] rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-[#FF1493] transition-colors"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-[#FF1493] text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              추가
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-[#2a2a2a] text-[#FF1493] text-sm px-3 py-1 rounded-full border border-[#FF1493]/30"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    aria-label={`${tag} 태그 삭제`}
                    className="text-gray-500 hover:text-white transition-colors ml-0.5 leading-none"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isPending || !title.trim()}
          className="w-full py-3 bg-[#FF1493] text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending
            ? isEdit ? "수정 중..." : "등록 중..."
            : isEdit ? "수정 완료" : "LP 올리기"}
        </button>
      </div>
    </div>
  );
};

export default LpWriteModal;
