import React from "react";

interface IPageBtn {
    text: string;
    page: number;
    onPage: React.Dispatch<React.SetStateAction<number>>
    isToNext: boolean;
}

export const PageBtn = ({text, page, onPage, isToNext}: IPageBtn) => {
    // page <= 0인 case 발생 못하도록 처리
    return (
    <button 
        disabled={page === 1 && !isToNext}
        /* 현재 페이지가 1이라면 이전 페이지 버튼을 눌렀더라도 계속 유지하게끔 처리 */
        onClick={() => onPage(prev => isToNext ? prev + 1 : (prev - 1 > 0 ? prev - 1 : 1) )}
        className="
            border 
            rounded-sm
            px-3
            py-2
            bg-[#0ef18b]
            text-white
            shadow-md
            hover:bg-[#00b563]
            cursor-pointer

            transition-all
            duration-150
            disabled:bg-gray-300
            disabled:cursor-not-allowed
        "
    >
        {text}
    </button>
    );
}