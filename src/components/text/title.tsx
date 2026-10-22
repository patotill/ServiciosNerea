export default function Title({ text }: { text: string }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-2">{text}</h1>
      <p className="text-gray-500">Ingresa a tu cuenta para continuar</p>
    </div>
  );
}
