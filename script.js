const loginUser = document.getElementById("loginUser");
const loginError = document.getElementById("loginError");
const loginScreen = document.getElementById("loginScreen");
const saeScreen = document.getElementById("saeScreen");
const numButtons = document.querySelectorAll("#numpad .num");
const clearBtn = document.getElementById("clear");
const enterBtn = document.getElementById("enter");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");

const CONDUCTORES = [
    {codigo: "1111", idVehiculo: "421"},
    {codigo: "2222", idVehiculo: "422"},
    {codigo: "3333", idVehiculo: "423"}
];

let vehiculoActual = null;

// --- Vehículos de prueba ---
let vehiculos = JSON.parse(localStorage.getItem("vehiculos"));
if(!vehiculos || vehiculos.length === 0){
    vehiculos = [
        {id:"421", horarioPrevisto:12.5, horaReal:12.5, ubicacion:"Calle"},
        {id:"422", horarioPrevisto:13.0, horaReal:13.0, ubicacion:"Calle"},
        {id:"423", horarioPrevisto:14.25, horaReal:14.25, ubicacion:"Garaje"}
    ];
    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
}

// --- Numpad ---
numButtons.forEach(btn => {
    btn.addEventListener("click", () => loginUser.value += btn.textContent);
});
clearBtn.addEventListener("click", () => loginUser.value = "");
enterBtn.addEventListener("click", () => {
    const codigo = loginUser.value.trim();
    const encontrado = CONDUCTORES.find(c => c.codigo === codigo);
    if(encontrado){
        loginScreen.style.display = "none";
        saeScreen.style.display = "block";
        vehiculoActual = encontrado.idVehiculo;
        inicializarConductor();
    } else loginError.textContent = "Código incorrecto";
});

function inicializarConductor(){
    mostrarVehiculo();
    document.getElementById("registrarBtn").addEventListener("click", registrarHoraReal);
}

function convertirATiempoDecimal(texto){
    texto = texto.trim();
    if(!texto) return 0;
    if(texto.includes(":")){
        let partes = texto.split(":");
        let horas = parseInt(partes[0]) || 0;
        let minutos = parseInt(partes[1]) || 0;
        return horas + minutos/60;
    } else {
        let minutos = parseInt(texto) || 0;
        return minutos/60;
    }
}

function mostrarVehiculo(){
    const tabla = document.getElementById("tablaVehiculo");
    tabla.innerHTML = `<tr>
        <th>Horario Previsto</th>
        <th>Hora Real</th>
        <th>Estado</th>
        <th>Ubicación</th>
    </tr>`;

    const v = vehiculos.find(x => x.id === vehiculoActual);
    if(v){
        let retrasoDecimal = v.horaReal - v.horarioPrevisto;
        let estado = "OK";
        if(retrasoDecimal > 0){
            let horas = Math.floor(retrasoDecimal);
            let minutos = Math.round((retrasoDecimal - horas)*60);
            estado = `Retraso ${horas}h ${minutos}min`;
        }
        tabla.innerHTML += `<tr>
            <td>${v.horarioPrevisto.toFixed(2)}</td>
            <td>${v.horaReal.toFixed(2)}</td>
            <td style="color:${retrasoDecimal>0?'#ff5252':'#00e676'}">${estado}</td>
            <td>${v.ubicacion}</td>
        </tr>`;
    }
}

function registrarHoraReal(){
    const horaRealInput = document.getElementById("horaReal").value;
    const horaReal = convertirATiempoDecimal(horaRealInput);
    const v = vehiculos.find(x => x.id === vehiculoActual);
    if(v){
        v.horaReal = horaReal;
        localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
        mostrarVehiculo();
        document.getElementById("horaReal").value = "";
    } else alert("Vehículo no encontrado");
}

cerrarSesionBtn.addEventListener("click", () => {
    saeScreen.style.display = "none";
    loginScreen.style.display = "flex";
    loginUser.value = "";
    loginError.textContent = "";
});
