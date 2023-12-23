  document.addEventListener("DOMContentLoaded", function () {
    const inputImagenes = document.getElementById("imagenes");
    const imagenPreviews = document.getElementById("imagenPreviews");

    inputImagenes.addEventListener("change", (e) => {
      imagenPreviews.innerHTML = ''; // Limpiar las imágenes previas
      const archivos = e.target.files;

      for (let i = 0; i < archivos.length; i++) {
        const imagen = document.createElement("img");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 100; // Ancho máximo deseado

        const img = new Image();
        img.src = URL.createObjectURL(archivos[i]);

        img.onload = () => {
          // Calcula las nuevas dimensiones manteniendo la proporción
          let newWidth, newHeight;
          if (img.width > maxWidth) {
            newWidth = maxWidth;
            newHeight = (img.height * maxWidth) / img.width;
          } else {
            newWidth = img.width;
            newHeight = img.height;
          }

          // Configura el tamaño del canvas y dibuja la imagen redimensionada
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // Convierte el canvas a una imagen
          imagen.src = canvas.toDataURL("image/jpeg"); // Puedes elegir el formato de imagen que prefieras
          imagen.alt = "Imagen seleccionada";
          imagenPreviews.appendChild(imagen);
        };
      }
    });
  });