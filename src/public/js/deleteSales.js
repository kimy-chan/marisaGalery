function deleteSales(idPerson, nameVenta) {
    console.log(idPerson);
    Swal.fire({
        title: '¿Borrar Venta?',
        text: nameVenta,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = `/delete-sales/${idPerson}`

        }
    }).catch((e) => {
        console.log(e);
    })

}