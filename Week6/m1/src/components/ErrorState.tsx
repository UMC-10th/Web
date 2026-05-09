type ErrorStateProps = {
    message: string;
    onRetry: () => void;
};

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
            <p>{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="border border-white px-4 py-2 hover:bg-white hover:text-black"
            >
                다시 시도
            </button>
        </div>
    );
};

export default ErrorState;
