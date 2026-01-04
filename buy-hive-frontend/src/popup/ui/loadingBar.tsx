
interface LoadingBarProps {
    className?: string;
}

const LoadingBar = ({ className } : LoadingBarProps) => {
    return (
        <div className={`loading-bar ${className ?? ""}`}></div>
    )
}

export default LoadingBar;