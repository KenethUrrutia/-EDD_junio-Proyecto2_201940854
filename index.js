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

class NodoActor{
  constructor(actor){
      this.izquierda = null;
      this.derecha = null;
      this.actor = actor;
      this.id = 0;
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

    verificarUserYPass(){
      var user = document.getElementById("txt-nombre_usuario").value;
      var pass = document.getElementById("txt-contrasenia").value;
      var temporal = this.cabeza;
      var resultado = false;
      
      while(temporal!=null){  
          
          if (temporal.cliente.nombre_usuario == user) {
              if (temporal.cliente.contrasenia == pass) {
                  resultado = true;
              }
          }
          temporal = temporal.siguiente;
      }
      if (resultado) {
          alert("Login Exitoso ")
          logear(user);
      } else {
          alert("Login Error")
      }
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

class ArbolActores{
  constructor(){
      this.raiz = null;
      this.conexiones = ""
      this.etiquetas = ""
      this.contador = 0;
      this.textoHTML = ""
      this.busquedaActor = null
  }

  add(actor){
      var nuevoNodo = new NodoActor(actor);
      var temporal = this.raiz
      var agregado = false;
      if ( temporal != null) {
          while (!agregado) {
              
              if (actor.nombre_actor < temporal.actor.nombre_actor) {
                  if(temporal.izquierda == null){
                      temporal.izquierda = nuevoNodo;
                      nuevoNodo.id = this.contador
                      this.contador++;
                      agregado = true;
                      return;
                  }
                  temporal = temporal.izquierda;
                  
              } else {
                  if(temporal.derecha == null){
                      temporal.derecha = nuevoNodo;
                      nuevoNodo.id = this.contador
                      this.contador++;
                      agregado = true;
                      return;
                  }
                  temporal = temporal.derecha;
              }

          }
          
      }else{
          nuevoNodo.id = this.contador;
          this.contador++;
          this.raiz = nuevoNodo;

          return;
      }

  }

  _graficar(nodo){
      
      if(nodo.izquierda!=null){
          this._graficar(nodo.izquierda)
          this.conexiones += `n`+nodo.id+` -> n`+nodo.izquierda.id+ `;\n`;
      }else{
          this.etiquetas += `null`+nodo.id+`I [label="null"; shape="none"]\n`;
          this.conexiones += `n`+nodo.id+` -> null`+nodo.id+ `I;\n`;
      }

      this.etiquetas += `n`+nodo.id+` [label="`+nodo.actor.nombre_actor+`"]\n`;

      if (nodo.derecha!=null) {
          this._graficar(nodo.derecha);
          this.conexiones += `n`+nodo.id+` -> n`+nodo.derecha.id+ `;\n`;
      }else{
          this.etiquetas += `null`+nodo.id+`D [label="null"; shape="none"]\n`;
          this.conexiones += `n`+nodo.id+` -> null`+nodo.id+ `D;\n`;  
      }
  }

  graficar(lienzo){
      this.etiquetas = "";
      this.conexiones = ""
      this._graficar(this.raiz);

      var codigoDot = `digraph G {\n`+this.etiquetas + this.conexiones + `}`

      codigoDot += this.etiquetas + this.conexiones +"}"

      d3.select("#"+lienzo)
      .graphviz()
        .height(400)
        .width(1000)
        .dot(codigoDot)
        .render();

  }
  
  _tablaPreOrden(nodo){
    this.textoHTML += `<TR> <td> <b>Nombre actor: </b>` +nodo.actor.nombre_actor+`<br><br>`+
                    `<b>Correo: </b>`+nodo.actor.correo+`<br><br>`+
                    `<b>Descripcion: </b><br>`+nodo.actor.descripcion+`</TD>  </TR>`;

    if(nodo.izquierda!=null){
        this._tablaPreOrden(nodo.izquierda)
    }

    
    if (nodo.derecha!=null) {
        this._tablaPreOrden(nodo.derecha);
    }
  }
  
  _tablaInOrden(nodo){
      
      if(nodo.izquierda!=null){
          this._tablaInOrden(nodo.izquierda)
      }

      this.textoHTML += `<TR> <td> <b>Nombre actor: </b>` +nodo.actor.nombre_actor+`<br><br>`+
                              `<b>Correo: </b>`+nodo.actor.correo+`<br><br>`+
                              `<b>Descripcion: </b><br>`+nodo.actor.descripcion+`</TD>  </TR>`;

      if (nodo.derecha!=null) {
          this._tablaInOrden(nodo.derecha);
      }
  }

  _tablaPosOrden(nodo){
      
    if(nodo.izquierda!=null){
        this._tablaPosOrden(nodo.izquierda)
    }

    
    if (nodo.derecha!=null) {
        this._tablaPosOrden(nodo.derecha);
    }

    this.textoHTML += `<TR> <td> <b>Nombre actor: </b>` +nodo.actor.nombre_actor+`<br><br>`+
                            `<b>Correo: </b>`+nodo.actor.correo+`<br><br>`+
                            `<b>Descripcion: </b><br>`+nodo.actor.descripcion+`</TD>  </TR>`;

  }

  buscarInOrden(nodo, nombre_actor){
      if(nodo.izquierda!=null){
          
          this.buscarInOrden(nodo.izquierda, nombre_actor)

          
      }
      if (nombre_actor == nodo.actor.nombre_actor) {
          this.busquedaActor = nodo.actor;
      }
      if (nodo.derecha!=null) {
          
          this.buscarInOrden(nodo.derecha, nombre_actor);

          
      }
      
  }

  buscarActor(nombre_actor){
      this.busquedaActor = null
      this.buscarInOrden(this.raiz, nombre_actor);

      return this.busquedaActor;

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
        arbolActores.add(element)
        
    });
    inputActores.value = ``;
    
    alert("Actores Agregados")
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





//#region redirecciones
function goHome() {
  
  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });


  var div = document.getElementById('div-home')
  div.style.display = "block";

}

function goAdmin() {
  
  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });

  /*var lienzos = document.querySelectorAll('.lienzo');
  
  lienzos.forEach(element => {
      element.style.display = "none";
  });
*/
  var div = document.getElementById('div-admin')
  div.style.display = "block";

}

