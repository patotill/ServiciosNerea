import { useState } from "react";
import AppColors from "../../utils/colors";
import Container from "../containers/container";

interface FormButtonProps extends React.PropsWithChildren {
  color?: keyof typeof AppColors;
  text: string;
}

export default function DropdownButton({
  text,
  color,
  children,
}: FormButtonProps) {
  const [open, setOpen] = useState(false);
  const selectedColor = AppColors[color || "blue"]; // Default to blue if no color is provided
  return (
    <>
      <button
        type="button"
        className={`w-full ${selectedColor.bg} ${selectedColor.hover} text-white font-bold py-2 px-4 rounded-lg transition-colors mb-2 mt-2`}
        onClick={() => setOpen(!open)}
      >
        <Container direction="row" gap="gap-2">
          {text}
          <svg
            className="w-4 h-4 ms-1.5 -me-0.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </Container>
      </button>
      <div className="relative">
        <div
          className={`${open ? "hidden" : ""}  absolute max-w-md w-full bg-white rounded-xl shadow-lg right-0 p-2 min-w-60 w-full border-1 border-gray-200`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
