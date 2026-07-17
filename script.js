document.addEventListener('DOMContentLoaded', function () {

    // ---------- Referencias a elementos del DOM ----------
    const formulario      = document.getElementById('formularioProducto');
    const inputNombre     = document.getElementById('nombreProducto');
    const inputDescripcion = document.getElementById('descripcionProducto');
    const selectCategoria = document.getElementById('categoriaProducto');
    const divMensaje      = document.getElementById('mensaje');
    const spanTotal       = document.getElementById('totalProductos');
    const listaProductos  = document.getElementById('listaProductos');
    const catalogoProductosDiv = document.getElementById('catalogoProductos');

    // Botón de registrar + spinner de Bootstrap
    const btnRegistrar      = document.getElementById('btnRegistrar');
    const spinnerRegistrar  = document.getElementById('spinnerRegistrar');
    const textoBtnRegistrar = document.getElementById('textoBtnRegistrar');

    // Formulario de contacto (independiente, solo evitamos que recargue la página)
    const formularioContacto = document.getElementById('formularioContacto');

    // ---------- Modales de Bootstrap ----------
    const elModalDetalle   = document.getElementById('modalDetalleProducto');
    const modalDetalle     = new bootstrap.Modal(elModalDetalle);
    const modalDetalleBadge = document.getElementById('modalDetalleBadge');
    const modalDetalleNombre = document.getElementById('modalDetalleNombre');
    const modalDetalleDescripcion = document.getElementById('modalDetalleDescripcion');

    const elModalConfirmar = document.getElementById('modalConfirmarEliminar');
    const modalConfirmar   = new bootstrap.Modal(elModalConfirmar);
    const modalConfirmarNombre = document.getElementById('modalConfirmarNombre');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

    // Guarda temporalmente los datos del producto que se quiere eliminar,
    // mientras el usuario confirma o cancela en el modal.
    let productoPendienteEliminar = null;

    // ---------- Estado ----------
    let totalProductos = 0;
    let contadorId = 0;

    // Color de la insignia (badge) según la categoría elegida
    const colorPorCategoria = {
        'Laptops': 'bg-primary',
        'Smartphones': 'bg-info text-dark',
        'Accesorios': 'bg-warning text-dark'
    };

    // Reglas mínimas de validación
    const REGLAS = {
        nombreMinLength: 3,
        descripcionMinLength: 15
    };

    // Palabras/marcas relacionadas a productos tecnológicos.
    // El nombre del producto debe contener al menos una de estas palabras
    // (o similar) para considerarse válido.
    const PALABRAS_TECH = [
        // Categorías generales
        'laptop', 'notebook', 'portatil', 'portátil', 'pc', 'computador', 'computadora',
        'smartphone', 'celular', 'telefono', 'teléfono', 'tablet', 'smartwatch', 'reloj',
        'mouse', 'raton', 'ratón', 'teclado', 'monitor', 'pantalla', 'audifono', 'audífono',
        'auricular', 'parlante', 'bocina', 'camara', 'cámara', 'webcam', 'microfono', 'micrófono',
        'router', 'cargador', 'cable', 'adaptador', 'bateria', 'batería', 'power bank', 'powerbank',
        'consola', 'joystick', 'control', 'impresora', 'proyector', 'disco', 'ssd', 'hdd',
        'memoria', 'ram', 'procesador', 'tarjeta', 'grafica', 'gráfica', 'gpu', 'cpu',
        'mousepad', 'pad', 'gamer', 'rgb', 'inalambrico', 'inalámbrico', 'bluetooth', 'usb',
        'hub', 'audio', 'video', 'accesorio', 'funda', 'case', 'soporte', 'base',
        // Marcas comunes
        'hp', 'lenovo', 'dell', 'asus', 'acer', 'msi', 'apple', 'iphone', 'ipad', 'macbook',
        'samsung', 'xiaomi', 'redmi', 'motorola', 'huawei', 'honor', 'oppo',
        'intel', 'amd', 'ryzen', 'kingston', 'logitech', 'redragon', 'hyperx', 'razer',
        'corsair', 'steelseries', 'jbl', 'sony', 'lg', 'nvidia', 'geforce', 'xbox', 'playstation', 'nintendo'
    ];

    // ---------- Datos del proyecto (arreglo de objetos) ----------
    // Esta es la "fuente de datos" del catálogo. En una futura integración
    // con Flask, esta información vendría de una base de datos y llegaría
    // a la plantilla ya renderizada con Jinja2 (por ejemplo con
    // {% for categoria in catalogo %} ... {% endfor %}).
    // Cada producto ahora es un objeto { nombre, imagen } en vez de un simple
    // texto. Las imágenes están guardadas en la carpeta "RECURSOS/" del
    // proyecto (fotos reales de cada producto). Componentes PC no tiene
    // imágenes porque su categoría está marcada como no disponible.
    const catalogoProductos = [
        {
            categoria: 'Laptops',
            disponible: true,
            items: [
                { nombre: 'HP Pavilion 15', imagen: 'RECURSOS/laptop-hp-pavilion-15.webp' },
                { nombre: 'Lenovo IdeaPad 3', imagen: 'RECURSOS/lenovo-ideapad.jpg' },
                { nombre: 'Dell Inspiron 15', imagen: 'RECURSOS/dell-inspiron.jpg' },
                { nombre: 'ASUS VivoBook', imagen: 'RECURSOS/asus-vivobook.webp' }
            ]
        },
        {
            categoria: 'Smartphones',
            disponible: true,
            items: [
                { nombre: 'Samsung Galaxy A55', imagen: 'RECURSOS/samsung-galaxy.jpg' },
                { nombre: 'iPhone 15', imagen: 'RECURSOS/iphone-15.jpg' },
                { nombre: 'Xiaomi Redmi Note 13', imagen: 'RECURSOS/redmi-note.jpg' },
                { nombre: 'Motorola Edge 50', imagen: 'RECURSOS/motorola-edge.webp' }
            ]
        },
        {
            categoria: 'Accesorios Gamer',
            disponible: true,
            items: [
                { nombre: 'Mouse Redragon', imagen: 'RECURSOS/mouse-redragon.jpg' },
                { nombre: 'Teclado Mecánico', imagen: 'RECURSOS/teclado-mecanico.png' },
                { nombre: 'Audífonos HyperX', imagen: 'RECURSOS/audifonos-hyperx.jpg' },
                { nombre: 'Mouse Pad RGB', imagen: 'RECURSOS/mousepad.png' }
            ]
        },
        {
            categoria: 'Componentes PC',
            disponible: false,
            items: [
                { nombre: 'Intel Core i5', imagen: '' },
                { nombre: 'AMD Ryzen 7', imagen: '' },
                { nombre: 'RAM Kingston 16GB', imagen: '' },
                { nombre: 'SSD Kingston 1TB', imagen: '' }
            ]
        }
    ];

    // Detecta texto que "parece" escrito al azar (ej. hdsjjd, asdkjh)
    // revisando que no haya demasiadas consonantes seguidas y que exista
    // al menos una vocal.
    function pareceTextoAlAzar(valor) {
        const sinEspacios = valor.trim();
        if (sinEspacios === '') return true;

        const tieneVocal = /[aeiouáéíóú]/i.test(sinEspacios);
        if (!tieneVocal) return true;

        // 4 o más consonantes seguidas suele indicar texto sin sentido
        const consonantesSeguidas = /[bcdfghjklmnpqrstvwxyzñ]{4,}/i;
        if (consonantesSeguidas.test(sinEspacios)) return true;

        return false;
    }

    // Revisa si el nombre contiene alguna palabra/marca tecnológica conocida
    function esNombreTecnologico(valor) {
        const valorNormalizado = valor.toLowerCase();
        return PALABRAS_TECH.some(function (palabra) {
            return valorNormalizado.includes(palabra);
        });
    }

    // Contenedores de error de cada campo (deben existir en el HTML)
    const errorNombre = document.getElementById('errorNombre');
    const errorDescripcion = document.getElementById('errorDescripcion');
    const errorCategoria = document.getElementById('errorCategoria');

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

        // El mensaje general desaparece solo después de unos segundos
        setTimeout(function () {
            if (alerta.parentNode) {
                alerta.classList.remove('show');
                alerta.remove();
            }
        }, 3500);
    }

    // Aplica el resultado { valido, mensaje } de una validación a un campo:
    // agrega/quita is-valid / is-invalid y escribe el mensaje de error.
    function aplicarResultado(campo, resultado, cajaError) {
        if (resultado.valido) {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
            if (cajaError) cajaError.textContent = '';
        } else {
            campo.classList.remove('is-valid');
            campo.classList.add('is-invalid');
            if (cajaError) cajaError.textContent = resultado.mensaje;
        }
        return resultado.valido;
    }

    // ---------- Validaciones por campo ----------

    function validarNombre() {
        const valor = inputNombre.value.trim();

        if (valor === '') {
            return { valido: false, mensaje: 'El nombre del producto es obligatorio.' };
        }
        if (valor.length < REGLAS.nombreMinLength) {
            return {
                valido: false,
                mensaje: 'El nombre debe tener al menos ' + REGLAS.nombreMinLength + ' caracteres.'
            };
        }
        if (pareceTextoAlAzar(valor)) {
            return {
                valido: false,
                mensaje: 'Ese nombre no parece válido. Escribe el nombre real de un producto.'
            };
        }
        if (!esNombreTecnologico(valor)) {
            return {
                valido: false,
                mensaje: 'El nombre debe corresponder a un producto tecnológico (ej. Laptop, Mouse, Smartphone, Teclado, HP, Samsung, etc.).'
            };
        }
        return { valido: true, mensaje: '' };
    }

    function validarDescripcion() {
        const valor = inputDescripcion.value.trim();

        if (valor === '') {
            return { valido: false, mensaje: 'La descripción es obligatoria.' };
        }
        if (valor.length < REGLAS.descripcionMinLength) {
            return {
                valido: false,
                mensaje: 'Agrega más detalle (mínimo ' + REGLAS.descripcionMinLength + ' caracteres).'
            };
        }
        if (pareceTextoAlAzar(valor)) {
            return {
                valido: false,
                mensaje: 'La descripción no parece válida. Escribe las características reales del producto.'
            };
        }
        return { valido: true, mensaje: '' };
    }

    function validarCategoria() {
        if (selectCategoria.value === '') {
            return { valido: false, mensaje: 'Selecciona una categoría.' };
        }
        return { valido: true, mensaje: '' };
    }

    // Ejecuta la validación de un campo puntual y refleja el resultado en pantalla
    function validarCampo(nombreCampo) {
        switch (nombreCampo) {
            case 'nombre':
                return aplicarResultado(inputNombre, validarNombre(), errorNombre);
            case 'descripcion':
                return aplicarResultado(inputDescripcion, validarDescripcion(), errorDescripcion);
            case 'categoria':
                return aplicarResultado(selectCategoria, validarCategoria(), errorCategoria);
            default:
                return true;
        }
    }

    // Valida todo el formulario (se usa en el submit) y devuelve si es válido
    function validarFormularioCompleto() {
        const nombreValido = validarCampo('nombre');
        const descripcionValida = validarCampo('descripcion');
        const categoriaValida = validarCampo('categoria');

        return nombreValido && descripcionValida && categoriaValida;
    }

    // Quita las marcas visuales de validación de un grupo de campos
    function limpiarValidacion() {
        [inputNombre, inputDescripcion, selectCategoria].forEach(function (campo) {
            campo.classList.remove('is-valid', 'is-invalid');
        });
        errorNombre.textContent = '';
        errorDescripcion.textContent = '';
        errorCategoria.textContent = '';
    }

    // Actualiza el contador de productos en pantalla
    function actualizarTotal() {
        spanTotal.textContent = totalProductos;
    }

    // ---------- Render del catálogo (sección "Productos") ----------
    // Recorre el arreglo "catalogoProductos" (estructura repetitiva con
    // forEach) y por cada categoría arma una tarjeta con su lista de
    // artículos. Además aplica una condición: si "disponible" es false,
    // en vez de la lista se muestra un mensaje de "próximamente".
    function crearTarjetaCategoria(categoriaObj) {

        const columna = document.createElement('div');
        columna.className = 'col-md-3';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card m-2 h-100';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card-body';

        const titulo = document.createElement('h5');
        titulo.textContent = categoriaObj.categoria;
        cuerpo.appendChild(titulo);

        // Condición según el estado de los datos: disponible / no disponible
        if (categoriaObj.disponible) {
            const listaItems = document.createElement('div');
            listaItems.className = 'lista-productos-categoria';

            // Estructura repetitiva: una mini tarjeta con imagen por cada
            // producto de la categoría
            categoriaObj.items.forEach(function (articulo) {

                const itemProducto = document.createElement('div');
                itemProducto.className = 'producto-item';

                const imagenProducto = document.createElement('img');
                imagenProducto.src = articulo.imagen;
                imagenProducto.alt = articulo.nombre;
                imagenProducto.className = 'producto-item-img';
                imagenProducto.loading = 'lazy';

                const nombreProducto = document.createElement('p');
                nombreProducto.className = 'producto-item-nombre';
                nombreProducto.textContent = articulo.nombre;

                itemProducto.appendChild(imagenProducto);
                itemProducto.appendChild(nombreProducto);
                listaItems.appendChild(itemProducto);
            });

            cuerpo.appendChild(listaItems);
        } else {
            const aviso = document.createElement('p');
            aviso.className = 'text-muted fst-italic mb-0';
            aviso.textContent = 'Próximamente disponible en la tienda.';
            cuerpo.appendChild(aviso);
        }

        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);

        return columna;
    }

    function renderizarCatalogo() {
        catalogoProductosDiv.innerHTML = '';

        // Estructura repetitiva sobre el arreglo de objetos del catálogo
        catalogoProductos.forEach(function (categoriaObj) {
            const tarjeta = crearTarjetaCategoria(categoriaObj);
            catalogoProductosDiv.appendChild(tarjeta);
        });
    }

    // Crea la tarjeta (card) de un producto nuevo usando createElement/appendChild.
    // Incluye botones "Ver detalle" (abre modal de detalle) y "Eliminar"
    // (abre modal de confirmación antes de borrar).
    function crearTarjetaProducto(nombre, descripcion, categoria, id) {

        const columna = document.createElement('div');
        columna.className = 'col-md-4 mb-3';
        columna.id = 'producto-' + id;

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card h-100 shadow-sm';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card-body d-flex flex-column';

        const claseColor = colorPorCategoria[categoria] || 'bg-secondary';

        const insignia = document.createElement('span');
        insignia.className = 'badge ' + claseColor + ' mb-2 align-self-start';
        insignia.textContent = categoria;

        const titulo = document.createElement('h5');
        titulo.className = 'card-title';
        titulo.textContent = nombre;

        const parrafoDescripcion = document.createElement('p');
        parrafoDescripcion.className = 'card-text flex-grow-1';
        parrafoDescripcion.textContent = descripcion;

        // Contenedor de botones de acción
        const grupoBotones = document.createElement('div');
        grupoBotones.className = 'd-flex gap-2 mt-2';

        const botonDetalle = document.createElement('button');
        botonDetalle.type = 'button';
        botonDetalle.className = 'btn btn-outline-primary btn-sm';
        botonDetalle.textContent = 'Ver detalle';

        // Evento click: abre el modal de detalle con la info del producto
        botonDetalle.addEventListener('click', function () {
            modalDetalleBadge.className = 'badge ' + claseColor + ' mb-2';
            modalDetalleBadge.textContent = categoria;
            modalDetalleNombre.textContent = nombre;
            modalDetalleDescripcion.textContent = descripcion;
            modalDetalle.show();
        });

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn btn-outline-danger btn-sm';
        botonEliminar.textContent = 'Eliminar';

        // Evento click: en vez de eliminar directo, abre el modal de
        // confirmación. El borrado real ocurre al confirmar (ver más abajo).
        botonEliminar.addEventListener('click', function () {
            productoPendienteEliminar = { columna: columna, nombre: nombre };
            modalConfirmarNombre.textContent = nombre;
            modalConfirmar.show();
        });

        grupoBotones.appendChild(botonDetalle);
        grupoBotones.appendChild(botonEliminar);

        cuerpo.appendChild(insignia);
        cuerpo.appendChild(titulo);
        cuerpo.appendChild(parrafoDescripcion);
        cuerpo.appendChild(grupoBotones);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);

        return columna;
    }

    // Ejecuta el borrado real del producto pendiente (llamado desde el
    // botón "Sí, eliminar" del modal de confirmación).
    btnConfirmarEliminar.addEventListener('click', function () {
        if (!productoPendienteEliminar) return;

        productoPendienteEliminar.columna.remove();
        totalProductos--;
        actualizarTotal();
        renderizarEstadoListaProductos();
        mostrarMensaje('"' + productoPendienteEliminar.nombre + '" fue eliminado del catálogo.', 'warning');

        productoPendienteEliminar = null;
        modalConfirmar.hide();
    });

    // Condición según el estado de los datos: si no hay productos
    // registrados todavía, se muestra un mensaje informativo en vez
    // de dejar la sección vacía.
    function renderizarEstadoListaProductos() {
        const mensajeVacio = document.getElementById('listaProductosVacia');

        if (totalProductos === 0) {
            if (!mensajeVacio) {
                const aviso = document.createElement('p');
                aviso.id = 'listaProductosVacia';
                aviso.className = 'text-muted col-12';
                aviso.textContent = 'Aún no hay productos registrados. Usa el formulario para agregar el primero.';
                listaProductos.appendChild(aviso);
            }
        } else if (mensajeVacio) {
            mensajeVacio.remove();
        }
    }

    // ---------- Validación en tiempo real ----------
    // Mientras el usuario escribe (input), se valida al instante
    inputNombre.addEventListener('input', function () {
        validarCampo('nombre');
    });
    inputDescripcion.addEventListener('input', function () {
        validarCampo('descripcion');
    });

    // Al perder el foco (blur) también se valida, útil para el select
    inputNombre.addEventListener('blur', function () {
        validarCampo('nombre');
    });
    inputDescripcion.addEventListener('blur', function () {
        validarCampo('descripcion');
    });
    selectCategoria.addEventListener('blur', function () {
        validarCampo('categoria');
    });
    selectCategoria.addEventListener('change', function () {
        validarCampo('categoria');
    });

    // ---------- Evento principal: registrar producto ----------
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault(); // Evita que la página se recargue

        const formularioValido = validarFormularioCompleto();

        if (!formularioValido) {
            mostrarMensaje('Revisa los campos marcados en rojo antes de continuar.', 'danger');
            return;
        }

        const nombre = inputNombre.value.trim();
        const descripcion = inputDescripcion.value.trim();
        const categoria = selectCategoria.value;

        // Activa el spinner de Bootstrap y bloquea el botón mientras se
        // "procesa" el registro (simulación de una operación asíncrona,
        // por ejemplo una futura llamada a la API de Flask).
        btnRegistrar.disabled = true;
        spinnerRegistrar.classList.remove('d-none');
        textoBtnRegistrar.textContent = 'Registrando...';

        setTimeout(function () {

            contadorId++;
            totalProductos++;

            renderizarEstadoListaProductos(); // quita el mensaje de "vacío" si existía

            const nuevaTarjeta = crearTarjetaProducto(nombre, descripcion, categoria, contadorId);
            listaProductos.appendChild(nuevaTarjeta);

            actualizarTotal();
            mostrarMensaje('Producto "' + nombre + '" registrado correctamente.', 'success');

            formulario.reset();
            limpiarValidacion();
            inputNombre.focus();

            // Restaura el botón a su estado normal
            btnRegistrar.disabled = false;
            spinnerRegistrar.classList.add('d-none');
            textoBtnRegistrar.textContent = 'Registrar';

        }, 900);
    });

    // ---------- Formulario de contacto: solo evitamos la recarga ----------
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function (evento) {
            evento.preventDefault();
            mostrarMensaje('Gracias por escribirnos, te contactaremos pronto.', 'success');
            formularioContacto.reset();
        });
    }

    // ---------- Inicialización ----------
    renderizarCatalogo();
    renderizarEstadoListaProductos();

});