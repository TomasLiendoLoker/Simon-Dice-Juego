//Tengo que guardar los movimientos de la computadora y luego la del usuario
let secuenciaMaquina = [];
let secuenciaUsuario = [];
let ronda = 0;
//cuando apreto "jugar" llama a la funcion comenzarJuego
document.querySelector("button[type=button]").onclick = comenzarJuego;

//estado de default cuando entras al juego
actualizarEstado('Apreta "Jugar" para iniciar el juego');

function comenzarJuego() {
  //Cada vez que comienzo un nuevo juego debo resetear las secuencias y ronda
  reiniciarEstado();
  manejarRonda();
}

function reiniciarEstado() {
  let secuenciaMaquina = [];
  let secuenciaUsuario = [];
  let ronda = 0;
}

function actualizarEstado(estado) {
  const $estado = document.querySelector("#estado");
  $estado.textContent = estado;
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
    //desbloquearInputUsuario();
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
  setTimeout(function () {
    $cuadro.style.opacity = 0.5;
  }, 500);
}

function actualizarNumeroRonda(ronda) {
  document.querySelector("#ronda").textContent = ronda;
}
