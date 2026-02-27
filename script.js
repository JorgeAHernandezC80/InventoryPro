// ========== VARIABLES GLOBALES (deben estar al inicio) ==========
let productos = JSON.parse(localStorage.getItem('productos')) || [];
let productosSeleccionados = new Map();

let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
    { id: 1, nombre: 'Administrador', username: 'admin', password: 'admin', rol: 'admin' }
];
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

// ========== SISTEMA DE LOGIN ==========
document.getElementById('formLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    
    const usuarioExiste = usuarios.find(u => u.username === username);
    
    if (!usuarioExiste) {
        mostrarErrorLogin('Usuario erróneo');
        return;
    }
    
    if (usuarioExiste.password !== password) {
        mostrarErrorLogin('Contraseña errónea');
        return;
    }
    
    usuarioActual = usuarioExiste;
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioExiste));
    localStorage.setItem('sesionActiva', 'true');
    
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainSystem').style.display = 'block';
    
    mostrarInfoUsuario();
    
    if (usuarioExiste.rol === 'admin') {
        document.getElementById('tabUsuarios').style.display = 'block';
    } else {
        document.getElementById('tabUsuarios').style.display = 'none';
    }
});

// Mostrar error de login
function mostrarErrorLogin(mensaje) {
    const loginError = document.createElement('div');
    loginError.className = 'notificacion show error';
    loginError.style.top = '50%';
    loginError.style.left = '50%';
    loginError.style.transform = 'translate(-50%, -50%)';
    loginError.innerHTML = `
        <span class="notificacion-icono"></span>
        <span class="notificacion-mensaje">${mensaje}</span>
    `;
    document.body.appendChild(loginError);
    
    setTimeout(() => {
        loginError.remove();
    }, 3000);
}

// Mostrar información del usuario en el header
function mostrarInfoUsuario() {
    if (usuarioActual) {
        document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;
        document.getElementById('rolUsuario').textContent = usuarioActual.rol === 'admin' ? 'Administrador' : 'Usuario';
    }
}

// Cerrar sesión
document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioActual');
    usuarioActual = null;
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainSystem').style.display = 'none';
    
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';
});

// Verificar sesión al cargar
window.addEventListener('load', () => {
    if (localStorage.getItem('sesionActiva') === 'true' && usuarioActual) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainSystem').style.display = 'block';
        mostrarInfoUsuario();
        
        if (usuarioActual.rol === 'admin') {
            document.getElementById('tabUsuarios').style.display = 'block';
        }
    }
});

// Guardar usuarios en localStorage
function guardarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// ========== NAVEGACIÓN ENTRE TABS ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        
        if (tabId === 'visualizar') {
            mostrarProductos();
        } else if (tabId === 'seleccionar') {
            mostrarProductosSeleccion();
        } else if (tabId === 'usuarios') {
            mostrarUsuarios();
        }
    });
});

// ========== MODO INDIVIDUAL / MASIVO ==========
document.getElementById('modoIndividual').addEventListener('click', () => {
    document.getElementById('modoIndividual').classList.add('active');
    document.getElementById('modoMasivo').classList.remove('active');
    document.getElementById('formularioIndividual').style.display = 'block';
    document.getElementById('formularioMasivo').style.display = 'none';
});

document.getElementById('modoMasivo').addEventListener('click', () => {
    document.getElementById('modoMasivo').classList.add('active');
    document.getElementById('modoIndividual').classList.remove('active');
    document.getElementById('formularioMasivo').style.display = 'block';
    document.getElementById('formularioIndividual').style.display = 'none';
});

// ========== INGRESO INDIVIDUAL DE PRODUCTOS ==========
document.getElementById('formProducto').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const producto = {
        id: Date.now(),
        nombre: document.getElementById('nombre').value,
        cantidad: parseInt(document.getElementById('cantidad').value),
        precio: parseFloat(document.getElementById('precio').value),
        categoria: document.getElementById('categoria').value || 'Sin categoría'
    };
    
    productos.push(producto);
    guardarProductos();
    
    e.target.reset();
    mostrarNotificacion('Producto agregado exitosamente', 'exito');
});

// ========== INGRESO MASIVO DE PRODUCTOS ==========
document.getElementById('btnAgregarMasivo').addEventListener('click', () => {
    const texto = document.getElementById('productosMasivos').value;
    procesarProductosMasivos(texto);
});

