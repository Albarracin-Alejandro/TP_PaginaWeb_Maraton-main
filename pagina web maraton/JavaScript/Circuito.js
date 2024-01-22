var map;
var locacionInicial = [-34.52325980664579, -58.69897290895953];

circuito42 = "https://fastspeedster.herokuapp.com/api/tracks/42";
circuito80 = "https://fasterthanall.herokuapp.com/api/tracks/80";
corredores42 = "https://fasterthanall.herokuapp.com/api/tracks/42/runners/";
Posiciones = "https://fasterthanall.herokuapp.com/api/replays/42";
camaras42 = "https://fastspeedster.herokuapp.com/api/webcams/42";

function main() {

    map = L.map('mapCircuito').setView(locacionInicial, 16);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

}

function circuitoPagina(){
    getFromURL(circuito42, agregarCircuitos);
    getFromURL(circuito80,agregarCircuitos);
    getFromURL(camaras42,ubicarWebcams); 
}

function seguimientoPagina(){
    getFromURL(circuito42, agregarCircuitos);
    getFromURL(corredores42, listarUsuarios);
}

function getFromURL(url, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let response = JSON.parse(xhttp.responseText);
            callback(response);
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function listarUsuarios(response) {
    corredores = [];
    let lista = document.getElementById("lista-usuarios");
    response.runners.map(usuario => {
        let item = document.createElement("option");
        item.append(usuario.name + " " + usuario.surname)
        item.value = usuario.id;
        item.className = "drop-down";
        lista.append(item);
        corredores.push(usuario)

    });
}

function seleccionDecorredor() {
    let valor = document.getElementById("lista-usuarios");
    for (var i = 0; i < corredores.length; i++) {
        if (corredores[i].id == valor.value) {
            usuarioSellecionoCorredor = valor.value;
            getFromURL(Posiciones, trascursoDeLaCarrera);
        }
    }
}

function ubicarWebcams(response) {
    var myIcon = L.icon({
        iconUrl: "imagenes/style general/camara.png",
        iconSize:     [30, 30], 
        iconAnchor:   [10, 10], 
    });

    // ubicacion de las camaras
        const arr = Array.from(response.webcams)
        for (i = 0; i < arr.length; i++) {
            L.marker(arr[i].coordinate, {icon: myIcon}).addTo(map);
    
        }
        
}

function agregarCircuitos(response) {
    var puntos = [];
    var conta = 1;
    response.track.coordinates.forEach(function (coordinate) {
        puntos.push(coordinate);
        if(conta==1){
            agregarlongCircuito(coordinate, response);
        }
        conta+=1;
    });

    var circuito = L.polyline(puntos, {
        color: '#00ff00',
        weight: "5"
    }).addTo(map);
}

function agregarlongCircuito(coordinate, response){

    let icon = L.divIcon({
        iconUrl: "imagenes/style general/lineaSalida.png",
        iconSize: [26, 38],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35]
    });

    L.marker(coordinate, { icon: icon }).bindPopup(
    "<b>" + "Carrera: "+ response.track.id + "</b>" ).addTo(map);
}

function trascursoDeLaCarrera(response) {
    var arr = [];
    var corredorSelecionado = [];
    response.positions.records.map(corredores => {
        for (let i of corredores.checkpoints) {
            arr.push(i);
        }
    });

    for (var i = 0; i < arr.length; i++) {
        if (usuarioSellecionoCorredor == arr[i].runner_id) {
            corredorSelecionado.push(arr[i]);
        }
    }

    valor = 3000
    for (var i = 0; i < corredorSelecionado.length; i++) {
        setTimeout(function () {
            dibujar(corredorSelecionado);
        }, 3000 + valor);
        valor = valor + 3000;
    }

    function dibujar(corredor) {
        if (corredor[0] != null) {        
            marcador = L.marker(corredor[0].coordinate).addTo(map);
            for (var i = 0; i < corredores.length; i++) {
                if (corredor[0].runner_id == corredores[i].id) {
                    var timestamp = corredor[0].timeStamp
                    var date = new Date(timestamp);
                    document.getElementById('corredor').innerHTML = "Corredor:" + corredores[i].name + " " + corredores[i].surname;
                    document.getElementById('sponsor').innerHTML = "Sponsor: " + corredores[i].sponsor.name;
                    document.getElementById('tiempoTrascurrido').innerHTML = "Tiempo trascurrido: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

                    setTimeout(function () {
                        map.removeLayer(marcador);
                        corredor.shift()
                    }, 2000);
                }

            }
        }

    }

}

    






