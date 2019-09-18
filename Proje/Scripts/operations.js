
var doorLayer = L.layerGroup();

var districtLayer = L.layerGroup();

var all_poligons = []

var poligons = [];

var points = [];

var temp_point;

var temp_poligon = [];

var mahalleObjects = [];

var kapıObjects = [];


var googleMaps = L.gridLayer.googleMutant({
    type: 'roadmap'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
});

var myMap = L.map('map', {
    center: [39, 35.5],
    zoom: 7,
    layers: [googleMaps]
});

var baseMap = {
    "Map": googleMaps
};

var overlayMaps = {
    "Kapılar": doorLayer,
    "Mahalleler": districtLayer
};

L.control.layers(baseMap, overlayMaps).addTo(myMap);

var popup = L.popup();

// sayfa yüklendiğinde verileri çek
window.onload = getData();

myMap.on('click', onMapClick);

myMap.on('contextmenu', function (e) {

    if (myMap.hasLayer(districtLayer) && myMap.hasLayer(doorLayer)) {

        alert("Mahalleleri ya da Kapıları Seçiniz");
    }
    else {

        if (myMap.hasLayer(districtLayer) && temp_poligon.length != 0) {
            popup.setLatLng(e.latlng)
                .setContent("<div>Mahalle adı: <input type=\"text\" id=\"districtName\"> " +
                    "<button id=\"saveDistrict\" onclick=\"saveDistrictData()\">Mahalle Kaydet</button> " +
                    "<button id = \"clear\" onclick=\"clearDistrictData()\" > Sil</button ></div>")
                .openOn(myMap);
        }


        if (myMap.hasLayer(doorLayer) && points.length != 0) {
            popup.setLatLng(e.latlng)
                .setContent("<div>Kapı no: <input type=\"text\" id=\"doorNo\"><br>" +
                    "<button id=\"saveDoor\" onclick=\"saveDoorData()\">Kapı No Kaydet</button>" +
                    " <button id = \"clear\" onclick=\"clearDoorData()\" > Sil</button ></div>")
                .openOn(myMap);
        }
    }

});

function onMapClick(e) {

    if (myMap.hasLayer(districtLayer) && myMap.hasLayer(doorLayer)) {

        alert("Mahalle Katmanını ya da Kapı Katmanını Seçiniz");
    }

    else {

        if (myMap.hasLayer(districtLayer)) {

            var value = e.latlng;

            var marker = L.marker([value.lat, value.lng]).addTo(districtLayer);

            console.log(value.lat + "-" + value.lng);

            //temp_poligon.push(e.latlng.lat.toString() + "," + e.latlng.lng.toString());

            temp_poligon.push(e.latlng);

        }

        if (myMap.hasLayer(doorLayer)) {

            doorLayer.clearLayers();

            for (var i = 0; i < points.length; i++) {
                var marker = L.marker(points[i]).addTo(doorLayer);
            }

            var value = e.latlng;

            //var point = L.point(value.lat, value.lng);

            //doorLayer.panBy(point);

            var marker = L.marker(value).addTo(doorLayer);

            console.log(value.lat + "-" + value.lng);

            temp_point = e.latlng;

        }
    }

}

function getDistrictData() {

    mahalleObjects = [];

    $.ajax({

        url: '/Home/SelectDistrictData',
        type: 'get',
        dataType: 'json',
        success: function (data) {

            var mahalleler = data;

            for (var i = 0; i < mahalleler.length; i++) {

                var koordinatlar = mahalleler[i].Koordinatlar.toString().split(',');

                var pairCoordinates = [];

                for (var j = 0; j < koordinatlar.length - 1; j++) {

                    if (j % 2 == 0) {

                        var x = parseFloat(koordinatlar[j]);
                        var y = parseFloat(koordinatlar[j + 1]);

                        pairCoordinates.push([x, y]);
                        //L.marker([x, y]).addTo(districtLayer);
                    }

                }

                var polygon = L.polygon(pairCoordinates, { color: 'red' })
                    .addTo(districtLayer)
                    .bindPopup("<div>Mahalle Adı: " + mahalleler[i].Ad + "</div>");

                all_poligons.push(pairCoordinates);

                mahalleObjects.push({

                    Id: mahalleler[i].Id,

                    Name: mahalleler[i].Ad,

                    Koordinatlar: pairCoordinates

                });

            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed' + xhr.responseText;
            alert(errorMsg);
        }
    })
}

function getDoorData() {

    kapıObjects = [];

    $.ajax({

        url: '/Home/SelectDoorData',
        type: 'get',
        dataType: 'json',
        success: function (data) {

            var kapılar = data;

            for (var i = 0; i < kapılar.length; i++) {

                var koordinat = L.latLng(parseFloat(kapılar[i].Koordinat.toString().split(',')[0]), parseFloat(kapılar[i].Koordinat.toString().split(',')[1]));

                points.push(koordinat);

                L.marker(koordinat).addTo(doorLayer).bindPopup('<div>Kapı No: ' + kapılar[i].KapıNo + ' </div>'); //  </div><div>Mahalle Adı: ' + mahalleObjects.find(({ Id }) => Id == kapıObjects[i].MahalleId).Id +'</div>');

                kapıObjects.push({

                    Id: kapılar[i].Id,

                    KapıNo: kapılar[i].KapıNo,

                    MahalleId: kapılar[i].MahalleId,

                    Koordinat: [koordinat.lat, koordinat.lng]
                });

            }
        },

        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed' + xhr.responseText;
            alert(errorMsg);
        }
    })
}

