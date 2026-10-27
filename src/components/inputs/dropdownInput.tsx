import { useEffect, useRef, useState } from "react";
import AppColors from "../../utils/colors";
import DropdownListItem from "../list/dropdownListItem";

type DropdownItem = { value: number; label: string };

interface DropdownInputProps {
  color?: keyof typeof AppColors;
  items: DropdownItem[];
  onChange?: (selected: number[]) => void;
  text?: string;
  id: string;
  label?: string;
  required?: boolean;
}

export default function DropdownInput({
  text,
  color = "blue",
  items,
  onChange,
  id,
  label,
  required,
}: DropdownInputProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const selectedColor = AppColors[color];
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const toggle = (value: number) => {
    const next = selected.includes(value)
      ? selected.filter((s) => s !== value)
      : [...selected, value];
    setSelected(next);
    onChange?.(next);
  };

  const move = (index: number) => {
    setOpen(true);
    setActiveIndex(Math.min(Math.max(index, 0), items.length - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") return setOpen(false);
    // Bloquea el tipeo: el valor del input solo refleja la selección
    e.preventDefault();
    switch (e.key) {
      case "Escape":
        return setOpen(false);
      case "ArrowDown":
        return move(open ? activeIndex + 1 : activeIndex);
      case "ArrowUp":
        return move(open ? activeIndex - 1 : activeIndex);
      case "Home":
        return move(0);
      case "End":
        return move(items.length - 1);
      case "Enter":
      case " ":
        if (open && items[activeIndex]) return toggle(items[activeIndex].value);
        return setOpen(true);
    }
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
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? optionId(activeIndex) : undefined}
          aria-required={required}
          required={required}
          autoComplete="off"
          className={`w-full outline-none border border-gray-300 focus:ring-2 ${selectedColor.focusRing} py-2 px-4 pr-10 rounded-lg transition-colors cursor-pointer`}
          placeholder={text}
          value={items
            .filter((item) => selected.includes(item.value))
            .map((item) => item.label)
            .join(", ")}
          // No es readOnly porque los inputs readOnly se saltan la validación `required`
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onClick={() => setOpen(!open)}
        />
        <svg
          className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
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
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className={`${open ? "" : "hidden"} absolute z-10 w-full left-0 mt-1 bg-white rounded-xl shadow-lg p-2 border border-gray-200 max-h-60 overflow-y-auto`}
        >
          {items.map((item, index) => (
            <DropdownListItem
              key={item.value}
              id={optionId(index)}
              color={color}
              isSelected={selected.includes(item.value)}
              isActive={index === activeIndex}
              onClick={() => toggle(item.value)}
            >
              {item.label}
            </DropdownListItem>
          ))}
        </ul>
      </div>
    </div>
  );
}
