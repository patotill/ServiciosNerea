import AppColors from "../../utils/colors";

interface DropdownListItemProps extends React.PropsWithChildren {
  id: string;
  color?: keyof typeof AppColors;
  isSelected?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export default function DropdownListItem({
  id,
  color = "blue",
  isSelected,
  isActive,
  onClick,
  children,
}: DropdownListItemProps) {
  const selectedColor = AppColors[color];
  return (
    <li
      id={id}
      role="option"
      aria-selected={isSelected}
      className={`hover:bg-gray-200 rounded-md px-2 py-3 min-h-11 cursor-pointer flex justify-between items-center ${isActive ? "bg-gray-200" : ""} ${isSelected ? "font-semibold" : ""}`}
      // Evita que el input pierda el foco al elegir con el mouse o el dedo
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
      {isSelected && <span className={selectedColor.text}>✓</span>}
    </li>
  );
}
