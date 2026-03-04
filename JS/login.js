const formLogin = document.getElementById('formLogin');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');

if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        if (usuario === 'admin' && password === 'admin') {
            // Guardar sesión si quieres (opcional)
            sessionStorage.setItem('usuario', usuario);
            sessionStorage.setItem('rol', 'admin');

            // Redirigir a la página principal
            window.location.href = "home.html"; // <-- Aquí va tu home.html
        } else {
            const errorMsg = document.getElementById('login-error');
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = "Usuario o contraseña incorrectos";
            }
        }
    });
}

// Cerrar sesión (en cualquier página que tenga btnCerrarSesion)
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        sessionStorage.clear(); // Limpiar sesión
        window.location.href = "login.html"; // Redirigir al login
    });
}