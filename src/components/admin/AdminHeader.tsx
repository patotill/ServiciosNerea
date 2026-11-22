export default function AdminHeader() {
  return (
    <nav className="bg-gray-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-xl font-bold">
          Servicios Nerea
        </span>

        <span className="text-sm font-medium bg-gray-700 px-3 py-1 rounded-full">
          Panel Admin
        </span>
      </div>
    </nav>
  );
}