import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [esRegistro, setEsRegistro] = useState(false); // Estado para saber si estamos logueando o registrando

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Definimos a qué endpoint pegarle según el modo
        const endpoint = esRegistro ? '/auth/register' : '/auth/login';

        try {
            const response = await fetch(`http://localhost:8080/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // Si es registro y todo sale bien
            if (esRegistro) {
                if (!response.ok) {
                    const txtError = await response.text();
                    throw new Error(txtError || 'No se pudo registrar el usuario, mae.');
                }
                setSuccess('¡Usuario registrado con éxito! Ya podés iniciar sesión.');
                setEsRegistro(false); // Lo mandamos al login de una vez
                setPassword('');
            } else {
                // Si es login tradicional
                if (!response.ok) {
                    throw new Error('Credenciales incorrectas, mae.');
                }
                const data = await response.json();
                localStorage.setItem('token', data.token);
                onLoginSuccess();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-gray-800 p-8 shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-cyan-400">Vulkan Inventario</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {esRegistro ? 'Creá tu cuenta de administrador' : 'Ingresá tus credenciales de administrador'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-rose-600/20 text-rose-400 p-3 rounded-lg text-sm border border-rose-500/30 font-medium text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-emerald-600/20 text-emerald-400 p-3 rounded-lg text-sm border border-emerald-500/30 font-medium text-center">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1 tracking-wider">Usuario</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-700 p-2.5 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1 tracking-wider">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 p-2.5 rounded text-white border border-gray-600 focus:border-cyan-400 outline-none transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-cyan-500/10 uppercase tracking-wider text-sm mt-2"
                    >
                        {esRegistro ? 'Registrarse' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="text-center pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setEsRegistro(!esRegistro);
                            setError('');
                            setSuccess('');
                        }}
                        className="text-xs text-cyan-400 hover:underline bg-transparent border-none outline-none cursor-pointer"
                    >
                        {esRegistro ? '¿Ya tenés cuenta? Iniciá Sesión' : '¿No tenés usuario? Registrate aquí'}
                    </button>
                </div>
            </div>
        </div>
    );
}