function getData() {

    getDistrictData();

    getDoorData();
    
}

function saveDistrictData() {

    var coordinates = [];

    for (var i = 0; i < temp_poligon.length; i++) {
        coordinates.push(temp_poligon[i].lat);
        coordinates.push(temp_poligon[i].lng);
    }

    var data = {
        Ad: $('#districtName').val(),
        Koordinatlar: coordinates.toString()
    };

    $.ajax({

        type: 'post',
        url: '/Home/SaveDistrictData',
        dataType: 'json',
        data: data,
        success: function (returnData) {

            getDistrictData();

            myMap.closePopup();
            poligons.push(temp_poligon);

            var polygon = L.polygon(temp_poligon, { color: 'red' }).addTo(districtLayer);

            all_poligons.push(temp_poligon);

            temp_poligon = [];

        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed' + xhr.responseText;
            alert(errorMsg);
        }

    });

}

function saveDoorData() {

    var mahalleId = 0;
    // Intersect Control
    for (var i = 0; i < mahalleObjects.length; i++) {

        var dummyBoundry = L.latLngBounds(mahalleObjects[i].Koordinatlar);

        if (dummyBoundry.contains(temp_point) == true) {

            mahalleId = mahalleObjects[i].Id;
        }
    }

    var data = {

        KapıNo: $('#doorNo').val(),

        MahalleId: mahalleId,

        koordinat: temp_point.lat + "," + temp_point.lng
    };

    $.ajax({

        type: 'post',
        url: '/Home/SaveDoorData',
        dataType: 'json',
        data: data,
        success: function (returnData) {

            getDoorData();

            L.marker(temp_point).addTo(doorLayer);

            myMap.closePopup();

            points.push(temp_point);
        },

        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed' + xhr.responseText;
            alert(errorMsg);
        }

    });

}

function clearDistrictData() {

    temp_poligon = [];
    poligon = [];
    districtLayer.clearLayers();
    myMap.closePopup();

    for (var i = 0; i < all_poligons.length; i++) {

        var p = L.polygon(all_poligons[i], { color: 'red' }).addTo(districtLayer);
    }

}

function clearDoorData() {

    //points = []
    doorLayer.clearLayers();
    myMap.closePopup();

    for (var i = 0; i < points.length; i++) {

        L.marker(points[i]).addTo(doorLayer);
    }

}

$("#queryAdres").on("click", function () {


    $("#districtTable tbody").empty();

    for (var i = 0; i < mahalleObjects.length; i++) {

        $("#districtTable tbody").append('<tr><th scope="row">' + (i + 1) + '</th>'
            + '<td>' + mahalleObjects[i].Name + '</td>'
            + '<td><button id=\'btn' + (i + 1) + '\'class="btn btn-primary" onclick= "zoomToDistrict(' + i + ')">Mahalleyi Göster</button></td> </tr>');

    }

    $("#doorTable tbody").empty();

    for (var i = 0; i < kapıObjects.length; i++) {

        $("#doorTable tbody").append('<tr><th scope="row">' + (i + 1) + '</th>'
            + '<td>' + kapıObjects[i].KapıNo + '</td>' + '<td>' + mahalleObjects.find(({ Id }) => Id == kapıObjects[i].MahalleId).Name + '</td>'
            + '<td><button class = "btn btn-primary" onclick= "zoomToDoor(' + i + ')">Kapı Göster</button></td></tr>');

    }


    $("#lists").toggle();

    /*
    $("#districtTable").css("display", "block");

    $("#doorTable").css("display", "block");
    */

});

function zoomToDistrict(index) {

    var polygon = L.polygon(mahalleObjects[index].Koordinatlar);

    myMap.fitBounds(polygon.getBounds());

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function zoomToDoor(index) {

    myMap.setView(kapıObjects[index].Koordinat, 18);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}



