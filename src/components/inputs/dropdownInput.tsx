import { useEffect, useRef, useState } from "react";
import AppColors from "../../utils/colors";
import DropdownListItem from "../list/dropdownListItem";

type Primitive = string | number | boolean;

interface DropdownInputProps<T extends Primitive> {
  color?: keyof typeof AppColors;
  items: T[];
  renderItem?: ({
    item,
    isHighlighted,
    index,
    toggle,
  }: {
    item: T;
    isHighlighted: boolean;
    index: number;
    toggle: () => void;
  }) => React.ReactNode;
  onChange?: (selected: T[]) => void;
  text?: string;
  id: string;
  label?: string;
  required?: boolean;
}

export default function DropdownInput<T extends Primitive>({
  text,
  color,
  items,
  renderItem,
  onChange,
  id,
  label,
  required,
}: DropdownInputProps<T>) {
  const [open, setOpen] = useState(false);
  const selectedColor = AppColors[color || "blue"]; // Default to blue if no color is provided
  const [selected, setSelected] = useState<T[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (item: T) => {
    const next = selected.includes(item)
      ? selected.filter((s) => s !== item)
      : [...selected, item];
    setSelected(next);
    onChange?.(next);
  };

  return (
    <div ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          required={required}
          autoComplete="off"
          className={`w-full outline-none border border-gray-300 focus:ring-2 ${selectedColor.focusRing} py-2 px-4 pr-10 rounded-lg transition-colors mb-2 mt-2 cursor-pointer`}
          placeholder={text}
          value={selected.map(String).join(", ")}
          // No es readOnly porque los inputs readOnly se saltan la validación `required`
          onChange={() => {}}
          onKeyDown={(e) => {
            if (e.key === "Tab" || e.key === "Escape") return setOpen(false);
            e.preventDefault();
            if (e.key === "Enter" || e.key === " ") setOpen(!open);
          }}
          onClick={() => setOpen(!open)}
        />
        <svg
          className="w-4 h-4 ms-1.5 -me-0.5 absolute inline-block top-5 right-5 pointer-events-none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
        <ul
          className={`${open ? "" : "hidden"} absolute z-10 max-w-md w-full bg-white rounded-xl shadow-lg right-0 p-2 min-w-60 border border-gray-200 max-h-60 overflow-y-auto`}
        >
          {items.map((item, index) => {
            const isHighlighted = selected.includes(item);
            return renderItem ? (
              <div key={String(item)}>
                {renderItem({
                  item,
                  index,
                  isHighlighted,
                  toggle: () => toggle(item),
                })}
              </div>
            ) : (
              <DropdownListItem
                key={String(item)}
                color={color}
                isSelected={isHighlighted}
                onClick={() => toggle(item)}
              >
                {String(item)}
              </DropdownListItem>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
