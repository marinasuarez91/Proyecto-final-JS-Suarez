let carritoDeCompras = []

const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');

let stockProductos= [];

function recuperarStock() {
    let stock = JSON.parse(localStorage.getItem('stock'))
    if(stock){
        stock.forEach(el => stockProductos.push(el))
    }
}

$.getJSON('./js/stock.json', function (data) {
    console.log(data)
    localStorage.setItem('stock', JSON.stringify(data))
    recuperarStock()
    mostrarProductos(data)
    recuperar()
})

$('#categoria').on('change',function () {
    
    mostrarProductos(stockProductos)

    console.log($(this).val())
    if($(this).val() == 'all'){
        mostrarProductos(stockProductos)
    }else{

        let tipoFiltrado= stockProductos.filter(el => el.tipo == $(this).val())// filter devuelve nuevo array
            if($('#buscar').val() == ''){
                mostrarProductos(tipoFiltrado)
            }else{
                let colores = tipoFiltrado.filter(el => el.color == $('#buscar').val())
                mostrarProductos(colores)  
            }

    }  

})

$('#buscar').on('keyup',function () {
    if($(this).val()== ''){
        mostrarProductos(stockProductos)
    }else{
            let texto = $(this).val()
            console.log(texto)
            let buscar = stockProductos.filter(el => el.nombre.toLowerCase() == texto.toLowerCase())
            console.log(buscar)
        if(buscar.length != 0){
            console.log('paso');
            mostrarProductos(buscar)
        }else{
            let buscar2 = stockProductos.filter(el => el.tipo.toLowerCase() == texto.toLowerCase())
                if(buscar2.length !=0){
                    console.log(buscar2);
                    mostrarProductos(buscar2)  
                }else{
                    let buscar3 = stockProductos.filter(el => el.color.toLowerCase() == texto.toLowerCase())
                    mostrarProductos(buscar3)
                }
            
        }
    }
  })

function mostrarProductos(array){
   $('#contenedor-productos').empty()
    for (const producto of array) {
        $('#contenedor-productos').append(`<div class="producto">
                                            <div class="card">
                                            <div class="card-image">
                                                <img src=${producto.img} class="img-productos">
                                                <div class="nombre--carrito">
                                                <span class="card-title">${producto.nombre}</span>
                                                <a id="boton${producto.id}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add_shopping_cart</i></a>
                                                </div>
                                            </div>
                                            <div class="card-content">
                                                <p class="info--producto">Color: ${producto.color}</p>
                                                <p class="info--producto"> $${producto.precio}</p>
                                            </div>
                                        </div> 
                                    </div> `)

        $(`#boton${producto.id}`).click(()=>{
        agregarAlCarrito(producto.id)
        })
        }
    
}


function agregarAlCarrito(id) {
    let repetido = carritoDeCompras.find(prodR => prodR.id == id);
    if(repetido){
        repetido.cantidad = repetido.cantidad + 1;
        $(`#cantidad${repetido.id}`).html(`cantidad: ${repetido.cantidad}`) 
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(prod => prod.id == id);

        carritoDeCompras.push(productoAgregar);

        productoAgregar.cantidad = 1;
       
        actualizarCarrito()
        $('#carrito-contenedor').append(`<div class="productoEnCarrito">
                        <p>${productoAgregar.nombre}</p>
                        <p>Precio: ${productoAgregar.precio}</p>
                        <p id="cantidad${productoAgregar.id}">cantidad: ${productoAgregar.cantidad}</p>
                        <p>Color: ${productoAgregar.color}</p>
                        <button id="eliminar${productoAgregar.id}" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
                        </div>`) 
        
       
        $(`#eliminar${productoAgregar.id}`).click(function () {
            $(this).parent().remove()
            carritoDeCompras = carritoDeCompras.filter(prodE => prodE.id != productoAgregar.id)
            localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
            actualizarCarrito()

        }) 
    }
    localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
}

function recuperar() {
    let recuperado = JSON.parse(localStorage.getItem('carrito')) 
   if(recuperado){
       recuperado.forEach(el => {
           agregarAlCarrito(el.id)
       });
   }
}

function  actualizarCarrito (){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el)=> acc + el.cantidad, 0);
   precioTotal.innerText = carritoDeCompras.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)
}