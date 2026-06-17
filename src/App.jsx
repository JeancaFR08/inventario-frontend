import { useEffect, useState } from 'react';
import { getComponentes, createComponente, updateComponente, deleteComponente } from './services/api';
import Login from './Login'; // <-- Asegurate de que la ruta apunte a tu Login.jsx

function App() {
  const [componentes, setComponentes] = useState([]);
  const [editando, setEditando] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token')); // Guardamos el estado del token

  // Estado inicial limpio para el formulario
  const estadoInicialForm = {
    id: '',
    tipo: 'Procesador', // Valor por defecto
    marca: '',
    modelo: '',
    precio: '',
    vram: 0,
    nucleos: 0
  };

  const [form, setForm] = useState(estadoInicialForm);

  const cargarComponentes = async () => {
    try {
      const response = await getComponentes();
      setComponentes(response.data);
    } catch (error) {
      console.error("Error conectando al backend:", error);
    }
  };

  // Este useEffect se dispara al arrancar o cuando cambia el estado del token
  useEffect(() => {
    if (token) {
      cargarComponentes();
    }
  }, [token]);

  // Manejar login exitoso
  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('token'));
  };

  // Manejar cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setComponentes([]);
  };

  // Activar modo edición y cargar datos del componente
  const seleccionarComponente = (comp) => {
    setEditando(true);
    setForm({
      id: comp.id,
      tipo: comp.tipo,
      marca: comp.marca,
      modelo: comp.modelo,
      precio: comp.precio,
      vram: comp.vram || 0,
      nucleos: comp.nucleos || 0
    });
  };

  // Eliminar componente con confirmación
  const gestionarEliminar = async (id) => {
    if (window.confirm("Desea borrar este componente?")) {
      try {
        await deleteComponente(id);
        cargarComponentes();
        alert("Componente eliminado.");
      } catch (error) {
        console.error("Error al borrar:", error);
        alert("No se pudo eliminar el componente.");
      }
    }
  };

  // Manejar cambios en inputs en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'precio' || name === 'vram' || name === 'nucleos' ? Number(value) : value
    });
  };

  // Enviar formulario (Sirve para CREAR o para ACTUALIZAR)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        // Ejecuta el PUT
        await updateComponente(form.id, form);
        alert("Componente actualizado con éxito!");
      } else {
        // Ejecuta el POST (Crea uno nuevo)
        const nuevoComponente = { ...form };
        delete nuevoComponente.id;
        await createComponente(nuevoComponente);
        alert("Componente añadido al inventario!");
      }
      cancelarEdicion();
      cargarComponentes();
    } catch (error) {
      console.error("Error en la operación:", error);
      alert("No llegó los datos al backend. Recordá que ocupás estar autenticado.");
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setForm(estadoInicialForm);
  };

  // 🛡️ CONDICIONAL DE SEGURIDAD: Si no hay token, se renderiza la vista de Login
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
        <div className="max-w-6xl mx-auto">

          {/* Header con botón de Cerrar Sesión */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-4 gap-4">
            <h1 className="text-3xl font-bold text-cyan-400">
              Panel de Inventario Componentes Pro
            </h1>
            <button
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-rose-600/10"
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Formulario Dinámico (Añadir / Editar) */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700 focus-within:border-cyan-500/30 transition-all">
            <h2 className="text-xl font-bold text-cyan-300 mb-4">
              {editando ? 'Editar Componente' : 'Añadir Nuevo Componente'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Tipo de Componente</label>
                <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    disabled={editando}
                    className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 outline-none disabled:opacity-50"
                >
                  <option value="Procesador">Procesador</option>
                  <option value="Tarjeta Grafica">Tarjeta Gráfica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Marca</label>
                <input type="text" name="marca" value={form.marca} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none" required />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Modelo</label>
                <input type="text" name="modelo" value={form.modelo} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none" required />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Precio ($)</label>
                <input type="number" step="0.01" name="precio" value={form.precio === 0 ? '' : form.precio} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none" required />
              </div>

              {form.tipo === 'Procesador' ? (
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">Núcleos</label>
                    <input type="number" name="nucleos" value={form.nucleos === 0 ? '' : form.nucleos} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none" />
                  </div>
              ) : (
                  <div>
                    <label className="block text-xs uppercase text-gray-400 mb-1">VRAM (GB)</label>
                    <input type="number" name="vram" value={form.vram === 0 ? '' : form.vram} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none" />
                  </div>
              )}

              <div className="md:col-span-3 flex gap-2 mt-2">
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold px-5 py-2 rounded transition-colors shadow-md shadow-cyan-500/10">
                  {editando ? 'Guardar Cambios' : 'Añadir al Stock'}
                </button>
                {editando && (
                    <button type="button" onClick={cancelarEdicion} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded transition-colors">
                      Cancelar Edición
                    </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla Completa de Componentes */}
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-gray-700 text-cyan-300 uppercase text-xs tracking-wider">
                <th className="p-4">Tipo</th>
                <th className="p-4">Marca</th>
                <th className="p-4">Modelo</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Detalle técnico</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
              {componentes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-400">
                      No hay componentes registrados o la sesión expiró.
                    </td>
                  </tr>
              ) : (
                  componentes.map((comp) => (
                      <tr key={comp.id} className="hover:bg-gray-750 transition-colors">
                        <td className="p-4 font-medium">{comp.tipo}</td>
                        <td className="p-4 text-gray-400">{comp.marca}</td>
                        <td className="p-4 text-gray-300">{comp.modelo}</td>
                        <td className="p-4 text-green-400 font-semibold">${comp.precio}</td>
                        <td className="p-4 text-gray-400">
                          {comp.tipo === 'Procesador' ? `${comp.nucleos || 0} Cores` : `${comp.vram || 0} GB VRAM`}
                        </td>
                        <td className="p-4 text-center flex justify-center gap-2">
                          <button
                              onClick={() => seleccionarComponente(comp)}
                              className="bg-amber-500 hover:bg-amber-600 text-gray-900 text-xs font-bold px-3 py-1.5 rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button
                              onClick={() => gestionarEliminar(comp.id)}
                              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                  ))
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}

export default App;