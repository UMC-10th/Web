export const LoadingSpinner =  () => {
    return <div 
    className="
        size-12
        animate-spin
        rounded-full
        border-5
        border-t-transparent
        border-[#00d068]
    "
    role='status'
    >
        <span className="sr-only">Loading...</span>
    </div>
}