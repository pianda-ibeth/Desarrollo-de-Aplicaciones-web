// ============================================================
// TechStore Maly - script.js
// Registro dinámico de productos (sección #registro)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    // ---------- Referencias a elementos del DOM ----------
    const formulario      = document.getElementById('formularioProducto');
    const inputNombre     = document.getElementById('nombreProducto');
    const inputDescripcion = document.getElementById('descripcionProducto');
    const selectCategoria = document.getElementById('categoriaProducto');
    const divMensaje      = document.getElementById('mensaje');
    const spanTotal       = document.getElementById('totalProductos');
    const listaProductos  = document.getElementById('listaProductos');

    // Formulario de contacto (independiente, solo evitamos que recargue la página)
    const formularioContacto = document.getElementById('formularioContacto');

    // ---------- Estado ----------
    let totalProductos = 0;
    let contadorId = 0;

    // Color de la insignia (badge) según la categoría elegida
    const colorPorCategoria = {
        'Laptops': 'bg-primary',
        'Smartphones': 'bg-info text-dark',
        'Accesorios': 'bg-warning text-dark'
    };

    // ---------- Funciones auxiliares ----------

    // Muestra un mensaje dinámico (éxito, error o aviso) usando clases de Bootstrap
    function mostrarMensaje(texto, tipo) {
        divMensaje.innerHTML = '';

        const alerta = document.createElement('div');
        alerta.className = 'alert alert-' + tipo + ' alert-dismissible fade show';
        alerta.setAttribute('role', 'alert');
        alerta.textContent = texto;

        const botonCerrar = document.createElement('button');
        botonCerrar.type = 'button';
        botonCerrar.className = 'btn-close';
        botonCerrar.setAttribute('data-bs-dismiss', 'alert');
        botonCerrar.setAttribute('aria-label', 'Cerrar');

        alerta.appendChild(botonCerrar);
        divMensaje.appendChild(alerta);
    }

    // Resalta visualmente un campo como válido o inválido
    function marcarCampo(campo, esValido) {
        campo.classList.toggle('is-invalid', !esValido);
        campo.classList.toggle('is-valid', esValido);
    }

    // Valida los campos del formulario y devuelve la lista de campos vacíos
    function validarFormulario(nombre, descripcion, categoria) {
        const camposVacios = [];

        const nombreValido = nombre.trim() !== '';
        const descripcionValida = descripcion.trim() !== '';
        const categoriaValida = categoria !== '';

        marcarCampo(inputNombre, nombreValido);
        marcarCampo(inputDescripcion, descripcionValida);
        marcarCampo(selectCategoria, categoriaValida);

        if (!nombreValido) camposVacios.push('Nombre');
        if (!descripcionValida) camposVacios.push('Descripción');
        if (!categoriaValida) camposVacios.push('Categoría');

        return camposVacios;
    }

    // Quita las marcas visuales de validación de un grupo de campos
    function limpiarValidacion() {
        [inputNombre, inputDescripcion, selectCategoria].forEach(function (campo) {
            campo.classList.remove('is-valid', 'is-invalid');
        });
    }

    // Actualiza el contador de productos en pantalla
    function actualizarTotal() {
        spanTotal.textContent = totalProductos;
    }

    // Crea la tarjeta (card) de un producto nuevo usando createElement/appendChild
    function crearTarjetaProducto(nombre, descripcion, categoria, id) {

        const columna = document.createElement('div');
        columna.className = 'col-md-4 mb-3';
        columna.id = 'producto-' + id;

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card h-100 shadow-sm';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card-body d-flex flex-column';

        const insignia = document.createElement('span');
        insignia.className = 'badge ' + (colorPorCategoria[categoria] || 'bg-secondary') + ' mb-2 align-self-start';
        insignia.textContent = categoria;

        const titulo = document.createElement('h5');
        titulo.className = 'card-title';
        titulo.textContent = nombre;

        const parrafoDescripcion = document.createElement('p');
        parrafoDescripcion.className = 'card-text flex-grow-1';
        parrafoDescripcion.textContent = descripcion;

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn btn-outline-danger btn-sm mt-2';
        botonEliminar.textContent = 'Eliminar';

        // Evento click para eliminar este producto del catálogo
        botonEliminar.addEventListener('click', function () {
            columna.remove();
            totalProductos--;
            actualizarTotal();
            mostrarMensaje('"' + nombre + '" fue eliminado del catálogo.', 'warning');
        });

        cuerpo.appendChild(insignia);
        cuerpo.appendChild(titulo);
        cuerpo.appendChild(parrafoDescripcion);
        cuerpo.appendChild(botonEliminar);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);

        return columna;
    }

    // ---------- Evento principal: registrar producto ----------
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Evita que la página se recargue

        const nombre = inputNombre.value;
        const descripcion = inputDescripcion.value;
        const categoria = selectCategoria.value;

        const camposVacios = validarFormulario(nombre, descripcion, categoria);

        if (camposVacios.length > 0) {
            mostrarMensaje(
                'Completa los siguientes campos antes de registrar: ' + camposVacios.join(', ') + '.',
                'danger'
            );
            return;
        }

        contadorId++;
        totalProductos++;

        const nuevaTarjeta = crearTarjetaProducto(nombre, descripcion, categoria, contadorId);
        listaProductos.appendChild(nuevaTarjeta);

        actualizarTotal();
        mostrarMensaje('Producto "' + nombre + '" registrado correctamente.', 'success');

        formulario.reset();
        limpiarValidacion();
        inputNombre.focus();
    });

    // ---------- Formulario de contacto: solo evitamos la recarga ----------
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function (evento) {
            evento.preventDefault();
            mostrarMensaje('Gracias por escribirnos, te contactaremos pronto.', 'success');
            formularioContacto.reset();
        });
    }

});