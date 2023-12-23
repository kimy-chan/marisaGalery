function deleteCategory(idCategory,nameCategory,idImagen){
    
    Swal.fire({
    title: '¿Borrar Categoria?',
    text:nameCategory,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      window.location = `/delete-category/${idCategory}/${idImagen}`
      
    }
  }).catch((e)=>{
    console.log(e);
  })
    
  
  }