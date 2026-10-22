import AppColors from "../../utils/colors";

interface CardProps extends React.PropsWithChildren {
  color?: keyof typeof AppColors;
  extra?: string;
}

export default function Card({ color = "blue", children, extra }: CardProps) {
  const selectedColor = AppColors[color];
  return (
    <div
      className={`${extra} max-w-md w-full bg-white rounded-xl shadow-lg p-8 m-4 border-t-4 ${selectedColor.border}`}
    >
      {children}
    </div>
  );
}
