import { useFormStatus } from "react-dom";
import AppColors from "../../utils/colors";

type FormButtonProps = {
  color?: keyof typeof AppColors;
  text: string;
  disabled?: boolean;
  loading?: boolean;
};

export default function FormButton({
  text,
  color,
  disabled,
  loading,
}: FormButtonProps) {
  const selectedColor = AppColors[color || "blue"];
  // Con <form action> el setLoading del hook queda dentro de la transición y no se pinta hasta que termina; pending sí.
  const { pending } = useFormStatus();
  const isLoading = loading || pending;
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`w-full ${selectedColor.bg} ${selectedColor.hover} text-white font-bold py-2 px-4 rounded-lg transition-colors mb-2 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          />
          <path
            fill="currentColor"
            className="opacity-75"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {text}
    </button>
  );
}
