import AppColors from "../../utils/colors";

interface DropdownListItemProps extends React.PropsWithChildren {
  color?: keyof typeof AppColors;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function DropdownListItem({
  color,
  isSelected,
  onClick,
  children,
}: DropdownListItemProps) {
  const selectedColor = AppColors[color ?? "blue"];
  return (
    <li
      className={`hover:bg-gray-200 rounded-md px-2 py-1 cursor-pointer flex justify-between items-center ${isSelected ? "bg-gray-100 font-semibold" : ""}`}
      onClick={onClick}
    >
      {children}
      {isSelected && <span className={selectedColor.text}>✓</span>}
    </li>
  );
}
