// Archivo: modalesProductos.js
document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // Funciones generales de modal
    // =============================
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("active");
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("active");
    };

    // Asociar botones de abrir modal
    const btnCrear = document.getElementById("prod-btn-create");
    const btnEditar = document.getElementById("prod-btn-edit");

    btnCrear?.addEventListener("click", () => openModal("prod-modal-create"));
    btnEditar?.addEventListener("click", () => openModal("prod-modal-edit"));

    // Asociar botones de cerrar modal (la X y cancelar)
    const closeButtons = document.querySelectorAll(".product-modal-close, .product-btn-cancel");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.prodModal || btn.dataset.prodModal;
            if(modalId) closeModal(modalId);
        });
    });

    // Cerrar modal si se hace click fuera del contenido
    const modales = document.querySelectorAll(".product-modal");
    modales.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    // =============================
    // CRUD simple para productos
    // =============================
    class Producto {
        constructor(codigo, nombre, categoria, precio, stock, estado) {
            this.codigo = codigo;
            this.nombre = nombre;
            this.categoria = categoria;
            this.precio = parseFloat(precio);
            this.stock = parseInt(stock);
            this.estado = estado;
        }
    }

    class ProductoManager {
        constructor(tbodyId) {
            this.productos = [];
            this.tbody = document.getElementById(tbodyId);
        }

        agregar(producto) {
            this.productos.push(producto);
            this.render();
        }

        render() {
            this.tbody.innerHTML = "";
            this.productos.forEach(prod => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${prod.codigo}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.categoria}</td>
                    <td>$${prod.precio.toFixed(2)}</td>
                    <td>${prod.stock}</td>
                    <td class="${prod.estado === "activo" ? "estado-activo" : "estado-inactivo"}">${prod.estado}</td>
                    <td>
                        <button class="product-btn product-btn-edit" onclick="productoManager.llenarEditar('${prod.codigo}')">✏️ Editar</button>
                    </td>
                `;
                this.tbody.appendChild(row);
            });
            this.actualizarMetricas();
        }

        actualizarMetricas() {
            const total = this.productos.length;
            const activos = this.productos.filter(p => p.estado === "activo").length;
            const inactivos = total - activos;
            document.getElementById("prod-total-count").textContent = total;
            document.getElementById("prod-active-count").textContent = activos;
            document.getElementById("prod-inactive-count").textContent = inactivos;
        }

        llenarEditar(codigo) {
            const prod = this.productos.find(p => p.codigo === codigo);
            if (!prod) return;
            document.getElementById("prod-edit-code").value = prod.codigo;
            document.getElementById("prod-edit-price").value = prod.precio;
            document.getElementById("prod-edit-stock").value = prod.stock;
            document.getElementById("prod-edit-status").value = prod.estado;
            openModal("prod-modal-edit");
        }

        actualizar(codigo, nuevosDatos) {
            const prod = this.productos.find(p => p.codigo === codigo);
            if (prod) Object.assign(prod, nuevosDatos);
            this.render();
        }
    }

    const productoManager = new ProductoManager("prod-table-body");

    // =============================
    // Formularios
    // =============================

    // Crear producto
    const formCrear = document.getElementById("prod-form-create");
    formCrear?.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevoProducto = new Producto(
            document.getElementById("prod-input-code").value,
            document.getElementById("prod-input-name").value,
            document.getElementById("prod-input-category").value,
            document.getElementById("prod-input-price").value,
            document.getElementById("prod-input-stock").value,
            document.getElementById("prod-input-status").value
        );
        productoManager.agregar(nuevoProducto);
        closeModal("prod-modal-create");
        formCrear.reset();
    });

    // Editar producto
    const formEditar = document.getElementById("prod-form-edit");
    formEditar?.addEventListener("submit", (e) => {
        e.preventDefault();
        const codigo = document.getElementById("prod-edit-code").value;
        const nuevosDatos = {
            precio: parseFloat(document.getElementById("prod-edit-price").value),
            stock: parseInt(document.getElementById("prod-edit-stock").value),
            estado: document.getElementById("prod-edit-status").value
        };
        productoManager.actualizar(codigo, nuevosDatos);
        closeModal("prod-modal-edit");
        formEditar.reset();
    });

});