function goUser() {
  
  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });

  /*var lienzos = document.querySelectorAll('.lienzo');
  
  lienzos.forEach(element => {
      element.style.display = "none";
  });
*/
  var div = document.getElementById('div-user')
  div.style.display = "block";

}

function goActores() {
  
  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });

  document.getElementById("check-in").checked = false;
  document.getElementById("check-pos").checked = false;
  document.getElementById("check-pre").checked = false;


  var div = document.getElementById('div-actores')
  div.style.display = "block";

}

function logout() {
  isLogeado = false
  isAdmin = false;
  usuarioLogeado =""
  mostrarLogin();

  
  document.getElementById("btn-logout").style.display = "none";
  alert("Logout Exitoso")

}

function logear(nombre_usuario) {
  isLogeado = true;
  usuarioLogeado = nombre_usuario;

  var checkBox = document.getElementById("check-admin");

  if (checkBox.checked == true) {
      isAdmin = true
      //vistaAdmin();
  }else{ 
      isAdmin = false
      //vistaUser();
  }

  var btn = document.getElementById("btn-logout")
  btn.innerHTML  = `<i class="bi bi-box-arrow-left"></i> `+nombre_usuario;
  btn.style.display = "block";
  ocultarLogin();

}

function mostrarLogin() {
  var divLogin = document.querySelector('#div-login');
  divLogin.style.display = "block";

}

function ocultarLogin() {
  var divLogin = document.querySelector('#div-login');
  divLogin.style.display = "none";

}

//#endregion


//#region Llamadas Botones

function llamarVerificarLogin() {
  listaClientes.verificarUserYPass();
}


function llamarTablaActores() {
  
}

//#endregion


//#region Botones


