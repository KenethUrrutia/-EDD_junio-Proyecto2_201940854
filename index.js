var isLogeado = false;
var isAdmin = false;
var usuarioLogeado = "";
var peliculaActual;






//#region Nodos
class Coment{
  constructor(comentario){
    this.comentario = comentario
  }
}

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

class NodoPelicula{
  constructor(pelicula){
      this.izquierda = null;
      this.derecha = null;
      this.pelicula = pelicula;
      this.altura = 0;
      this.id = 0;
      this.comentarios = new Array();
  }
}

class NodoIndiceHash{
  constructor(index){
    this.index = index;
    this.siguiente = null;
    this.abajo  = null;
  }
}

class NodoCategoria{
    constructor(categoria){
      this.id = 0;
      this.categoria = categoria
      this.siguiente = null;
    }
}

//#endregion



//#region Estructuras

class IndiceHashCategorias{
  constructor(posiciones){
    this.cabeza = null;
    this.elementos = 0;
    this.crear(posiciones);
  }

  crear(posiciones){
    
    for (let i = 0; i < posiciones; i++) {
      var temporal = new NodoIndiceHash(i);
        if (this.cabeza != null) {
          temporal.abajo = this.cabeza;
          this.cabeza = temporal;
        }else{
          this.cabeza = temporal
        }
    }
  }

  insertarSiguiente(index, categoria){
    var temporal = this.cabeza;

    while (temporal != null) {
      
      if (temporal.index == index) {
        var temporalCategoria = temporal.siguiente;

        if (temporalCategoria == null) {
          var nuevo  = new NodoCategoria(categoria);
          temporal.siguiente = nuevo;
          this.elementos++;

          return;
        } else {

          while (temporalCategoria != null) {
            if (temporalCategoria.siguiente == null) {
              var nuevo  = new NodoCategoria(categoria);
              nuevo.id = temporalCategoria.id+1;
              temporalCategoria.siguiente = nuevo;
              this.elementos++;
              return
            } else {
              temporalCategoria = temporalCategoria.siguiente;
            }
          }

        }
      } 

      temporal = temporal.abajo
    }
    

  }

}

class HashCategorias{
  constructor(posiciones){
    this.posiciones = posiciones;
    this.indice = new IndiceHashCategorias(posiciones);
  }

  add(categoria){
    var indexCategoria = (categoria.id_categoria % this.posiciones);
    this.indice.insertarSiguiente(indexCategoria, categoria);

    if (this.indice.elementos/this.posiciones > 0.75) {
      this.rehashing()
    }

  }

  rehashing(){
    this.posiciones = this.posiciones+5;
    var nuevoIndice = new IndiceHashCategorias(this.posiciones) ;

    var tempoIndice = this.indice.cabeza;
    while(tempoIndice!=null){
      var temporalCategoria = tempoIndice.siguiente;


      while (temporalCategoria != null) {
        var categoria = temporalCategoria.categoria;
        var indexCategoria = (categoria.id_categoria % this.posiciones);
        nuevoIndice.insertarSiguiente(indexCategoria, categoria);
          
        temporalCategoria = temporalCategoria.siguiente
      }


      tempoIndice = tempoIndice.abajo;
    }
    this.indice = nuevoIndice;

  }

  crearTablaCategorias(){
    var textoHTML = `<TABLE class="tabla-pelis" >`;

    var tempoIndice = this.indice.cabeza;
    while(tempoIndice!=null){
      
      var temporalCategoria = tempoIndice.siguiente;

      while (temporalCategoria != null) {
        textoHTML += `<TR> <td> <b>`+temporalCategoria.categoria.company+`</b><br> `+temporalCategoria.categoria.id_categoria+`</td></TR>`;
        temporalCategoria = temporalCategoria.siguiente
      }
      tempoIndice = tempoIndice.abajo;
    }
    textoHTML += `</table>`;

    var element = document.getElementById("tabla-categorias");
    element.innerHTML = textoHTML;
  }

