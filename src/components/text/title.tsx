import AppColors from "../../utils/colors";

export default function Title({
  title,
  subtitle,
  color,
}: {
  title: string;
  subtitle: string;
  color?: keyof typeof AppColors;
}) {
  const textColor = color ? AppColors[color].text : AppColors.blue.text;
  return (
    <div className="text-center mb-8">
      <h1 className={`text-3xl font-bold ${textColor} mb-2`}>{title}</h1>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}
