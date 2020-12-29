//Tengo que guardar los movimientos de la computadora y luego la del usuario
let secuenciaMaquina = [];
let secuenciaUsuario = [];
let ronda = 0;
//cuando apreto "jugar" llama a la funcion comenzarJuego
document.querySelector("button[type=button]").onclick = comenzarJuego;

//estado de default cuando entras al juego
actualizarEstado('Apreta "Jugar" para iniciar el juego');
//seteo ronda inicial
actualizarNumeroRonda("-");
//bloqueo el input del usuario por default
bloquearInputUsuario();

function comenzarJuego() {
    console.log("entro")
    console.log(secuenciaMaquina)
  //Cada vez que comienzo un nuevo juego debo resetear las secuencias y ronda
  reiniciarEstado();
  console.log(secuenciaMaquina)
  manejarRonda();
}

function reiniciarEstado() {
  secuenciaMaquina = [];
  secuenciaUsuario = [];
  ronda = 0;
}

function actualizarEstado(estado, error = false) {
  const $estado = document.querySelector("#estado");
  $estado.textContent = estado;
  if (error) {
    //Uso de bootstrap
    $estado.classList.remove("alert-primary");
    $estado.classList.add("alert-danger");
  } else {
    $estado.classList.remove("alert-danger");
    $estado.classList.add("alert-primary");
  }
}

function manejarRonda() {
  actualizarEstado("Es el turno de la Maquinola");
  //No permite interaccion del usuario
  bloquearInputUsuario();
  //obtengo un aleatorio div que representa a uno de los cuadros
  const $nuevoCuadro = obtenerCuadroAleatorio();
  secuenciaMaquina.push($nuevoCuadro);
  //Si hay un cuadro jugamos a los 2 segundos
  // 1000 MS = 1 S
  // El jugador va a jugar 1 segundos despues de que se hayan resaltado todos los cuadros
  // Por eso cantidad de cuadros + 1
  // Juega un segundos despues que termino la maquina
  const RETRASO_TURNO_JUGADOR = (secuenciaMaquina.length + 1) * 1000;
  //Parte Asincrona o diferida
  secuenciaMaquina.forEach(function ($cuadro, index) {
    //cada vez que la manique juegue se busca resaltar el cuadrado asociado
    //La maquina procesa rapido y si no pongo ese retraso, no se distingue
    //resaltan todos los cuadros a la vez si no hay rechazo.

    //Tarda un segundo en resaltarse cada cuadro.
    //index + 1 = cantidad de cuadros = cuadros.lenght
    const RETRASO_MS = (index + 1) * 1000;
    setTimeout(function () {
      //funcion handler o de callback
      resaltar($cuadro);
    }, RETRASO_MS);
  });

  //el jugador puede jugar cuando termine la maquina
  setTimeout(function () {
    actualizarEstado("Ahora te toca a vos CRACK:");
    desbloquearInputUsuario();
  }, RETRASO_TURNO_JUGADOR);
  //En cada ronda el usuario tiene que clickear todos los cuadros de nuevo
  secuenciaUsuario = [];
  ronda++;
  actualizarNumeroRonda(ronda);
}

function bloquearInputUsuario() {
  //teniendo una lista de cada uno de los cuadrados
  // los recorro a todos y en c/u no permito que el usuario pueda interactuar
  document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
    $cuadro.onclick = function () {};
  });
}

function obtenerCuadroAleatorio() {
  const $cuadros = document.querySelectorAll(".cuadro");
  //redondea hacia el menor valor y no lo redondea hacia arriba debido
  // a que si redondea hacia arriba el indice podria estar fuera de rango
  const indice = Math.floor(Math.random() * $cuadros.length);
  console.log(indice);
  return $cuadros[indice];
}

function resaltar($cuadro) {
  $cuadro.style.opacity = 1;
  //500 MS despues vuelve la opacidad a 0.5 como estaba originalmente
  // Debe coincidir lo mismo que la propiedad transicion en el CSS
  setTimeout(function () {
    $cuadro.style.opacity = 0.5;
  }, 500);
}

function actualizarNumeroRonda(ronda) {
  document.querySelector("#ronda").textContent = ronda;
}

function desbloquearInputUsuario() {
  document.querySelectorAll(".cuadro").forEach(function ($cuadro) {
    //llama a la funcion handler
    //cuando seteo un event handler (on.click)
    //siempre pasa como parametro a la funcion manejarInputUsuario un evento e
    //el cual contiene informacion acerca del evento click que hice aca
    $cuadro.onclick = manejarInputUsuario;
  });
}

//recibe un evento e como parametro

function manejarInputUsuario(e) {
  //es un evento que me da distinta informacion como:
  //en que parte de la pantalla se hizo click
  //lo que importa es el target: a que le hicimos click cuadro-1 o cuadro-2
  //Me ayuda a identificar el cuadro especifico que le hice click
  console.log(e);
  const $cuadro = e.target;
  resaltar($cuadro);
  secuenciaUsuario.push($cuadro);
  // [cuadro-1, cuadro-2, cuadro-3]
  // [cuadro-1, cuadro-2, cuadro-1]
  // Dame el ultimo indice disponible
  // Con cada click del usuario tengo que decir:
  // Perdio, Pasa de ronda o si le falta dar mas input
  const $cuadroMaquina = secuenciaMaquina[secuenciaUsuario.length - 1];
  if ($cuadro.id !== $cuadroMaquina.id) {
    perder();
    return;
  }
  //Si las longitudes de los array son iguales quiere decir
  //que el usuario le pego a todas las secuencias
  if (secuenciaUsuario.length === secuenciaMaquina.length) {
    bloquearInputUsuario();
    //los 1000 son para que no empiece instantaneamente la maquina a mostrar
    // la nueva secuencia, le da un respiro al jugador
    setTimeout(manejarRonda, 1000);
  }
}

function perder() {
  bloquearInputUsuario();
  actualizarEstado('Perdiste! Tocar "Jugar" para empezar', true);
}
