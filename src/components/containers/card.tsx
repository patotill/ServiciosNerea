export default function Card({ children }: React.PropsWithChildren) {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 m-4 border-t-4 border-blue-500">
      {children}
    </div>
  );
}
