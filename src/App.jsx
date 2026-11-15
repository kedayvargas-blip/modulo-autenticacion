import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const USUARIO_DEFAULT = {
    nombre: 'Kellin Vargas',
    usuario: 'adminclaro',
    password: 'Claro2026*',
  };

  const [usuariosRegistrados, setUsuariosRegistrados] = useState(() => {
    const guardados = localStorage.getItem('usuarios_sistema');
    return guardados ? JSON.parse(guardados) : [USUARIO_DEFAULT];
  });

  const [vista, setVista] = useState('login');
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    localStorage.setItem('usuarios_sistema', JSON.stringify(usuariosRegistrados));
  }, [usuariosRegistrados]);

  const limpiarFormulario = () => {
    setNombre('');
    setUsuario('');
    setPassword('');
  };

  const manejarRegistro = (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!nombre.trim() || !usuario.trim() || !password.trim()) {
      setMensaje({ tipo: 'error', texto: 'Error: Todos los campos son obligatorios.' });
      return;
    }

    const existe = usuariosRegistrados.some(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );

    if (existe) {
      setMensaje({ tipo: 'error', texto: 'Error: El nombre de usuario ya está registrado.' });
      return;
    }

    const nuevoUsuario = {
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      password: password.trim(),
    };

    setUsuariosRegistrados([...usuariosRegistrados, nuevoUsuario]);
    limpiarFormulario();
    setVista('login');
    setMensaje({
      tipo: 'exito',
      texto: `¡Registro exitoso! Ahora puedes iniciar sesión con el usuario "${nuevoUsuario.usuario}".`,
    });
  };

  const manejarLogin = (e) => {
    e.preventDefault();
    setMensaje(null);

    const encontrado = usuariosRegistrados.find(
      (u) => u.usuario === usuario.trim() && u.password === password.trim()
    );

    if (encontrado) {
      setUsuarioActivo(encontrado);
      setVista('dashboard');
      limpiarFormulario();
      setMensaje({
        tipo: 'exito',
        texto: `¡Autenticación exitosa! Bienvenido(a), ${encontrado.nombre}.`,
      });
    } else {
      setMensaje({
        tipo: 'error',
        texto: 'Error de autenticación: Usuario o contraseña incorrectos.',
      });
    }
  };

  const cerrarSesion = () => {
    setUsuarioActivo(null);
    setVista('login');
    setMensaje({ tipo: 'exito', texto: 'Sesión cerrada correctamente.' });
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <h2 style={estilos.titulo}>Sistema de Autenticación y Registro</h2>
        <p style={estilos.subtitulo}>Claro Colombia - Gestión de Sedes</p>

        {mensaje && (
          <div
            style={{
              ...estilos.alerta,
              backgroundColor: mensaje.tipo === 'exito' ? '#d4edda' : '#f8d7da',
              color: mensaje.tipo === 'exito' ? '#155724' : '#721c24',
              borderColor: mensaje.tipo === 'exito' ? '#c3e6cb' : '#f5c6cb',
            }}
          >
            {mensaje.texto}
          </div>
        )}

        {vista === 'login' && (
          <form onSubmit={manejarLogin} style={estilos.formulario}>
            <h3>Iniciar Sesión</h3>
            <label style={estilos.label}>Usuario:</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={estilos.input}
            />

            <label style={estilos.label}>Contraseña:</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={estilos.input}
            />

            <button type="submit" style={estilos.botonPrincipal}>
              Ingresar
            </button>

            <p style={estilos.textoCambio}>
              ¿No tienes cuenta?{' '}
              <span
                style={estilos.enlace}
                onClick={() => {
                  setVista('registro');
                  setMensaje(null);
                  limpiarFormulario();
                }}
              >
                Regístrate aquí
              </span>
            </p>
          </form>
        )}

        {vista === 'registro' && (
          <form onSubmit={manejarRegistro} style={estilos.formulario}>
            <h3>Registrar Nuevo Usuario</h3>
            <label style={estilos.label}>Nombre Completo:</label>
            <input
              type="text"
              placeholder="Ej: Carlos Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={estilos.input}
            />

            <label style={estilos.label}>Usuario:</label>
            <input
              type="text"
              placeholder="Ej: cperez01"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              style={estilos.input}
            />

            <label style={estilos.label}>Contraseña:</label>
            <input
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={estilos.input}
            />

            <button type="submit" style={estilos.botonPrincipal}>
              Crear Cuenta
            </button>

            <p style={estilos.textoCambio}>
              ¿Ya tienes cuenta?{' '}
              <span
                style={estilos.enlace}
                onClick={() => {
                  setVista('login');
                  setMensaje(null);
                  limpiarFormulario();
                }}
              >
                Inicia sesión
              </span>
            </p>
          </form>
        )}

        {vista === 'dashboard' && usuarioActivo && (
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <p>
              Has ingresado correctamente como <strong>{usuarioActivo.nombre}</strong> (
              <code>{usuarioActivo.usuario}</code>).
            </p>
            <p style={{ fontSize: '14px', color: '#555' }}>
              Usuarios registrados actualmente en el sistema: {usuariosRegistrados.length}
            </p>
            <button onClick={cerrarSesion} style={estilos.botonSecundario}>
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const estilos = {
  contenedor: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  tarjeta: {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    width: '100%',
    maxWidth: '400px',
  },
  titulo: {
    margin: '0 0 5px 0',
    color: '#da291c',
    textAlign: 'center',
  },
  subtitulo: {
    margin: '0 0 20px 0',
    color: '#666',
    textAlign: 'center',
    fontSize: '14px',
  },
  alerta: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  botonPrincipal: {
    padding: '12px',
    backgroundColor: '#da291c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  botonSecundario: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  textoCambio: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
  },
  enlace: {
    color: '#da291c',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default App;