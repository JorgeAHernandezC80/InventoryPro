// Abrir modal con datos de producto
function verProducto(codigo) {
    const producto = productManager.productos.find(p => p.codigo === codigo);
    if (!producto) return;

    document.getElementById('view-prod-code').value = producto.codigo;
    document.getElementById('view-prod-name').value = producto.nombre;
    document.getElementById('view-prod-fecha-elab').value = producto.fechaElab;
    document.getElementById('view-prod-fecha-vence').value = producto.fechaVence;
    document.getElementById('view-prod-tipo').value = producto.tipo;
    document.getElementById('view-prod-fecha-compra').value = producto.fechaCompra;
    document.getElementById('view-prod-proveedor').value = producto.proveedor;
    document.getElementById('view-prod-fecha-venta').value = producto.fechaVenta;

    document.getElementById('prod-modal-view').classList.add('active');
}

// Cerrar modal al presionar la X
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-prod-modal');
        document.getElementById(modalId).classList.remove('active');
    });
});