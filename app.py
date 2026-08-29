from flask import Flask, render_template, redirect, url_for, flash, request
from flask import Flask, render_template, redirect, url_for, flash
from datetime import datetime, date

from forms.producto_form import ProductoForm
from forms.cliente_form import ClienteForm
from forms.proveedor_form import ProveedorForm
from forms.facturacion_form import FacturacionForm

app = Flask(__name__)
app.config['SECRET_KEY'] = 'clave-secreta-techstore-2026'  # necesaria para CSRF con Flask-WTF

# ---------------------------------------------------------
# Variables simples y diccionario de información general
# de la tienda (se envían a TODAS las plantillas mediante
# un context_processor, para que estén disponibles en
# base.html, navbar.html y footer.html sin repetir código).
# ---------------------------------------------------------

info_tienda = {
    "nombre": "TechStore Maly",
    "eslogan": "Innovación y tecnología al alcance de todos",
    "anio_fundacion": 2026,
    "ciudad": "Manabí, Ecuador"
}


@app.context_processor
def inject_datos_globales():
    return {
        "nombre_tienda": info_tienda["nombre"],
        "eslogan_tienda": info_tienda["eslogan"],
        "nombre_desarrollador": "Maly Pianda",
        "anio_actual": datetime.now().year
    }


# ---------------------------------------------------------
# Datos de ejemplo (demostrativos). Sirven ahora como
# almacenamiento temporal en memoria para los formularios.
# En una futura etapa vendrían de una base de datos.
# ---------------------------------------------------------

productos_demo = [
    {"nombre": "HP Pavilion 15", "categoria": "Laptops",
     "precio": 549.99, "stock": 8, "imagen": "laptop-hp-pavilion-15.webp"},
    {"nombre": "Samsung Galaxy A55", "categoria": "Smartphones",
     "precio": 389.00, "stock": 0, "imagen": "samsung-galaxy.jpg"},
    {"nombre": "Mouse Redragon", "categoria": "Accesorios Gamer",
     "precio": 24.50, "stock": 15, "imagen": "mouse-redragon.jpg"},
    {"nombre": "Audífonos HyperX", "categoria": "Accesorios Gamer",
     "precio": 45.00, "stock": 0, "imagen": "audifonos-hyperx.jpg"},
]

clientes_demo = [
    {"nombre": "Ana Torres", "correo": "ana.torres@mail.com",
     "telefono": "0991234567", "ciudad": "Guayaquil", "direccion": "Av. Principal 123"},
    {"nombre": "Luis Zambrano", "correo": "luis.zambrano@mail.com",
     "telefono": "0987654321", "ciudad": "Manta", "direccion": "Calle Bolívar 456"},
    {"nombre": "Carla Rivas", "correo": "carla.rivas@mail.com",
     "telefono": "0996543210", "ciudad": "Portoviejo", "direccion": "Av. 4 de Noviembre 789"},
]

proveedores_demo = [
    {"empresa": "TecnoImport S.A.", "contacto": "Jorge Salcedo",
     "producto_principal": "Laptops y componentes", "telefono": "042345678",
     "email": "contacto@tecnoimport.com"},
    {"empresa": "GamerZone Distribuciones", "contacto": "María Loor",
     "producto_principal": "Accesorios gamer", "telefono": "042987654",
     "email": "ventas@gamerzone.com"},
    {"empresa": "MobileTech Ecuador", "contacto": "Pedro Chávez",
     "producto_principal": "Smartphones", "telefono": "042456123",
     "email": "info@mobiletech.ec"},
]

facturas_demo = [
    {"numero": "FAC-0001", "cliente": "Ana Torres",
     "fecha": "2026-08-10", "total": 549.99, "estado": "Pagada"},
    {"numero": "FAC-0002", "cliente": "Luis Zambrano",
     "fecha": "2026-08-15", "total": 69.50, "estado": "Pendiente"},
    {"numero": "FAC-0003", "cliente": "Carla Rivas",
     "fecha": "2026-08-18", "total": 389.00, "estado": "Pagada"},
]

# ---------------------------------------------------------
# Rutas de listado (ya existentes, sin cambios)
# ---------------------------------------------------------

@app.route('/')
def index():
    return render_template('index.html', info_tienda=info_tienda)


@app.route('/productos')
def productos():
    total_productos = len(productos_demo)
    return render_template('productos.html', productos=productos_demo, total_productos=total_productos)


@app.route('/clientes')
def clientes():
    total_clientes = len(clientes_demo)
    return render_template('clientes.html', clientes=clientes_demo, total_clientes=total_clientes)


@app.route('/proveedores')
def proveedores():
    return render_template('proveedores.html', proveedores=proveedores_demo)


@app.route('/facturacion')
def facturacion():
    return render_template('facturacion.html', facturas=facturas_demo)


# ---------------------------------------------------------
# Rutas de formularios (Semana 11 - Flask-WTF)
# ---------------------------------------------------------

