// login.js
const formLogin = document.getElementById('formLogin');
const loginScreen = document.getElementById('loginScreen');
const mainSystem = document.getElementById('mainSystem');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    // Validación básica
    if(usuario === 'admin' && password === 'admin') {
        loginScreen.style.display = 'none';
        mainSystem.style.display = 'block';
        document.getElementById('nombreUsuario').textContent = 'Admin';
        document.getElementById('rolUsuario').textContent = 'Administrador';
    } else {
        alert('Usuario o contraseña incorrecta');
    }
});

// Cerrar sesión
document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    mainSystem.style.display = 'none';
    loginScreen.style.display = 'flex';
    formLogin.reset();
});