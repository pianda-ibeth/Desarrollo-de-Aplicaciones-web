from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField, DateField, SubmitField
from wtforms.validators import DataRequired, NumberRange
from datetime import date


class FacturacionForm(FlaskForm):
    cliente = StringField(
        'Cliente',
        validators=[DataRequired(message='Debe indicar el cliente')]
    )
    producto = StringField(
        'Producto',
        validators=[DataRequired(message='Debe indicar el producto')]
    )
    cantidad = IntegerField(
        'Cantidad',
        validators=[DataRequired(message='La cantidad es obligatoria'), NumberRange(min=1, message='La cantidad debe ser al menos 1')]
    )
    precio_unitario = FloatField(
        'Precio unitario',
        validators=[DataRequired(message='El precio unitario es obligatorio'), NumberRange(min=0.01, message='El precio debe ser mayor a 0')]
    )
    fecha = DateField(
        'Fecha de facturación',
        default=date.today,
        validators=[DataRequired(message='La fecha es obligatoria')]
    )
    submit = SubmitField('Registrar factura')