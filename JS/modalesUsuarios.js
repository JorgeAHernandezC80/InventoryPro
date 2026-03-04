// Archivo: modales.js

document.addEventListener("DOMContentLoaded", () => {
    // Función general para abrir un modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add("active");
    };

    // Función general para cerrar un modal
    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove("active");
    };

    // Asociar botones de abrir modal
    const btnCrear = document.getElementById("btnCrear");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnEliminar = document.getElementById("btnEliminar");

    btnCrear?.addEventListener("click", () => openModal("modalCrear"));
    btnActualizar?.addEventListener("click", () => openModal("modalActualizar"));
    btnEliminar?.addEventListener("click", () => openModal("modalEliminar"));

    // Asociar botones de cerrar modal (la X y el botón cancelar)
    const closeButtons = document.querySelectorAll(".close-btn, .btn-cancel");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.modal;
            closeModal(modalId);
        });
    });

    // Cerrar modal si se hace click fuera del contenido
    const modales = document.querySelectorAll(".modal");
    modales.forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    // Opcional: enviar formularios
    const formCrear = document.getElementById("formCrearUsuario");
    formCrear?.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Usuario creado correctamente!");
        closeModal("modalCrear");
        formCrear.reset();
    });

    const formActualizar = document.getElementById("formActualizarUsuario");
    formActualizar?.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Usuario actualizado correctamente!");
        closeModal("modalActualizar");
        formActualizar.reset();
    });

    const formEliminar = document.getElementById("formEliminarUsuario");
    formEliminar?.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Usuario eliminado correctamente!");
        closeModal("modalEliminar");
        formEliminar.reset();
    });
});