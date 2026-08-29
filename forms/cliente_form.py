from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired, Length, Email, Regexp


class ClienteForm(FlaskForm):
    nombre = StringField(
        'Nombre',
        validators=[DataRequired(message='El nombre es obligatorio'), Length(min=2, max=50)]
    )
    apellido = StringField(
        'Apellido',
        validators=[DataRequired(message='El apellido es obligatorio'), Length(min=2, max=50)]
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
    submit = SubmitField('Guardar cliente')