import Card from "../../components/containers/card";
import LinkButton from "../../components/buttons/linkButton";
import { ROUTES } from "../../router/routes";

export default function AdminProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-6xl mx-auto px-4 py-16 flex justify-center">
        <Card>
          <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Usuario: Administrador
          </h1>

          <div className="flex flex-col gap-4">
            <LinkButton href={ROUTES.LOGIN} color="blue">
              Volver al inicio
            </LinkButton>
          </div>
        </Card>
      </main>
    </div>
  );
}