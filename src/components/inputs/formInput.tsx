import AppColors from "../../utils/colors";

type FormInputProps = {
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  id: string;
  name?: string; // <-- Se agrega name como prop opcional
  title: string;
  color?: keyof typeof AppColors;
};

export function FormInput({
  id,
  name,
  placeholder,
  required,
  type,
  title,
  color = "blue",
}: FormInputProps) {
  const selectedColor = AppColors[color];

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {title}
      </label>
      <input
        type={type}
        id={id}
        name={name || id} // <-- Usa name si viene, o usa id como fallback
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${selectedColor.focusRing} outline-none`}
      />
    </div>
  );
}