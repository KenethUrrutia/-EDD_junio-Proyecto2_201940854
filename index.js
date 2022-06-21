var isLogeado = false;
var isAdmin = false;
var usuarioLogeado = "";


//#region Nodos

class NodoCliente{
    constructor(cliente){
        this.id = 0
        this.cliente = cliente;
        this.siguiente = null;
    }
}

//#endregion



//#region Estructuras

class ListaClientes{
    constructor(){
        this.cabeza = null
    }

    add(cliente){
        var tempo = new NodoCliente(cliente);
        tempo.siguiente = this.cabeza;
        
        if (this.cabeza!=null) {
            tempo.id = (this.cabeza.id+1);
        }

        this.cabeza = tempo;
    }

    buscarCliente(nombre_usuario){
        var temporal = this.cabeza;
        while (temporal != null){
            if(temporal.cliente.nombre_usuario == nombre_usuario)
                return temporal.cliente
            temporal = temporal.siguiente;
        }
        return null
    }

    graficar(lienzo){
        var codigoDot = `digraph G {\n label = "Clientes"\n node [shape=box]; rankdir=RL; \n  \nnull [label="null"; shape= "none"];\n`;
        var etiquetas = `\n`;
        var conexiones = `\n`;

        var temporal = this.cabeza
        while (temporal != null) {
            
            etiquetas += `nodo`+temporal.id + `[label="`+ temporal.cliente.nombre_usuario +`"];\n`;
            if (temporal.siguiente != null) {
                conexiones += `nodo`+temporal.id +` -> nodo`+temporal.siguiente.id + `;\n`;
            } else{
                conexiones += `nodo`+temporal.id +` -> null;\n`;
            }
            
            temporal = temporal.siguiente;
            
        }

        codigoDot += etiquetas + conexiones +"\n}"
        console.log(codigoDot);
        d3.select("#"+lienzo)
        .graphviz()
          .height(300)
          .width(400)
          .dot(codigoDot)
          .render();

    }

}

//#endregion

//#region Cargas Masivas 

//#region peliculas 
var inputPeliculas = document.querySelector('#input-peliculas-json') 

inputPeliculas.addEventListener('change', (event) => {
    var fl = event.target.files;
    file = fl[0];
    prepararFilePeliculas(file)
  });

function readFilePeliculas(file) {
    let reader = new FileReader();
    reader.readAsText(file);
  
    reader.onload = function() {
      reader.result
      cargaMasivaPeliculas(reader.result)
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };
}

function prepararFilePeliculas(file) {
    
    const button = document.getElementById('cargaMasivaPeliculas')  
    button.addEventListener('click', () => {  
      readFilePeliculas(file);  
    })
    
}

function cargaMasivaPeliculas(texto) {
    obj=JSON.parse(texto)
    obj.forEach(element => {
        //estructuraPelis.add(element)
        
    });
    inputPeliculas.value = ``;
    
    alert("Peliculas Agregadas")
}

//#endregion

//#region clientes 
var inputClientes = document.querySelector('#input-clientes-json') 

inputClientes.addEventListener('change', (event) => {
    var fl = event.target.files;
    file = fl[0];
    prepararFileClientes(file)
  });

function readFileClientes(file) {
    let reader = new FileReader();
    reader.readAsText(file);
  
    reader.onload = function() {
      reader.result
      cargaMasivaClientes(reader.result)
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };
}

function prepararFileClientes(file) {
    
    const button = document.getElementById('cargaMasivaClientes')  
    button.addEventListener('click', () => {  
      readFileClientes(file);  
    })
    
}

function cargaMasivaClientes(texto) {
    obj=JSON.parse(texto)
    obj.forEach(element => {
        //estructuraClientes.add(element)
        
    });
    inputClientes.value = ``;
    
    alert("Clientes Agregadas")
}

//#endregion

//#region actores 
var inputActores = document.querySelector('#input-actores-json') 

inputActores.addEventListener('change', (event) => {
    var fl = event.target.files;
    file = fl[0];
    prepararFileActores(file)
  });

function readFileActores(file) {
    let reader = new FileReader();
    reader.readAsText(file);
  
    reader.onload = function() {
      reader.result
      cargaMasivaActores(reader.result)
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };
}

function prepararFileActores(file) {
    
    const button = document.getElementById('cargaMasivaActores')  
    button.addEventListener('click', () => {  
      readFileActores(file);  
    })
    
}

function cargaMasivaActores(texto) {
    obj=JSON.parse(texto)
    obj.forEach(element => {
        //estructuraActores.add(element)
        
    });
    inputClientes.value = ``;
    
    alert("Actores Agregadas")
}

//#endregion

//#region Categorias 
var inputCategorias = document.querySelector('#input-categorias-json') 

inputCategorias.addEventListener('change', (event) => {
    var fl = event.target.files;
    file = fl[0];
    prepararFileCategorias(file)
  });

function readFileCategorias(file) {
    let reader = new FileReader();
    reader.readAsText(file);
  
    reader.onload = function() {
      reader.result
      cargaMasivaCategorias(reader.result)
    };
  
    reader.onerror = function() {
      console.log(reader.error);
    };
}

function prepararFileCategorias(file) {
    
    const button = document.getElementById('cargaMasivaCategorias')  
    button.addEventListener('click', () => {  
      readFileCategorias(file);  
    })
    
}

function cargaMasivaCategorias(texto) {
    obj=JSON.parse(texto)
    obj.forEach(element => {
        //estructuraCategorias.add(element)
        
    });
    inputClientes.value = ``;
    
    alert("Categorias Agregadas")
}

//#endregion



//#endregion


//#region variables
var listaClientes = new ListaClientes();
listaClientes.add({
    "dpi":2354168452525, 
    "nombre_completo": "WIlfred Perez", 
    "nombre_usuario": "Wilfred",
    "correo":"",
    "contrasenia": "123",
    "telefono": "+502 (123) 123-4567"
});
listaClientes.graficar("lienzo-clientes")

//#endregion