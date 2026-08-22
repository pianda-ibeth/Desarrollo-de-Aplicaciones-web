from flask import Flask, render_template

app = Flask(__name__)

# ---------------------------------------------------------
# Datos de ejemplo (demostrativos/estáticos).
# En una futura etapa del proyecto vendrían de una base de datos.
# ---------------------------------------------------------

productos_demo = [
    {"nombre": "HP Pavilion 15", "categoria": "Laptops",
     "precio": 549.99, "imagen": "laptop-hp-pavilion-15.webp"},
    {"nombre": "Samsung Galaxy A55", "categoria": "Smartphones",
     "precio": 389.00, "imagen": "samsung-galaxy.jpg"},
    {"nombre": "Mouse Redragon", "categoria": "Accesorios Gamer",
     "precio": 24.50, "imagen": "mouse-redragon.jpg"},
    {"nombre": "Audífonos HyperX", "categoria": "Accesorios Gamer",
     "precio": 45.00, "imagen": "audifonos-hyperx.jpg"},
]

clientes_demo = [
    {"nombre": "Ana Torres", "correo": "ana.torres@mail.com",
     "telefono": "0991234567", "ciudad": "Guayaquil"},
    {"nombre": "Luis Zambrano", "correo": "luis.zambrano@mail.com",
     "telefono": "0987654321", "ciudad": "Manta"},
    {"nombre": "Carla Rivas", "correo": "carla.rivas@mail.com",
     "telefono": "0996543210", "ciudad": "Portoviejo"},
]

proveedores_demo = [
    {"empresa": "TecnoImport S.A.", "contacto": "Jorge Salcedo",
     "producto_principal": "Laptops y componentes", "telefono": "042345678"},
    {"empresa": "GamerZone Distribuciones", "contacto": "María Loor",
     "producto_principal": "Accesorios gamer", "telefono": "042987654"},
    {"empresa": "MobileTech Ecuador", "contacto": "Pedro Chávez",
     "producto_principal": "Smartphones", "telefono": "042456123"},
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
# Rutas
# ---------------------------------------------------------

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/productos')
def productos():
    return render_template('productos.html', productos=productos_demo)


@app.route('/clientes')
def clientes():
    return render_template('clientes.html', clientes=clientes_demo)


@app.route('/proveedores')
def proveedores():
    return render_template('proveedores.html', proveedores=proveedores_demo)


@app.route('/facturacion')
def facturacion():
    return render_template('facturacion.html', facturas=facturas_demo)


if __name__ == '__main__':
    app.run(debug=True)