import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    contacto: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos de LocalStorage al iniciar
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("proveedores")) || [];
    setProveedores(data);
  }, []);

  // Guardar en LocalStorage cada vez que cambie la lista
  useEffect(() => {
    localStorage.setItem("proveedores", JSON.stringify(proveedores));
  }, [proveedores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validaciones
  const validar = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio";
    if (!formData.contacto.trim()) return "El contacto es obligatorio";
    if (!formData.direccion.trim()) return "La direccion es obligatoria";
    if (!/^[0-9]+$/.test(formData.telefono))
      return "El telefono debe contener solo números";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return "El email no es valido";
    return null;
  };

  // Crear o actualizar proveedor
  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validar();
    if (error) {
      toast.error(error);
      return;
    }

    if (isEditing) {
      setProveedores(
        proveedores.map((prov) =>
          prov.id === formData.id ? { ...formData } : prov
        )
      );
      toast.success("Proveedor actualizado correctamente");
    } else {
      setProveedores([
        ...proveedores,
        { ...formData, id: Date.now() },
      ]);
      toast.success("Proveedor agregado correctamente");
    }

    setFormData({
      id: null,
      nombre: "",
      contacto: "",
      direccion: "",
      telefono: "",
      email: "",
    });
    setIsEditing(false);
  };

  // Editar proveedor
  const handleEdit = (proveedor) => {
    setFormData(proveedor);
    setIsEditing(true);
  };

  // Eliminar proveedor
  const handleDelete = (id) => {
    setProveedores(proveedores.filter((prov) => prov.id !== id));
    toast.success("Proveedor eliminado");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Gestión de Proveedores
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del proveedor"
            value={formData.nombre}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="contacto"
            placeholder="Persona de contacto"
            value={formData.contacto}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            {isEditing ? "Actualizar Proveedor" : "Agregar Proveedor"}
          </button>
        </form>

        {/* Tabla */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Contacto</th>
              <th className="border p-2">Dirección</th>
              <th className="border p-2">Teléfono</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((prov) => (
                <tr key={prov.id} className="text-center">
                  <td className="border p-2">{prov.nombre}</td>
                  <td className="border p-2">{prov.contacto}</td>
                  <td className="border p-2">{prov.direccion}</td>
                  <td className="border p-2">{prov.telefono}</td>
                  <td className="border p-2">{prov.email}</td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(prov)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(prov.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No hay proveedores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
