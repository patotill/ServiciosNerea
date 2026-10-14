import AppColors from "../../utils/colors";

type FormButtonProps = {
  color: keyof typeof AppColors;
  text: string;
};

export default function FormButton({ text, color }: FormButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full ${AppColors[color].bg} ${AppColors[color].hover} text-white font-bold py-2 px-4 rounded-lg transition-colors`}
    >
      {text}
    </button>
  );
}
