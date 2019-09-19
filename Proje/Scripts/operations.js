
var doorLayer = L.layerGroup();

var districtLayer = L.layerGroup();

var all_polygons = []

var polygons = [];

var points = [];

var temp_point;

var temp_polygon = [];

var districtObjects = [];

var doorObjects = [];


var googleMaps = L.gridLayer.googleMutant({
    type: 'roadmap'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
});

var myMap = L.map('map', {
    center: [39, 35.5],
    zoom: 7,
    layers: [googleMaps, doorLayer, districtLayer]
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

//myMap.on('click', onMapClick);
/*
myMap.on('contextmenu', function (e) {

    if (myMap.hasLayer(districtLayer) && myMap.hasLayer(doorLayer)) {

        alert("Mahalleleri ya da Kapıları Seçiniz");
    }
    else {

        if (myMap.hasLayer(districtLayer) && temp_polygon.length != 0) {
            popup.setLatLng(e.latlng)
                .setContent("<div>Mahalle adı: <input type=\"text\" id=\"districtName\"> " +
                    "<button id=\"saveDistrict\" onclick=\"saveDistrictData()\">Mahalle Kaydet</button> " +
                    "<button id = \"clear\" onclick=\"clearDistrictData()\" > Sil</button ></div>")
                .openOn(myMap);
        }


        if (myMap.hasLayer(doorLayer)) { //&& points.length != 0) {
            popup.setLatLng(e.latlng)
                .setContent("<div>Kapı no: <input type=\"text\" id=\"doorNo\"><br>" +
                    "<button id=\"saveDoor\" onclick=\"saveDoorData()\">Kapı No Kaydet</button>" +
                    " <button id = \"clear\" onclick=\"clearDoorData()\" > Sil</button ></div>")
                .openOn(myMap);
        }
    }

});
*/
function doorClick(e) {

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

function districtClick(e) {

    var value = e.latlng;

    var marker = L.marker([value.lat, value.lng]).addTo(districtLayer);

    console.log(value.lat + "-" + value.lng);

    //temp_polygon.push(e.latlng.lat.toString() + "," + e.latlng.lng.toString());

    temp_polygon.push(e.latlng);

}

function doorContextMenu(e) {

    popup.setLatLng(e.latlng)
        .setContent("<div>Kapı no: <input type=\"text\" id=\"doorNo\"><br>" +
            "<button id=\"saveDoor\" onclick=\"saveDoorData()\">Kapı No Kaydet</button>" +
            " <button id = \"clear\" onclick=\"clearDoorData()\" > Sil</button ></div>")
        .openOn(myMap);
}

function districtContextMenu(e) {

    popup.setLatLng(e.latlng)
        .setContent("<div>Mahalle adı: <input type=\"text\" id=\"districtName\"> " +
            "<button id=\"saveDistrict\" onclick=\"saveDistrictData()\">Mahalle Kaydet</button> " +
            "<button id = \"clear\" onclick=\"clearDistrictData()\" > Sil</button ></div>")
        .openOn(myMap);

}

function onMapClick(e) {

    if (myMap.hasLayer(districtLayer) && myMap.hasLayer(doorLayer)) {

        alert("Mahalle Katmanını ya da Kapı Katmanını Seçiniz");
    }

    else {

        if (myMap.hasLayer(districtLayer)) {

            var value = e.latlng;

            var marker = L.marker([value.lat, value.lng]).addTo(districtLayer);

            console.log(value.lat + "-" + value.lng);

            //temp_polygon.push(e.latlng.lat.toString() + "," + e.latlng.lng.toString());

            temp_polygon.push(e.latlng);

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

    districtObjects = [];

    $.ajax({

        url: '/Home/SelectDistrictData',
        type: 'get',
        dataType: 'json',
        success: function (data) {

            var districts = data;

            for (var i = 0; i < districts.length; i++) {

                var coordinates = districts[i].Coordinates.toString().split(',');

                var pairCoordinates = [];

                for (var j = 0; j < coordinates.length - 1; j++) {

                    if (j % 2 == 0) {

                        var x = parseFloat(coordinates[j]);
                        var y = parseFloat(coordinates[j + 1]);

                        pairCoordinates.push([x, y]);
                        //L.marker([x, y]).addTo(districtLayer);
                    }

                }

                var polygon = L.polygon(pairCoordinates, { color: 'red' })
                    .addTo(districtLayer)
                    .bindPopup("<div>Mahalle Adı: " + districts[i].Name + "</div>");

                all_polygons.push(pairCoordinates);

                districtObjects.push({

                    Id: districts[i].Id,

                    Name: districts[i].Name,

                    Coordinates: pairCoordinates

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

    doorObjects = [];

    $.ajax({

        url: '/Home/SelectDoorData',
        type: 'get',
        dataType: 'json',
        success: function (data) {

            var doors = data;

            for (var i = 0; i < doors.length; i++) {

                var coordinate = L.latLng(parseFloat(doors[i].Coordinate.toString().split(',')[0]), parseFloat(doors[i].Coordinate.toString().split(',')[1]));

                points.push(coordinate);

                //console.log(districtObjects.find(({ Id }) => Id == doorObjects[i].MahalleId).Id);
                
                L.marker(coordinate).addTo(doorLayer).bindPopup('<div>Kapı No: ' + doors[i].DoorNo + ' </div><div>Mahalle Adı: '+doors[i].DistrictName+'</div>'); //  </div><div>Mahalle Adı: ' + districtObjects.find(({ Id }) => Id == doorObjects[i].MahalleId).Id +'</div>');

                doorObjects.push({

                    Id: doors[i].Id,

                    DoorNo: doors[i].DoorNo,

                    DistrictId: doors[i].DistrictId,

                    DistrictName: doors[i].DistrictName,

                    Coordinate: [coordinate.lat, coordinate.lng]
                });

            }
        },

        error: function (xhr, ajaxOptions, thrownError) {
        

            //alert(errorMessage.Message);
            
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

    for (var i = 0; i < temp_polygon.length; i++) {
        coordinates.push(temp_polygon[i].lat);
        coordinates.push(temp_polygon[i].lng);
    }

    var data = {
        Name: $('#districtName').val(),
        Coordinates: coordinates.toString()
    };

    $.ajax({

        type: 'post',
        url: '/Home/SaveDistrictData',
        dataType: 'json',
        data: data,
        success: function (returnData) {

            getDistrictData();

            myMap.closePopup();
            polygons.push(temp_polygon);

            var polygon = L.polygon(temp_polygon, { color: 'red' }).addTo(districtLayer);

            all_polygons.push(temp_polygon);

            temp_polygon = [];

        },
        error: function (xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Ajax request failed' + xhr.responseText;
            alert(errorMsg);
        }

    });

}

function saveDoorData() {

    var districtId;

    var hasIntersection = false;

    // Intersection Control
    for (var i = 0; i < districtObjects.length; i++) {

        var dummyBoundry = L.latLngBounds(districtObjects[i].Coordinates);

        if (dummyBoundry.contains(temp_point) == true) {

            districtId = districtObjects[i].Id;

            hasIntersection = true;

            break;
        }
    }

    if (hasIntersection) {

        var data = {

            DoorNo: $('#doorNo').val(),

            DistrictId: districtId,

            coordinate: temp_point.lat + "," + temp_point.lng
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

    else {

        alert("Kapı, herhangi bir mahalle içerisinde değil.");

        clearDoorData();

    }
    
}

function clearDistrictData() {

    temp_polygon = [];
    polygon = [];
    districtLayer.clearLayers();
    myMap.closePopup();

    for (var i = 0; i < all_polygons.length; i++) {

        var p = L.polygon(all_polygons[i], { color: 'red' }).addTo(districtLayer);
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

    for (var i = 0; i < districtObjects.length; i++) {

        $("#districtTable tbody").append('<tr><th scope="row">' + (i + 1) + '</th>'
            + '<td>' + districtObjects[i].Name + '</td>'
            + '<td><button id=\'btn' + (i + 1) + '\'class="btn btn-primary" onclick= "zoomToDistrict(' + i + ')">Mahalleyi Göster</button></td> </tr>');

    }

    $("#doorTable tbody").empty();

    for (var i = 0; i < doorObjects.length; i++) {

        $("#doorTable tbody").append('<tr><th scope="row">' + (i + 1) + '</th>'
            + '<td>' + doorObjects[i].DoorNo + '</td>' + '<td>' + doorObjects[i].DistrictName + '</td>'
            + '<td><button class = "btn btn-primary" onclick= "zoomToDoor(' + i + ')">Kapı Göster</button></td></tr>');

    }
    
    $("#lists").toggle();
    
});

function zoomToDistrict(index) {

    var polygon = L.polygon(districtObjects[index].Coordinates);

    myMap.fitBounds(polygon.getBounds());

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function zoomToDoor(index) {

    myMap.setView(doorObjects[index].Coordinate, 18);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

$("#view").click(function () {

    $(this).parent().addClass('focus active');

    $("#addDistrict").parent().attr('class','btn btn-success');

    $("#addDoor").parent().attr('class', 'btn btn-success');

    myMap.on('contextmenu', function (e) { });

});

$("#addDistrict").click(function () {

    $(this).parent().addClass('focus active');

    $("#view").parent().attr('class', 'btn btn-success');

    $("#addDoor").parent().attr('class', 'btn btn-success');

    myMap.on('click', districtClick);

    myMap.on('contextmenu', districtContextMenu);

});

$("#addDoor").click(function () {

    $(this).parent().addClass('focus active');

    $("#view").parent().attr('class', 'btn btn-success');

    $("#addDistrict").parent().attr('class', 'btn btn-success');

    myMap.on('click', doorClick);

    myMap.on('contextmenu', doorContextMenu);

});



