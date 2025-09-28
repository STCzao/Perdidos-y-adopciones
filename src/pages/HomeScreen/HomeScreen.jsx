const HomeScreen = ({ cerrarSesion, user }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {user?.nombre || "Usuario"}
      </h1>
      <button
        onClick={cerrarSesion}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default HomeScreen;
