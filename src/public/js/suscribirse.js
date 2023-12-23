async function submitForm() {
    const nombres = document.getElementById("nombre").value;
    const email = document.getElementById("correo").value;
    const texto = document.getElementById("mensaje").value;
    const errorNombre = document.getElementById('error-names');
    const errorCorreo = document.getElementById('error-email');
    const errorMensaje = document.getElementById('error-texto')
    const success = document.getElementById('success');


    const data = {
        names: nombres,
        email: email,
        texto: texto  // Cambiado a 'texto' en lugar de 'Texto'
    };

    try {
        const response = await axios.post('/suscribirse', data);
        errorNombre.innerHTML = '';
        errorCorreo.innerHTML = '';
        errorMensaje.innerHTML = '';
        success.innerHTML = '';
        if (response) {
            success.innerHTML = `<p>suscrito</p>`;
        }
    } catch (error) {
        if (error.response.data.error) {
            error.response.data.error.forEach(data => {
                console.log(data.path);
                const errorElement = document.getElementById(`error-${data.path}`);
                if (errorElement) {
                    errorElement.innerHTML = data.msg;
                }

            })
        }
    }
}