// Cargar productos desde archivo CSV/TXT
document.getElementById('btnCargarArchivo').addEventListener('click', () => {
    const archivo = document.getElementById('archivoProductos').files[0];
    
    if (!archivo) {
        mostrarNotificacion('Por favor selecciona un archivo', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const contenido = e.target.result;
        procesarProductosMasivos(contenido);
        document.getElementById('archivoProductos').value = '';
    };
    reader.readAsText(archivo);
});

// Función para procesar productos masivos
function procesarProductosMasivos(texto) {
    const lineas = texto.split('\n').filter(l => l.trim());
    
    if (lineas.length === 0) {
        mostrarNotificacion('No hay productos para agregar', 'error');
        return;
    }
    
    let agregados = 0;
    let errores = 0;
    
    lineas.forEach((linea) => {
        const partes = linea.split(',').map(p => p.trim());
        if (partes.length >= 3) {
            const cantidad = parseInt(partes[1]);
            const precio = parseFloat(partes[2]);
            
            if (isNaN(cantidad) || isNaN(precio)) {
                errores++;
                return;
            }
            
            productos.push({
                id: Date.now() + agregados,
                nombre: partes[0],
                cantidad: cantidad,
                precio: precio,
                categoria: partes[3] || 'Sin categoría'
            });
            agregados++;
        } else {
            errores++;
        }
    });
    
    guardarProductos();
    document.getElementById('productosMasivos').value = '';
    
    if (agregados > 0) {
        mostrarNotificacion(
            `${agregados} producto(s) agregado(s)${errores > 0 ? ` (${errores} error(es))` : ''}`,
            'exito'
        );
    } else {
        mostrarNotificacion('No se pudo agregar ningún producto', 'error');
    }
}

// ========== VISUALIZAR PRODUCTOS ==========
function mostrarProductos(filtro = '') {
    const contenedor = document.getElementById('listaProductos');
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        p.categoria.toLowerCase().includes(filtro.toLowerCase())
    );
    
    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = '<p>No hay productos para mostrar</p>';
        return;
    }
    
    contenedor.innerHTML = productosFiltrados.map(p => `
        <div class="producto-card">
            <h3>${p.nombre}</h3>
            <p><strong>Cantidad:</strong> ${p.cantidad}</p>
            <p><strong>Precio:</strong> $${p.precio.toFixed(2)}</p>
            <p><strong>Categoría:</strong> ${p.categoria}</p>
            <div class="producto-acciones">
                <button class="btn-editar" onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Editar producto
function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('editarId').value = producto.id;
    document.getElementById('editarNombre').value = producto.nombre;
    document.getElementById('editarCantidad').value = producto.cantidad;
    document.getElementById('editarPrecio').value = producto.precio;
    document.getElementById('editarCategoria').value = producto.categoria;
    
    document.getElementById('modalEditar').style.display = 'block';
}

// Cerrar modal de editar producto
function cerrarModal() {
    document.getElementById('modalEditar').style.display = 'none';
}

// Guardar cambios del producto editado
document.getElementById('formEditar')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editarId').value);
    const producto = productos.find(p => p.id === id);
    
    if (producto) {
        producto.nombre = document.getElementById('editarNombre').value;
        producto.cantidad = parseInt(document.getElementById('editarCantidad').value);
        producto.precio = parseFloat(document.getElementById('editarPrecio').value);
        producto.categoria = document.getElementById('editarCategoria').value;
        
        guardarProductos();
        mostrarProductos();
        cerrarModal();
        mostrarNotificacion('Producto actualizado exitosamente', 'exito');
    }
});

// Eliminar producto
function eliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    if (confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
        productos = productos.filter(p => p.id !== id);
        guardarProductos();
        mostrarProductos();
        mostrarNotificacion('Producto eliminado exitosamente', 'exito');
    }
}

// Búsqueda de productos
document.getElementById('buscar').addEventListener('input', (e) => {
    mostrarProductos(e.target.value);
});

// ========== NOTIFICACIONES ==========
function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notificacion = document.getElementById('notificacion');
    const mensajeElem = notificacion.querySelector('.notificacion-mensaje');
    
    mensajeElem.textContent = mensaje;
    notificacion.className = `notificacion show ${tipo}`;
    
    setTimeout(() => {
        notificacion.classList.remove('show');
    }, 3000);
}

// ========== SELECCIONAR PRODUCTOS ==========
function mostrarProductosSeleccion() {
    const contenedor = document.getElementById('productosSeleccion');
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }
    
    contenedor.innerHTML = productos.map(p => {
        const cantidadSeleccionada = productosSeleccionados.get(p.id) || 0;
        const estaSeleccionado = cantidadSeleccionada > 0;
        
        return `
            <div class="producto-seleccionable ${estaSeleccionado ? 'seleccionado' : ''}" data-id="${p.id}">
                <h3>${p.nombre}</h3>
                <p><strong>Precio:</strong> $${p.precio.toFixed(2)}</p>
                <p><strong>Categoría:</strong> ${p.categoria}</p>
                <p class="cantidad-disponible">Disponible: ${p.cantidad} unidades</p>
                <div class="cantidad-selector">
                    <label>Cantidad:</label>
                    <input type="number" 
                           id="cant-${p.id}" 
                           min="0" 
                           max="${p.cantidad}" 
                           value="${cantidadSeleccionada}"
                           class="input-cantidad">
                </div>
                <button class="btn-seleccionar ${estaSeleccionado ? 'seleccionado' : ''}" 
                        onclick="seleccionarProducto(${p.id})">
                    ${estaSeleccionado ? 'Actualizar Selección' : 'Seleccionar'}
                </button>
            </div>
        `;
    }).join('');
    
    actualizarResumen();
}

// Seleccionar producto con validación de cantidad
function seleccionarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    const inputCantidad = document.getElementById(`cant-${id}`);
    const cantidadSolicitada = parseInt(inputCantidad.value) || 0;
    
    if (cantidadSolicitada <= 0) {
        productosSeleccionados.delete(id);
        mostrarNotificacion('Producto removido de la selección', 'exito');
        mostrarProductosSeleccion();
        return;
    }
    
    if (cantidadSolicitada > producto.cantidad) {
        mostrarNotificacion(
            `Error: Solo hay ${producto.cantidad} unidades disponibles de "${producto.nombre}"`,
            'error'
        );
        inputCantidad.value = producto.cantidad;
        return;
    }
    
    productosSeleccionados.set(id, cantidadSolicitada);
    mostrarNotificacion(
        `${cantidadSolicitada} unidad(es) de "${producto.nombre}" seleccionada(s)`,
        'exito'
    );
    mostrarProductosSeleccion();
}

// Actualizar resumen de selección
function actualizarResumen() {
    const resumen = document.getElementById('resumenSeleccion');
    const seleccionados = [];
    
    productosSeleccionados.forEach((cantidad, id) => {
        const producto = productos.find(p => p.id === id);
        if (producto && cantidad > 0) {
            seleccionados.push({ ...producto, cantidadSeleccionada: cantidad });
        }
    });
    
    if (seleccionados.length === 0) {
        resumen.innerHTML = '<p>No hay productos seleccionados</p>';
        return;
    }
    
    const total = seleccionados.reduce((sum, p) => sum + (p.precio * p.cantidadSeleccionada), 0);
    const cantidadTotal = seleccionados.reduce((sum, p) => sum + p.cantidadSeleccionada, 0);
    
    resumen.innerHTML = `
        <h3>Resumen de Selección</h3>
        <p><strong>Productos seleccionados:</strong> ${seleccionados.length}</p>
        <p><strong>Cantidad total:</strong> ${cantidadTotal} unidades</p>
        <p><strong>Valor total:</strong> $${total.toFixed(2)}</p>
        <div style="margin-top: 15px;">
            ${seleccionados.map(p => `
                <p style="margin: 5px 0; color: #666;">
                    • ${p.nombre}: ${p.cantidadSeleccionada} unidad(es) × $${p.precio.toFixed(2)} = $${(p.precio * p.cantidadSeleccionada).toFixed(2)}
                </p>
            `).join('')}
        </div>
    `;
}

// ========== VENDER PRODUCTOS ==========
document.getElementById('btnVenderProductos')?.addEventListener('click', () => {
    const seleccionados = [];
    
    productosSeleccionados.forEach((cantidad, id) => {
        const producto = productos.find(p => p.id === id);
        if (producto && cantidad > 0) {
            seleccionados.push({ ...producto, cantidadSeleccionada: cantidad });
        }
    });
    
    if (seleccionados.length === 0) {
        mostrarNotificacion('No hay productos seleccionados para vender', 'error');
        return;
    }
    
    document.getElementById('modalExportar').style.display = 'block';
});

// Confirmar exportación a CSV
document.getElementById('btnConfirmarExcel')?.addEventListener('click', () => {
    cerrarModalExportar();
    exportarVenta('csv');
});

// Confirmar exportación a PDF
document.getElementById('btnConfirmarPDF')?.addEventListener('click', () => {
    cerrarModalExportar();
    exportarVenta('pdf');
});

// Cerrar modal de exportación
function cerrarModalExportar() {
    document.getElementById('modalExportar').style.display = 'none';
}

// Limpiar selección
document.getElementById('btnLimpiarSeleccion').addEventListener('click', () => {
    productosSeleccionados.clear();
    mostrarProductosSeleccion();
    mostrarNotificacion('Selección limpiada', 'exito');
});

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modalEditar = document.getElementById('modalEditar');
    const modalExportar = document.getElementById('modalExportar');
    const modalUsuario = document.getElementById('modalUsuario');
    
    if (event.target === modalEditar) cerrarModal();
    if (event.target === modalExportar) cerrarModalExportar();
    if (event.target === modalUsuario) cerrarModalUsuario();
}

// ========== EXPORTAR VENTA ==========
function exportarVenta(formato) {
    const seleccionados = [];
    
    productosSeleccionados.forEach((cantidad, id) => {
        const producto = productos.find(p => p.id === id);
        if (producto && cantidad > 0) {
            seleccionados.push({ ...producto, cantidadSeleccionada: cantidad });
        }
    });
    
    if (seleccionados.length === 0) {
        mostrarNotificacion('No hay productos seleccionados', 'error');
        return;
    }
    
    const total = seleccionados.reduce((sum, p) => sum + (p.precio * p.cantidadSeleccionada), 0);
    
    try {
        if (formato === 'csv') {
            exportarCSV(seleccionados, total);
        } else {
            exportarPDF(seleccionados, total);
        }
        
        // Actualizar inventario
        seleccionados.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                producto.cantidad -= item.cantidadSeleccionada;
                if (producto.cantidad < 0) producto.cantidad = 0;
            }
        });
        
        guardarProductos();
        productosSeleccionados.clear();
        mostrarProductosSeleccion();
        mostrarNotificacion('Venta registrada e inventario actualizado', 'exito');
    } catch (error) {
        console.error('Error al exportar:', error);
        mostrarNotificacion('Error al exportar: ' + error.message, 'error');
    }
}

// Exportar a CSV
function exportarCSV(seleccionados, total) {
    const fecha = new Date().toLocaleDateString('es-ES');
    
    let csv = 'Producto,Cantidad,Precio Unitario,Subtotal,Categoría\n';
    
    seleccionados.forEach(p => {
        csv += `${p.nombre},${p.cantidadSeleccionada},${p.precio.toFixed(2)},${(p.precio * p.cantidadSeleccionada).toFixed(2)},${p.categoria}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Venta_${fecha.replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Exportar a PDF
function exportarPDF(seleccionados, total) {
    if (typeof window.jspdf === 'undefined') {
        mostrarNotificacion('Error: Librería de PDF no cargada', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const fecha = new Date().toLocaleDateString('es-ES');
    const hora = new Date().toLocaleTimeString('es-ES');
    
    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210);
    doc.text('REPORTE DE VENTA', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha: ${fecha}`, 20, 35);
    doc.text(`Hora: ${hora}`, 20, 42);
    
    const tableData = seleccionados.map(p => [
        p.nombre,
        p.cantidadSeleccionada.toString(),
        '$' + p.precio.toFixed(2),
        '$' + (p.precio * p.cantidadSeleccionada).toFixed(2),
        p.categoria
    ]);
    
    doc.autoTable({
        startY: 50,
        head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal', 'Categoría']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [25, 118, 210],
            textColor: 255,
            fontStyle: 'bold'
        },
        styles: {
            fontSize: 10,
            cellPadding: 5
        },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 25, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 40 }
        }
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', 130, finalY);
    doc.text('$' + total.toFixed(2), 190, finalY, { align: 'right' });
    
    doc.save(`Venta_${fecha.replace(/\//g, '-')}.pdf`);
}

// Guardar productos en localStorage
function guardarProductos() {
    localStorage.setItem('productos', JSON.stringify(productos));
}


// ========== GESTIÓN DE USUARIOS ==========

function mostrarUsuarios() {
    const contenedor = document.getElementById('listaUsuarios');
    
    if (usuarios.length === 0) {
        contenedor.innerHTML = '<p>No hay usuarios registrados</p>';
        return;
    }
    
    contenedor.innerHTML = usuarios.map(u => `
        <div class="usuario-card">
            <h3>${u.nombre}</h3>
            <p><strong>Usuario:</strong> ${u.username}</p>
            <p><strong>Rol:</strong> <span class="usuario-badge ${u.rol}">${u.rol === 'admin' ? 'Administrador' : 'Usuario'}</span></p>
            <div class="usuario-acciones">
                <button class="btn-editar-usuario" onclick="editarUsuario(${u.id})">Editar</button>
                <button class="btn-eliminar-usuario" onclick="eliminarUsuario(${u.id})" ${u.id === 1 ? 'disabled' : ''}>Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Abrir modal para nuevo usuario
document.getElementById('btnNuevoUsuario')?.addEventListener('click', () => {
    document.getElementById('tituloModalUsuario').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('usuarioPassword').required = true;
    document.getElementById('modalUsuario').style.display = 'block';
});

// Editar usuario
function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    
    document.getElementById('tituloModalUsuario').textContent = 'Editar Usuario';
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('usuarioNombre').value = usuario.nombre;
    document.getElementById('usuarioUsername').value = usuario.username;
    document.getElementById('usuarioPassword').value = '';
    document.getElementById('usuarioPassword').required = false;
    document.getElementById('usuarioPassword').placeholder = 'Dejar en blanco para mantener la actual';
    document.getElementById('usuarioRol').value = usuario.rol;
    
    document.getElementById('modalUsuario').style.display = 'block';
}

// Guardar usuario (crear o editar)
document.getElementById('formUsuario')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const nombre = document.getElementById('usuarioNombre').value;
    const username = document.getElementById('usuarioUsername').value;
    const password = document.getElementById('usuarioPassword').value;
    const rol = document.getElementById('usuarioRol').value;
    
    const usernameExiste = usuarios.some(u => u.username === username && u.id != id);
    if (usernameExiste) {
        mostrarNotificacion('El nombre de usuario ya existe', 'error');
        return;
    }
    
    if (id) {
        const usuario = usuarios.find(u => u.id == id);
        if (usuario) {
            usuario.nombre = nombre;
            usuario.username = username;
            if (password) usuario.password = password;
            usuario.rol = rol;
            
            if (usuarioActual && usuarioActual.id == id) {
                usuarioActual = usuario;
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                mostrarInfoUsuario();
            }
            
            mostrarNotificacion('Usuario actualizado exitosamente', 'exito');
        }
    } else {
        const nuevoUsuario = {
            id: Date.now(),
            nombre,
            username,
            password,
            rol
        };
        usuarios.push(nuevoUsuario);
        mostrarNotificacion('Usuario creado exitosamente', 'exito');
    }
    
    guardarUsuarios();
    mostrarUsuarios();
    cerrarModalUsuario();
});

// Eliminar usuario
function eliminarUsuario(id) {
    if (id === 1) {
        mostrarNotificacion('No se puede eliminar el usuario administrador principal', 'error');
        return;
    }
    
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    
    if (confirm(`¿Estás seguro de eliminar al usuario "${usuario.nombre}"?`)) {
        usuarios = usuarios.filter(u => u.id !== id);
        guardarUsuarios();
        mostrarUsuarios();
        mostrarNotificacion('Usuario eliminado exitosamente', 'exito');
    }
}

// Cerrar modal de usuario
function cerrarModalUsuario() {
    document.getElementById('modalUsuario').style.display = 'none';
    document.getElementById('usuarioPassword').required = true;
    document.getElementById('usuarioPassword').placeholder = 'Contraseña';
}