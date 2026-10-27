import AppColors from "../../utils/colors";

type StatCardProps = {
  titulo: string;
  valor: number;
  color: keyof typeof AppColors;
};

export default function StatCard({ titulo, valor, color }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <p className={`mt-3 text-3xl font-bold ${AppColors[color].text}`}>
        {valor}
      </p>
    </div>
  );
}
