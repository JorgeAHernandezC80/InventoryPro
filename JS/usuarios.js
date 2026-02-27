// usuarios.js
let usuarios = [
    { id: 1, nombre: 'Admin', username: 'admin', password: 'admin', rol: 'admin' }
];

const formUsuario = document.getElementById('formUsuario');

if(formUsuario){
    formUsuario.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('usuarioNombre').value;
        const username = document.getElementById('usuarioUsername').value;
        const password = document.getElementById('usuarioPassword').value;
        const rol = document.getElementById('usuarioRol').value;

        const id = usuarios.length + 1;
        usuarios.push({ id, nombre, username, password, rol });
        alert(`Usuario ${nombre} agregado!`);
        formUsuario.reset();
    });
}