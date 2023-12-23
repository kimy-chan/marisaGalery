function deleteSuscriptor(idPerson, suscriptor) {
    console.log(idPerson);
    Swal.fire({
        title: '¿Borrar suscriptor?',
        text: suscriptor,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = `/delete-suscriptor/${idPerson}`

        }
    }).catch((e) => {
        console.log(e);
    })

}