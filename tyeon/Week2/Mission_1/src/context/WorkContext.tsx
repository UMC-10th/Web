import { createContext, useContext, useState } from "react";
import type { PropsWithChildren, ReactElement } from "react";
import type { TWork } from "../types/work";

interface IWorkContext {
    works: TWork[];
    addWork: (text:string) => void;
    doneWork: (id:number) => void;
    deleteWork: (id: number) => void;
}

export const WorkContext = createContext<IWorkContext | undefined >(undefined);

export const WorkProvider = ({ children }: PropsWithChildren): ReactElement => {
    const [works, setWorks] = useState<TWork[]>([]);

    // 할 일 추가 함수 (할 일 추가 버튼 클릭 시)
    const addWork = (text: string) => {
        // 입력값이 공백인 경우 할 일 추가하지 않음, trim()은 앞, 뒤 공백 제거한 string return
        if (text === "")
        return;

        // 새로운 할 일 객체 생성
        const newWork: TWork = {
            id: Date.now(),
            text: text,
            isDone: false
        };

        // 새로운 할 일을 기존 할 일 리스트의 맨 앞에 추가 후 state 업데이트
        setWorks(prev => [newWork, ...prev]);
    }

    // 할 일 완료 함수 (완료 버튼 클릭 시)
    const doneWork = (id:number) => {
        // 완료 처리할 할 일 객체를 id로 탐색하여 완료 처리 후 state 업데이트
        setWorks(prev => prev.map(work => 
        work.id === id ? { ...work, isDone: true } : work
        ));
    }

    // 할 일 삭제 함수 (삭제 버튼 클릭 시)
    const deleteWork = (id: number) => {
        // 삭제 처리할 할 일 객체를 id로 탐색하여 삭제 후(필터링) state 업데이트
        setWorks(prev => prev.filter(work => work.id !== id));
    }

    return (
        <WorkContext.Provider value={{ works, addWork, doneWork, deleteWork }}>
            {children}
        </WorkContext.Provider>
    );
}

export const useWork = (): IWorkContext => {
    const context = useContext(WorkContext);

    // context가 없는 경우 처리
    if (!context)
        throw new Error("useWork를 사용하기 위해선, 무조건 WorkProvider로 감싸져야 합니다.");

    //context 반환
    return context;
}