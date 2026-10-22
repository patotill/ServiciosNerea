import AppColors from "../../utils/colors";

interface TextProps extends React.PropsWithChildren {
  size?: string;
  color?: keyof typeof AppColors;
}

export default function Text({ size = "text-sm", color, children }: TextProps) {
  const selectedColor = AppColors[color || "gray"];
  return <p className={`${size} ${selectedColor.text} mb-4`}>{children}</p>;
}
