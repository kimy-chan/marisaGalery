const CartModel = require("../model/model.cart")
class CartAux {

  static DeleteObjet(array, clave) { //elimina productos repetidos
    const objetosVistos = {};
    return array.filter(objeto => {
      const valorClave = objeto[clave];
      if (!objetosVistos[valorClave]) {
        objetosVistos[valorClave] = true;
        return true;
      }
      return false;
    });
  }

  static async searchProduct(product) {//busca

    let cart = []
    for (let productId of product) {//extrae el id de cada producto para la cunsula de la pase de datos
      const productDatabse = await CartModel.cardProduct({ productId })

      cart.push(...productDatabse)

    }
    console.log(cart);
    return cart
  }

  static totalPrice(cart) {
    console.log("total price");

    let total = 0


    for (let index = 0; index < cart.length; index++) {

      total += parseFloat(cart[index].price)
    }
    return total.toFixed(2);

  }

  static cantidadProduct(cart) {//suma la cantidad de cada producto
    let cantidad = {};
    cart.forEach(objeto => { // cantidad de cada producto
      const id = objeto.idProduct;
      cantidad[id] = (cantidad[id] || 0) + 1;
    })
    return cantidad
  }




  static async getProdcut(prod) {  // obtiene los prodcutos para el carrito
    const products = []
    let totalPrice = 0
    let productUnique
    try {
      const product = await this.searchProduct(prod)
      products.push(...product)
      const allPrice = this.totalPrice(products)
      productUnique = this.DeleteObjet(product, 'idProduct')
      totalPrice = allPrice
      const cant = this.cantidadProduct(products)

      products.forEach(item => {
        const idProduct = item.idProduct;
        item.cantidad = cant[idProduct] || 1; // Asignar cantidad o 1 si no existe en cantidad
      });

      const data = { productUnique, totalPrice }
      return data


    } catch (error) {
      console.log(error);

    }




  }

}




module.exports = CartAux