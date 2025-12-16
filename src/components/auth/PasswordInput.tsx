"use client";
import { useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  wrapperClassName?: string;
  inputClassName?: string;
};

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  wrapperClassName = "",
  inputClassName = "",
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={`space-y-1 ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder="Password"
          maxLength={12}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border px-4 py-2 pr-12 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : "border-gray-300"}
            ${inputClassName}`}
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-xs text-gray-500 hover:text-gray-700"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