  graficar(lienzo){
    var codigoDot = `digraph G {\nnode [shape=box height = 0.8];\nrankdir =LR\nnodesep=0;\n`;
    var etiquetas = "";
    var conexiones = "";
    var indices = ""

    var tempoIndice = this.indice.cabeza;
    while(tempoIndice!=null){
      indices += tempoIndice.index + `\n`;
      let indexIndice = tempoIndice.index;
      var temporalCategoria = tempoIndice.siguiente;

      
      if (temporalCategoria != null) {
        let idCategoria = temporalCategoria.id;
        
        etiquetas += `I`+indexIndice+`C`+ idCategoria +` [label = "`+temporalCategoria.categoria.company+`" height = 0.1 width= 2] \n`;
        conexiones += indexIndice + ` -> I`+indexIndice+`C`+idCategoria +`\n` ;
      }

      while (temporalCategoria != null) {
        if (temporalCategoria.siguiente != null) {
          let idCategoria = temporalCategoria.id;
          let idCategoriaSig = temporalCategoria.siguiente.id;

          etiquetas += `I`+indexIndice+`C`+idCategoriaSig+ ` [label = "`+temporalCategoria.categoria.company+`" height = 0.1 width= 2] \n`;
          conexiones += `I`+indexIndice+`C`+idCategoria + ` -> I`+indexIndice+`C`+idCategoriaSig +`\n` ;
        }
          
          
          temporalCategoria = temporalCategoria.siguiente
      }


      tempoIndice = tempoIndice.abajo;
    }

    codigoDot += indices + etiquetas + conexiones + `\n}`

    console.log(codigoDot);
    d3.select("#"+lienzo)
      .graphviz()
        .height(550)
        .width(800)
        .dot(codigoDot)
        .render();
    console.log(this.indice.elementos);

  }
}

class AVLPeliculas{

    constructor(){
      this.raiz = null
      this.contador = 0;
      this.conexiones = ""
      this.etiquetas = ""
      this.textoHTML = ""
      this.peliculaEncontrada = null;
    }
    
    max(hi, hd){
      if (hi > hd) 
        return hi
      return hd
      
    }
    
    altura(nodo){
      if (nodo != null) 
        return nodo.altura
      return -1
    }
    
    insertar(pelicula){
      this.raiz = this._insertar(pelicula, this.raiz)

    }
    
    _insertar(pelicula, nodo){
      if(nodo == null) {

        var nuevo = new NodoPelicula(pelicula);
        nuevo.id = this.contador;
        this.contador++;
        return  nuevo
      }

        
      else{

        if(pelicula.nombre_pelicula < nodo.pelicula.nombre_pelicula){
          nodo.izquierda = this._insertar(pelicula, nodo.izquierda)
          if(this.altura(nodo.derecha)-this.altura(nodo.izquierda) == -2){
            
              if(pelicula.nombre_pelicula < nodo.izquierda.pelicula.nombre_pelicula){
                  nodo = this.RotacionSimpleDerecha(nodo);
                  
              }
              else{
                  nodo = this.RotacionDobleIzquierda(nodo);
              }
              
          }
        }else if(pelicula.nombre_pelicula > nodo.pelicula.nombre_pelicula){
          nodo.derecha = this._insertar(pelicula, nodo.derecha);
          if(this.altura(nodo.derecha)-this.altura(nodo.izquierda)== 2){
              
              if(pelicula.nombre_pelicula > nodo.derecha.pelicula.nombre_pelicula){
                  nodo = this.RotacionSimpleIzquierda(nodo);
              }else{
                  nodo = this.RotacionDobleDerecha(nodo);
              }
          }
        }else{
            nodo.pelicula = pelicula;
        }
      }
      nodo.altura = this.max(this.altura(nodo.izquierda),this.altura(nodo.derecha))+1
      return nodo;
    }

    RotacionSimpleDerecha(nodo){
      
        var aux = nodo.izquierda;
        nodo.izquierda = aux.derecha;
        aux.derecha = nodo;

        nodo.altura = this.max(this.altura(nodo.derecha),this.altura(nodo.izquierda))+1;
        aux.altura = this.max(this.altura(nodo.izquierda), nodo.altura)+1;
        return aux;
    }

