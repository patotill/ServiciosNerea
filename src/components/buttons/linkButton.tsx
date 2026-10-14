import AppColors from "../../utils/colors";

interface LinkButtonProps {
  href: string;
  children?: React.ReactNode;
  color?: keyof typeof AppColors;
}

export default function LinkButton({
  href,
  children,
  color = "blue",
}: LinkButtonProps) {
  const defaultColor = AppColors[color];
  return (
    <a
      href={href}
      className={`w-full flex justify-center items-center py-2 px-4 border-2 
                ${defaultColor.border} rounded-lg shadow-sm text-sm font-medium ${defaultColor.text}
                bg-transparent ${defaultColor.linkHover} transition-colors`}
    >
      {children}
    </a>
  );
}
