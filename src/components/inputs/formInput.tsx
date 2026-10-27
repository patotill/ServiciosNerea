import AppColors from "../../utils/colors";

type FormInputProps = {
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  id: string;
  name?: string;
  minLength?: number;
  title: string;
  color?: keyof typeof AppColors;
};

export function FormInput({
  id,
  name,
  placeholder,
  required,
  minLength,
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
        name={name || id}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ${selectedColor.focusRing} outline-none`}
      />
    </div>
  );
}