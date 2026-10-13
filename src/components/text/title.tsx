export default function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">{title}</h1>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}
