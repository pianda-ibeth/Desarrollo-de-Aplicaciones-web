from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FloatField, IntegerField, SelectField, SubmitField
from wtforms.validators import DataRequired, Length, NumberRange, Optional


class ProductoForm(FlaskForm):
    nombre = StringField(
        'Nombre del producto',
        validators=[DataRequired(message='El nombre es obligatorio'), Length(min=3, max=100)]
    )
    descripcion = TextAreaField(
        'Descripción',
        validators=[DataRequired(message='La descripción es obligatoria'), Length(max=500)]
    )
    precio = FloatField(
        'Precio',
        validators=[DataRequired(message='El precio es obligatorio'), NumberRange(min=0.01, message='El precio debe ser mayor a 0')]
    )
    stock = IntegerField(
        'Stock disponible',
        validators=[DataRequired(message='El stock es obligatorio'), NumberRange(min=0, message='El stock no puede ser negativo')]
    )
    categoria = SelectField(
        'Categoría',
        choices=[
            ('laptops', 'Laptops'),
            ('celulares', 'Celulares'),
            ('accesorios', 'Accesorios'),
            ('componentes', 'Componentes')
        ],
        validators=[DataRequired(message='Seleccione una categoría')]
    )
    submit = SubmitField('Guardar producto')