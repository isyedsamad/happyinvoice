export default function HappyLogo({ color = 'var(--primaryPanel)', size = 64, animate = false }) {
    return (
        <div
            className={`rounded-[23%] flex items-center justify-center`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: `${color}`,
            }}
        >
            <svg
                viewBox="0 0 100 100"
                width={size}
                height={size}
                fill="none"
                stroke="var(--bgPanel)"
                strokeWidth="6"
                strokeLinecap="round"
                className={`${animate ? 'transition-all hover:scale-105 hover:rotate-1' : ''}`}
            >
                {/* Invoice lines */}
                <line x1="30" y1="30" x2="70" y2="30" />
                <line x1="30" y1="45" x2="60" y2="45" />

                {/* Smile arc */}
                <path d="M30 65 Q50 85 70 65" />
            </svg>
        </div>
    );
}
