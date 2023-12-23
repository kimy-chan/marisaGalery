function deletePedido(idProduct, namePedido) {

    Swal.fire({
        title: '¿Borrar Pedido?',
        text: namePedido,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = `/delete-pedido/${idProduct}`

        }
    }).catch((e) => {
        console.log(e);
    })


}