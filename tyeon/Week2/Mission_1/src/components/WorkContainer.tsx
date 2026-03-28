// 할 일 객체 type 정의
type Work = {
  id: number;
  text: string;
  isDone: boolean;
}

// 버튼 색상
const COMP_BTN_COLOR = "rgb(27, 88, 255)";
const DELETE_BTN_COLOR = "rgb(255, 0, 0)";

interface WorkContainerProps {
    works?: Work[];
    onClick?: (id: number) => void;
    isDone: boolean;
}

function WorkContainer({ works, onClick, isDone }: WorkContainerProps) {
    return (
            <div className="render-container__list">
                <h2 className="render-container__subtitle">{isDone ? "완료된 일" : "해야 할 일"}</h2>
                <ul className="render-container__works" id="notyet-works">
                  {/* 아직 완료되지 않은 일들만 */}
                  {works?.map(
                    work => (
                      <li key={work.id} className="render-container__work">
                        <span className="render-container__work-text">{work.text}</span>
                        <button 
                          className='render-container__work-button'
                          onClick={() => onClick?.(work.id)}
                          style={{ backgroundColor: isDone ? DELETE_BTN_COLOR : COMP_BTN_COLOR }}>
                            {isDone ? "삭제" : "완료"}
                        </button>
                    </li>)
                  )}
                </ul>
            </div>
    );
}

export default WorkContainer;