    RotacionSimpleIzquierda(nodo){
        var aux = nodo.derecha;
        nodo.derecha = aux.izquierda;
        aux.izquierda = nodo;

        nodo.altura = this.max(this.altura(nodo.derecha),this.altura(nodo.izquierda))+1;
        aux.altura = this.max(this.altura(nodo.derecha),nodo.altura)+1;
        return aux;
    }

    RotacionDobleDerecha(nodo){
      nodo.derecha = this.RotacionSimpleDerecha(nodo.derecha);
      return this.RotacionSimpleIzquierda(nodo);
    }

    RotacionDobleIzquierda(nodo){

      nodo.izquierda = this.RotacionSimpleIzquierda(nodo.izquierda);
      return this.RotacionSimpleDerecha(nodo);
    }

    _tablaAZ(nodo){
      
      if(nodo.izquierda!=null){
      this._tablaAZ(nodo.izquierda)
      }

      this.textoHTML += `<TR> <td> <h1>` +nodo.pelicula.nombre_pelicula+`</h1></td>`+
      `<td><b>Descripcion: </b>`+nodo.pelicula.descripcion+`</td>`+
      `<td><button class="info-peli" id="info-peli" value= "`+nodo.pelicula.nombre_pelicula+`"> <i class="bi bi-question-circle-fill"></i> <br>Informacion</button>    `+
      `<button class="alquilar-peli" id="alquilar-peli" value= "`+nodo.pelicula.nombre_pelicula+`"><i class="bi bi-cart3"></i><br>Alquilar</button></TD> `+
      `<td><b> Q`+nodo.pelicula.precion_Q+`.00</b></td></TR>`;

      if (nodo.derecha!=null) {
      this._tablaAZ(nodo.derecha);
      }
    }

    _tablaZA(nodo){
      if(nodo.derecha!=null){
        this._tablaZA(nodo.derecha)
        }
  
        this.textoHTML += `<TR> <td> <h1>` +nodo.pelicula.nombre_pelicula+`</h1></td>`+
        `<td><b>Descripcion: </b>`+nodo.pelicula.descripcion+`</td>`+
        `<td><button class="info-peli" id="info-peli" value= "`+nodo.pelicula.nombre_pelicula+`"> <i class="bi bi-question-circle-fill"></i> <br>Informacion</button> `+
        `<button class="alquilar-peli" id="alquilar-peli" value= "`+nodo.pelicula.nombre_pelicula+`"><i class="bi bi-cart3"></i><br>Alquilar</button></TD> `+
        `<td><b> Q`+nodo.pelicula.precion_Q+`.00</b></td></TR>`;
  
        if (nodo.izquierda!=null) {
        this._tablaZA(nodo.izquierda);
        }
    }

    buscarPelicula(nombre_pelicula){
      this.peliculaEncontrada = null
      this._buscarPelicula(nombre_pelicula, this.raiz)

      return this.peliculaEncontrada;
      
    }

    _buscarPelicula(nombre_pelicula, nodo){

      if(nodo.izquierda!=null){
        this._buscarPelicula(nombre_pelicula, nodo.izquierda)
      }
      if (nombre_pelicula == nodo.pelicula.nombre_pelicula) {
        this.peliculaEncontrada = nodo;
      }
      if (nodo.derecha!=null) {
        this._buscarPelicula(nombre_pelicula, nodo.derecha);
      }


    }

    cambiarValoracion(nombre_pelicula, valoracion){
      this._cambiarValoracion(nombre_pelicula, valoracion, this.raiz)
    }

    _cambiarValoracion(nombre_pelicula, valoracion ,nodo){

      if(nodo.izquierda!=null){
        this._cambiarValoracion(nombre_pelicula, valoracion, nodo.izquierda)
      }
      if (nombre_pelicula == nodo.pelicula.nombre_pelicula) {
        nodo.pelicula.puntuacion_star = valoracion;
      }
      if (nodo.derecha!=null) {
        this._cambiarValoracion(nombre_pelicula, valoracion, nodo.derecha);
      }


    }

    agregarComentario(nombre_pelicula, comentario){
      this._agregarComentario(nombre_pelicula, comentario, this.raiz)
    }

