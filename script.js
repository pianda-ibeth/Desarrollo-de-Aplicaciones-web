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