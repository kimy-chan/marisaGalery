

function apiWhatsapp(producto, color, talla) {

    if (!talla) {
        const whatsapp = `https://api.whatsapp.com/send?phone=+591 72884186&text=Hola quiero cotizar este producto: ${producto}${color}`
        return window.location.href = whatsapp;
    }
    const whatsapp = `https://api.whatsapp.com/send?phone=+591 72884186&text=Hola quiero cotizar este producto: ${producto}${color} talla:${talla}`

    window.location.href = whatsapp;

}