# --- Productos ---
@app.route('/productos/nuevo', methods=['GET', 'POST'])
def nuevo_producto():
    form = ProductoForm()
    if form.validate_on_submit():
        productos_demo.append({
            "nombre": form.nombre.data,
            "categoria": form.categoria.data,
            "precio": form.precio.data,
            "stock": form.stock.data,
            "imagen": "img.png"
        })
        flash('Producto guardado correctamente', 'success')
        return redirect(url_for('productos'))
    return render_template('formulario_producto.html', form=form, titulo='Nuevo producto')


@app.route('/productos/editar/<int:indice>', methods=['GET', 'POST'])
def editar_producto(indice):
    producto = productos_demo[indice]
    form = ProductoForm(data=producto)
    if form.validate_on_submit():
        productos_demo[indice].update({
            "nombre": form.nombre.data,
            "categoria": form.categoria.data,
            "precio": form.precio.data,
            "stock": form.stock.data,
        })
        flash('Producto actualizado correctamente', 'success')
        return redirect(url_for('productos'))
    return render_template('formulario_producto.html', form=form, titulo='Editar producto')


# --- Clientes ---
@app.route('/clientes/nuevo', methods=['GET', 'POST'])
def nuevo_cliente():
    form = ClienteForm()
    if form.validate_on_submit():
        clientes_demo.append({
            "nombre": f"{form.nombre.data} {form.apellido.data}",
            "correo": form.email.data,
            "telefono": form.telefono.data,
            "ciudad": "Sin especificar",
            "direccion": form.direccion.data
        })
        flash('Cliente guardado correctamente', 'success')
        return redirect(url_for('clientes'))
    return render_template('formulario_cliente.html', form=form, titulo='Nuevo cliente')


@app.route('/clientes/editar/<int:indice>', methods=['GET', 'POST'])
def editar_cliente(indice):
    cliente = clientes_demo[indice]
    if request.method == 'GET':
        nombre_completo = cliente["nombre"].split(" ", 1)
        form = ClienteForm(
            nombre=nombre_completo[0],
            apellido=nombre_completo[1] if len(nombre_completo) > 1 else "",
            email=cliente["correo"],
            telefono=cliente["telefono"],
            direccion=cliente["direccion"]
        )
    else:
        form = ClienteForm()

    if form.validate_on_submit():
        clientes_demo[indice].update({
            "nombre": f"{form.nombre.data} {form.apellido.data}",
            "correo": form.email.data,
            "telefono": form.telefono.data,
            "direccion": form.direccion.data
        })
        flash('Cliente actualizado correctamente', 'success')
        return redirect(url_for('clientes'))
    return render_template('formulario_cliente.html', form=form, titulo='Editar cliente')


# --- Proveedores ---
@app.route('/proveedores/nuevo', methods=['GET', 'POST'])
def nuevo_proveedor():
    form = ProveedorForm()
    if form.validate_on_submit():
        proveedores_demo.append({
            "empresa": form.nombre_empresa.data,
            "contacto": form.contacto.data,
            "producto_principal": "",
            "telefono": form.telefono.data,
            "email": form.email.data
        })
        flash('Proveedor guardado correctamente', 'success')
        return redirect(url_for('proveedores'))
    return render_template('formulario_proveedor.html', form=form, titulo='Nuevo proveedor')


@app.route('/proveedores/editar/<int:indice>', methods=['GET', 'POST'])
def editar_proveedor(indice):
    proveedor = proveedores_demo[indice]
    if request.method == 'GET':
        form = ProveedorForm(
            nombre_empresa=proveedor["empresa"],
            contacto=proveedor["contacto"],
            telefono=proveedor["telefono"],
            email=proveedor["email"]
        )
    else:
        form = ProveedorForm()

    if form.validate_on_submit():
        proveedores_demo[indice].update({
            "empresa": form.nombre_empresa.data,
            "contacto": form.contacto.data,
            "telefono": form.telefono.data,
            "email": form.email.data
        })
        flash('Proveedor actualizado correctamente', 'success')
        return redirect(url_for('proveedores'))
    return render_template('formulario_proveedor.html', form=form, titulo='Editar proveedor')

# --- Facturación ---
@app.route('/facturacion/nuevo', methods=['GET', 'POST'])
def nueva_factura():
    form = FacturacionForm()
    if form.validate_on_submit():
        numero = f"FAC-{len(facturas_demo) + 1:04d}"
        facturas_demo.append({
            "numero": numero,
            "cliente": form.cliente.data,
            "fecha": form.fecha.data.strftime('%Y-%m-%d'),
            "total": round(form.cantidad.data * form.precio_unitario.data, 2),
            "estado": "Pendiente"
        })
        flash('Factura registrada correctamente', 'success')
        return redirect(url_for('facturacion'))
    return render_template('formulario_facturacion.html', form=form, titulo='Nueva factura')


if __name__ == '__main__':
    app.run(debug=True)