    _agregarComentario(nombre_pelicula, comentario ,nodo){

      if(nodo.izquierda!=null){
        this._agregarComentario(nombre_pelicula, comentario, nodo.izquierda)
      }
      if (nombre_pelicula == nodo.pelicula.nombre_pelicula) {
        
          nodo.comentarios.push(comentario);
        
        
      }
      if (nodo.derecha!=null) {
        this._agregarComentario(nombre_pelicula, comentario, nodo.derecha);
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

      this.etiquetas += `n`+nodo.id+` [label="`+nodo.pelicula.nombre_pelicula+`"]\n`;

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
        .height(550)
        .width(800)
        .dot(codigoDot)
        .render();

    }
}

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
          .height(550)
          .width(800)
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
        .height(550)
        .width(800)
        .dot(codigoDot)
        .render();

  }
  
  _tablaPreOrden(nodo){
    this.textoHTML += `<TR> <td> <h2>` +nodo.actor.nombre_actor+`</h2><br>`+
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

      this.textoHTML += `<TR> <td> <h2>` +nodo.actor.nombre_actor+`</h2><br>`+
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

    this.textoHTML += `<TR> <td> <h2>` +nodo.actor.nombre_actor+`</h2><br>`+
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
        avlPeliculas.insertar(element)
        
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
      listaClientes.add(element)    
    });

    inputClientes.value = ``;
    
    alert("Clientes Agregados")
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
        hashCategorias.add(element)
        
    });
    inputClientes.value = ``;
    console.log(hashCategorias);
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
  if (isLogeado==true) {
    if (isAdmin == true) {
        goAdmin();
    }else{ 
        goUser();
    }
  } else {
    mostrarLogin();
  }
  

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

  var div = document.getElementById('div-user')
  div.style.display = "block";
  llenarTablaPelis();

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

function goCategorias() {
  
  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });

  hashCategorias.crearTablaCategorias();

  var div = document.getElementById('div-categorias')
  div.style.display = "block";

}

function goInfoPeli(nombre_pelicula) {
  var nodoPelicula = avlPeliculas.buscarPelicula(nombre_pelicula);
  
  peliculaActual = nodoPelicula;
  var element = document.getElementById("titulo-peli");
  element.innerHTML = (nodoPelicula.pelicula.nombre_pelicula);

  element = document.getElementById("descripcion-peli");
  element.innerHTML = (nodoPelicula.pelicula.descripcion);

  

  var estrellas = document.querySelectorAll("#star")
  for (let i = 0; i < 5 ; i++) {
    var estrella = estrellas[i];
    estrella.classList.remove("checked")
  }
  for (let i = 0; i < Math.round(nodoPelicula.pelicula.puntuacion_star) ; i++) {
    var estrella = estrellas[i];
    estrella.classList.add("checked")
  }



  if (peliculaActual.comentarios!=null) {
    crearTablaComentarios();
  }






  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });
  var div = document.getElementById('div-info-peli')
  div.style.display = "block";

}

function logout() {
  isLogeado = false
  isAdmin = false;
  usuarioLogeado =""
  
  var divTodos = document.querySelectorAll('.ventana');
  
  divTodos.forEach(element => {
      element.style.display = "none";
  });
  goHome();
  
  document.getElementById("btn-logout").style.display = "none";
  alert("Logout Exitoso")

}

