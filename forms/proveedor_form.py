from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length, Email, Regexp


class ProveedorForm(FlaskForm):
    nombre_empresa = StringField(
        'Nombre de la empresa',
        validators=[DataRequired(message='El nombre de la empresa es obligatorio'), Length(min=3, max=100)]
    )
    contacto = StringField(
        'Persona de contacto',
        validators=[DataRequired(message='El contacto es obligatorio'), Length(min=3, max=80)]
    )
    email = StringField(
        'Correo electrónico',
        validators=[DataRequired(message='El correo es obligatorio'), Email(message='Ingrese un correo válido')]
    )
    telefono = StringField(
        'Teléfono',
        validators=[
            DataRequired(message='El teléfono es obligatorio'),
            Regexp(r'^\d{7,10}$', message='Ingrese un teléfono válido (solo números, 7 a 10 dígitos)')
        ]
    )
    direccion = StringField(
        'Dirección',
        validators=[DataRequired(message='La dirección es obligatoria'), Length(max=150)]
    )
    submit = SubmitField('Guardar proveedor')