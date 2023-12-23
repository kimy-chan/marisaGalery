function deleteUser(idPerson, user) {
    console.log(idPerson);
    Swal.fire({
        title: '¿Borrar Usuario?',
        text: user,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = `/register-delete/${idPerson}`

        }
    }).catch((e) => {
        console.log(e);
    })

}