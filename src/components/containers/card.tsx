import AppColors from "../../utils/colors";

interface CardProps extends React.PropsWithChildren {
  color?: keyof typeof AppColors;
  extra?: string;
}

export default function Card({ color = "blue", children, extra }: CardProps) {
  const selectedColor = AppColors[color];
  return (
    <div
      className={`${extra} max-w-md w-full rounded-xl border-t-4 ${selectedColor.border} bg-white p-8 m-4 shadow-lg ring-1 ring-inset ring-slate-300`}
    >
      {children}
    </div>
  );
}