function logear(nombre_usuario) {
  isLogeado = true;
  usuarioLogeado = nombre_usuario;

  var checkBox = document.getElementById("check-admin");

  if (checkBox.checked == true) {
      if (nombre_usuario == "EDD") {
        isAdmin = true
        alert("Login Exitoso ")
        goAdmin();
        var btn = document.getElementById("btn-logout")
        btn.innerHTML  = `<i class="bi bi-box-arrow-left"></i> `+nombre_usuario;
        btn.style.display = "block";
        ocultarLogin();
      }else{
        alert("Error: no tiene acceso a administrador");
      }
  }else{ 
      isAdmin = false
      alert("Login Exitoso ")
      goUser();
      var btn = document.getElementById("btn-logout")
      btn.innerHTML  = `<i class="bi bi-box-arrow-left"></i> `+nombre_usuario;
      btn.style.display = "block";
      ocultarLogin();
  }

  

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

function llenarTablaPelis() {
  var select = document.querySelector('#cbb-ordenar')

  var element = document.getElementById("tabla-peliculas");

  var textoHTML = "";

  if (avlPeliculas.raiz != null) {
    textoHTML = `<TABLE class="tabla-pelis" >`;
    avlPeliculas.textoHTML = ""
    switch (select.selectedIndex) {
      case 0:
        avlPeliculas._tablaAZ(avlPeliculas.raiz); 
        botonesTablaPelis();
        break;
        
    
      default:
        botonesTablaPelis();
        avlPeliculas._tablaZA(avlPeliculas.raiz); 
        break;
    }
    textoHTML += avlPeliculas.textoHTML
    textoHTML += `</TABLE>`;
  } else {
    textoHTML = "<h1>Aun no hay nada que mostrar</h1>"
  }

  element.innerHTML = textoHTML;
  botonesTablaPelis();
}

function botonesTablaPelis() {
  var btnsInfo = document.querySelectorAll("#info-peli");
  btnsInfo.forEach(btn => {
    btn.addEventListener('click', (event) => {
      console.log(btn.value);
      goInfoPeli(btn.value);
    });
  });

  var btnsAlquilar = document.querySelectorAll("#alquilar-peli");
  btnsAlquilar.forEach(btn => {
    btn.addEventListener('click', (event) => {
      alert(btn.value + " Alquilada ");
    });
  });

}

function crearTablaComentarios() {
  var textoHTML = `<table class="tabla-comentarios">`

  for (let i = 0; i < peliculaActual.comentarios.length; i++) {
    var coment = peliculaActual.comentarios[i]
    textoHTML+=`<tr><td><i class="bi bi-caret-right-fill"></i> `+coment.comentario+`</td></tr>`
    
  }

  textoHTML+= `</table>`

  document.getElementById("comentarios-recientes").innerHTML = textoHTML;
  
}

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

var slider = document.getElementById("num-valoracion");
var output = document.getElementById("valor-valoracion");
output.innerHTML = slider.value;
slider.oninput = function() {
  output.innerHTML = this.value;
}

//#endregion


//#region Botones


document.getElementById("btn-home").onclick = goHome;
document.getElementById("btn-actores").onclick = goActores;
document.getElementById("btn-categorias").onclick = goCategorias;
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

  avlPeliculas.graficar("lienzo")

});

document.getElementById("mostrar-grafo-categorias").addEventListener('click', (event) => {

  var btns = document.querySelectorAll(".btn-grafo")
  btns.forEach(element => {
    element.classList.remove("btn-X-active")
  });
  event.target.classList.add("btn-X-active")

  hashCategorias.graficar("lienzo");

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

document.getElementById("cbb-ordenar").addEventListener('change', llenarTablaPelis);

document.getElementById("btn-valorar").addEventListener('click', (event) => {
  var numValue = document.getElementById("num-valoracion").value
  var valoracion = parseFloat((peliculaActual.pelicula.puntuacion_star + parseFloat( numValue))/2);
  
  avlPeliculas.cambiarValoracion(peliculaActual.pelicula.nombre_pelicula, valoracion);
  goInfoPeli(peliculaActual.pelicula.nombre_pelicula);
} );

document.getElementById("btn-comentar").addEventListener('click', (event) => {
  var comentario = usuarioLogeado + ": "+ document.getElementById("new-comentario").value
  
  avlPeliculas.agregarComentario(peliculaActual.pelicula.nombre_pelicula, new Coment(comentario));
  goInfoPeli(peliculaActual.pelicula.nombre_pelicula);
  document.getElementById("new-comentario").value = "";
} );

document.getElementById("descargarGrafo").addEventListener('click', save);

//#endregion



//#region variables
var hashCategorias =  new HashCategorias(20);
var arbolActores = new ArbolActores();
var avlPeliculas = new AVLPeliculas();
var listaClientes = new ListaClientes();
listaClientes.add({
    "dpi":2354168452525, 
    "nombre_completo": "Wilfred Perez", 
    "nombre_usuario": "EDD",
    "correo":"",
    "contrasenia": "123",
    "telefono": "+502 (123) 123-4567"
});

//#endregion

goHome();
document.getElementById("btn-logout").style.display = "none";














