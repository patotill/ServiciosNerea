import AppColors from "../../utils/colors";

type FormButtonProps = {
  color?: keyof typeof AppColors;
  text: string;
};

export default function FormButton({ text, color }: FormButtonProps) {
  const selectedColor = AppColors[color || "blue"];
  return (
    <button
      type="submit"
      className={`w-full ${selectedColor.bg} ${selectedColor.hover} text-white font-bold py-2 px-4 rounded-lg transition-colors mb-2 mt-2`}
    >
      {text}
    </button>
  );
}
