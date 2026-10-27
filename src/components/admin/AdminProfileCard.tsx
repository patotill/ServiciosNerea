import Card from "../containers/card";
import LinkButton from "../buttons/linkButton";
import { ROUTES } from "../../router/routes";

export default function AdminProfileCard() {
  return (
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
  );
}