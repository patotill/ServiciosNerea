type FormButtonProps = {
  color: string;
  text: string;
};

export default function FormButton({ text, color }: FormButtonProps) {
  return (
    <button
      type="submit"
      className={`w-full bg-${color}-600 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded-lg transition-colors`}
    >
      {text}
    </button>
  );
}
