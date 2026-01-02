"use client";

interface SpinnerProps {
  size?: number;        // px
  text?: string;
  fullscreen?: boolean;
}

export default function Spinner({
  size = 32,
  text,
  fullscreen = false,
}: SpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <svg
        className="animate-spin text-gray-300"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75 text-blue-600"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      {text && (
        <p className="text-sm text-gray-500 text-center">
          {text}
        </p>
      )}
    </div>
  );

  if (!fullscreen) return spinner;

  return (
    <div className="h-screen flex items-center justify-center">
      {spinner}
    </div>
  );
}
