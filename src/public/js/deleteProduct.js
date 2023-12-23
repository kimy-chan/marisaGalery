function deleteProduct(idProduct,nameProduct){
    
    Swal.fire({
    title: '¿Borrar Producto?',
    text:nameProduct,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location = `/delete-product/${idProduct}`
      
    }
  }).catch((e)=>{
    console.log(e);
  })
    
  
  }