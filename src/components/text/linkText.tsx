import { Link } from "react-router-dom";
import AppColors from "../../utils/colors";

interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  color?: keyof typeof AppColors;
}

export default function LinkText({ children, href, color }: LinkTextProps) {
  const selectedColor = color ? AppColors[color] : AppColors.gray;
  return (
    <Link
      to={href}
      className={`text-xs ${selectedColor.text} ${selectedColor.textHover} transition-colors underline bg-transparent`}
    >
      {children}
    </Link>
  );
}
