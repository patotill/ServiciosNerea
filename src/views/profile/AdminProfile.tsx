import AdminHeader from "../../components/admin/AdminHeader";
import AdminProfileCard from "../../components/admin/AdminProfileCard";

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <AdminProfileCard />
      </main>
    </div>
  );
}