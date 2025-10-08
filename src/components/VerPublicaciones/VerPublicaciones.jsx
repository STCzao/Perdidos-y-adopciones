"use client";
import React, { useState } from "react";
import { publicacionesService } from "../../services";

let modalControl;

export const VerPublicaciones = {
  openModal: () => modalControl?.setOpen(true),
  Component: () => {
    const [open, setOpen] = useState(false);
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionEditando, setPublicacionEditando] = useState(null);

    modalControl = { setOpen };

    // Cargar publicaciones al abrir el modal
    React.useEffect(() => {
      if (open) {
        cargarPublicaciones();
      }
    }, [open]);

    const cargarPublicaciones = async () => {
      try {
        const data = await publicacionesService.getPublicaciones();
        if (data && !data.msg) {
          // Filtrar solo las publicaciones del usuario actual
          setPublicaciones(data);
        }
      } catch (error) {
        console.error("Error cargando publicaciones:", error);
      }
    };

    const handleEditar = (publicacion) => {
      setPublicacionEditando(publicacion);
      // Aquí abrirías un formulario de edición
    };

    const handleEliminar = async (id) => {
      if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
        try {
          const result = await publicacionesService.borrarPublicacion(id);
          if (result && !result.msg) {
            cargarPublicaciones(); // Recargar lista
          }
        } catch (error) {
          console.error("Error eliminando publicación:", error);
        }
      }
    };

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Mis Publicaciones</h3>

          {/* LISTA DE PUBLICACIONES */}
          <div className="space-y-4">
            {publicaciones.map((publicacion) => (
              <div key={publicacion._id} className="border p-4 rounded">
                <h4 className="font-semibold">{publicacion.titulo}</h4>
                <p className="text-gray-600">{publicacion.descripcion}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditar(publicacion)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(publicacion._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="py-2 px-4 bg-gray-300 rounded"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  },
};
