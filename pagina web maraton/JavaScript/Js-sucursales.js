var map;
var locacionInicial = [-34.554038, -58.728941];

function mapa() {
    map = L.map('mapidSucursales').setView(locacionInicial, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mostrarSucursales();
}

function mostrarSucursales() {
    $(".listaSucursales").show();
    
    let icon = L.divIcon({
        className: 'custom-div-icon', /*sin esto aparece un recuadro blanco detras de los markers*/ 
        html: "<div style='background-color:#CD5C5C;' class='marker-pin'></div>",
        iconSize: [26, 38],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35]
    });

    var cluster = L.markerClusterGroup();
    for (let index = 0; index < locacionSucursales.length; index++) {
        cluster.addLayers([
            L.marker([locacionSucursales[index].lat, locacionSucursales[index].long], { icon: icon })
                .bindPopup("<b>" + datosSucursales[index].nombre + "</b>" + "<br>" +
                    "<b>" + "Direccion: " + "</b>" + datosSucursales[index].direccion + "<br>" +
                    "<b>" + "Horario: " + "</b>" + datosSucursales[index].horario + "<br>" +
                    "<b>" + "Telefono: " + "</b>" + datosSucursales[index].telefono),                  
        ])
        
        $("#grupo1").append("<option id=sucursal" + index + ">" + datosSucursales[index].nombre + "</option>");
        $("#sucursal" + index).on("click", function (event) {

            let nombreSucursal = event.target.innerText;
            hacerZoom(nombreSucursal);
            
        });
        
    }

    cluster.addTo(map);
}

function hacerZoom(nombreSucursal) {

    for (let i = 0; i < datosSucursales.length; i++) {

        if (nombreSucursal.toUpperCase() == datosSucursales[i].nombre.toUpperCase()) {

            let latitud = locacionSucursales[i].lat;
            let longitud = locacionSucursales[i].long;

            map.setView([latitud, longitud], 17);

            let icon = L.divIcon({
                className: 'custom-div-icon',   /*sin esto aparece un recuadro blanco detras de los markers*/ 
                html: "<div style='background-color:#CD5C5C;' class='marker-pin'></div>",
                iconSize: [26, 38],
                iconAnchor: [15, 42],
                popupAnchor: [0, -35]
            });

            let popUp = "<b>" + datosSucursales[i].nombre+ "</b> <br>" +
                "<b>Direccion: </b>" + datosSucursales[i].direccion + "<br>" +
                "<b>Horarios: </b>" + datosSucursales[i].horario + "<br>" +
                "<b>Telefono: </b>" + datosSucursales[i].telefono;

            L.marker([latitud, longitud], { icon: icon }).bindPopup(popUp).addTo(map).openPopup();

            var el = document.getElementById("infoSucursales");
            el.textContent =  datosSucursales[i].lorem;    
            
        }

    }
}