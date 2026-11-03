import AppColors, { Neutros } from "../../utils/colors";

type FormInputProps = {
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  id: string;
  name?: string;
  minLength?: number;
  title: string;
  color?: keyof typeof AppColors;
  value?: string;
  onChange?: (value: string) => void;
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
  value,
  onChange,
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
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        className={`w-full min-h-11 px-4 py-2 border ${Neutros.borde} rounded-lg focus:ring-2 ${selectedColor.focusRing} outline-none`}
      />
    </div>
  );
}