document.getElementById("btn-user").onclick = goUser;
document.getElementById("btn-admin").onclick = goAdmin;
document.getElementById("btn-home").onclick = goHome;
document.getElementById("btn-actores").onclick = goActores;
document.getElementById("btn-logear").onclick = llamarVerificarLogin;
document.getElementById("btn-logout").onclick = logout;

document.getElementById("mostrar-grafo-actores").addEventListener('click', (event) => {

  var btns = document.querySelectorAll(".btn-grafo")
  btns.forEach(element => {
    element.classList.remove("btn-X-active")
  });
  event.target.classList.add("btn-X-active")
  arbolActores.graficar("lienzo")

});

document.getElementById("mostrar-grafo-clientes").addEventListener('click', (event) => {

  var btns = document.querySelectorAll(".btn-grafo")
  btns.forEach(element => {
    element.classList.remove("btn-X-active")
  });
  event.target.classList.add("btn-X-active")
  listaClientes.graficar("lienzo")

});

document.getElementById("mostrar-grafo-peliculas").addEventListener('click', (event) => {

  var btns = document.querySelectorAll(".btn-grafo")
  btns.forEach(element => {
    element.classList.remove("btn-X-active")
  });
  event.target.classList.add("btn-X-active")

});

document.getElementById("mostrar-grafo-categorias").addEventListener('click', (event) => {

  var btns = document.querySelectorAll(".btn-grafo")
  btns.forEach(element => {
    element.classList.remove("btn-X-active")
  });
  event.target.classList.add("btn-X-active")

});



document.getElementById("check-pre").addEventListener('click', (event) => {
   
      event.target.checked = true;
      document.getElementById("check-in").checked = false;
      document.getElementById("check-pos").checked = false;

      var element = document.getElementById("tabla-actores");
      var textoHTML = `<TABLE class="tabla-tabla" >`;
      arbolActores.textoHTML = ""
      arbolActores._tablaPreOrden(arbolActores.raiz)
      textoHTML += arbolActores.textoHTML
      textoHTML += `</TABLE>`;

      element.innerHTML = textoHTML;
      
});

document.getElementById("check-in").addEventListener('click', (event) => {
  
     event.target.checked = true;
     document.getElementById("check-pre").checked = false;
     document.getElementById("check-pos").checked = false;
     

     var element = document.getElementById("tabla-actores");
      var textoHTML = `<TABLE class="tabla-tabla" >`;
      arbolActores.textoHTML = ""
      arbolActores._tablaInOrden(arbolActores.raiz);
      textoHTML += arbolActores.textoHTML
      textoHTML += `</TABLE>`;

      element.innerHTML = textoHTML;
  
});

document.getElementById("check-pos").addEventListener('click', (event) => {
  
     event.target.checked = true;
     document.getElementById("check-pre").checked = false;
     document.getElementById("check-in").checked = false;

     var element = document.getElementById("tabla-actores");
      var textoHTML = `<TABLE class="tabla-tabla" >`;
      arbolActores.textoHTML = ""
      arbolActores._tablaPosOrden(arbolActores.raiz)
      textoHTML += arbolActores.textoHTML
      textoHTML += `</TABLE>`;

      element.innerHTML = textoHTML;
  
});

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


var arbolActores = new ArbolActores();


//#endregion

goHome();
document.getElementById("btn-logout").style.display = "none";






let triggerDownload = (imgURI, fileName) => {
    let a = document.createElement('a')

    a.setAttribute('download', 'image.svg')
    a.setAttribute('href', imgURI)
    a.setAttribute('target', '_blank')

    a.click()
}

let save = () => {
  let svg = document.querySelector('svg')
    let data = (new XMLSerializer()).serializeToString(svg)
    let svgBlob = new Blob([data], {type: 'image/png+xml;charset=utf-8'})
    let url = URL.createObjectURL(svgBlob)

    triggerDownload(url)
}


let btn = document.getElementById("descargarGrafo")
btn.addEventListener('click', save);
