type FormInputProps = {
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  id: string;
  title: string;
};

export function FormInput({
  id,
  placeholder,
  required,
  type,
  title,
}: FormInputProps) {
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
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
