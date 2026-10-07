import FormButton from "./components/buttons/formButton";
import { FormInput } from "./components/inputs/formInput";

export function App() {
  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 m-4 border-t-4 border-blue-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Servicios y Reparaciones NEREA
        </h1>
        <p className="text-gray-500">Ingresa a tu cuenta para continuar</p>
      </div>

      <form id="login-form" className="space-y-6">
        <FormInput
          id="email"
          placeholder="tu.email@gmail.com"
          required
          title="correo electrónico"
          type="email"
        ></FormInput>
        <FormInput
          id="password"
          placeholder="••••••••"
          required
          title="contraseña"
          type="password"
        ></FormInput>

        <FormButton color="blue" text="Iniciar sesión"></FormButton>
      </form>

      <div className="mt-8 flex items-center justify-center space-x-4">
        <span className="h-px w-full bg-gray-300"></span>
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          O
        </span>
        <span className="h-px w-full bg-gray-300"></span>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">
          ¿No tienes una cuenta? Regístrate como:
        </p>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <a
            href="/src/views/singUp/registro-cliente.html"
            className="w-full flex justify-center items-center py-2 px-4 border-2 border-blue-600 rounded-lg shadow-sm text-sm font-medium text-blue-600 bg-transparent hover:bg-blue-50 transition-colors"
          >
            Cliente
          </a>
          <a
            href="/src/views/singUp/registro-profesional.html"
            className="w-full flex justify-center items-center py-2 px-4 border-2 border-green-600 rounded-lg shadow-sm text-sm font-medium text-green-600 bg-transparent hover:bg-green-50 transition-colors"
          >
            Profesional
          </a>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/src/profile/admin.html"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline"
        >
          Ingresar como administrador
        </a>
      </div>
    </div>
  );
}
