
var doorLayer = L.layerGroup();

var districtLayer = L.layerGroup();

var all_polygons = []

//var polygons = [];

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
    layers: [googleMaps, doorLayer, districtLayer],
    
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

myMap.on('click', clickOnMap);

myMap.on('contextmenu', contextMenu);

function getData() {

    getDistrictData();

    getDoorData();

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
        
            var errorMsg = 'Ajax request failed' + xhr.responseText;
            alert(errorMsg);
          
        }
    })
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
            
            //temp_polygon = [];

            all_polygons = [];

            getDistrictData();

            myMap.closePopup();
            
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
    
    doorLayer.clearLayers();
    myMap.closePopup();

    for (var i = 0; i < points.length; i++) {

        L.marker(points[i]).addTo(doorLayer);
    }

}

function zoomToDistrict(index) {

    var polygon = L.polygon(districtObjects[index].Coordinates);

    myMap.fitBounds(polygon.getBounds());

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function zoomToDoor(index) {

    myMap.setView(doorObjects[index].Coordinate, 18);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clickOnMap(e) {

    if ($("#addDistrict").parent().hasClass("active")) {

        var value = e.latlng;

        var marker = L.marker([value.lat, value.lng]).addTo(districtLayer);
        
        temp_polygon.push(e.latlng);
    }

    else if ($("#addDoor").parent().hasClass("active")) {

        doorLayer.clearLayers();

        for (var i = 0; i < points.length; i++) {
            var marker = L.marker(points[i]).addTo(doorLayer);
        }

        var value = e.latlng;
        
        var marker = L.marker(value).addTo(doorLayer);

        console.log(value.lat + "-" + value.lng);

        temp_point = e.latlng;
    }

}

function contextMenu(e) {

    if ($("#addDistrict").parent().hasClass("active")) {

        popup.setLatLng(e.latlng)
            .setContent("<div>Mahalle adı: <input type=\"text\" id=\"districtName\"> " +
                "<button id=\"saveDistrict\" onclick=\"saveDistrictData()\">Mahalle Kaydet</button> " +
                "<button id = \"clear\" onclick=\"clearDistrictData()\" > Sil</button ></div>")
            .openOn(myMap);
    }
    
    else if ($("#addDoor").parent().hasClass("active")) {

        popup.setLatLng(e.latlng)
            .setContent("<div>Kapı no: <input type=\"text\" id=\"doorNo\"><br>" +
                "<button id=\"saveDoor\" onclick=\"saveDoorData()\">Kapı No Kaydet</button>" +
                " <button id = \"clear\" onclick=\"clearDoorData()\" > Sil</button ></div>")
            .openOn(myMap);
        
    }
    
}

function showDoors(index) {

    $("#doors").empty();

    var doors = [];

    for (var i = 0; i < doorObjects.length; i++) {

        if (districtObjects[index].Id == doorObjects[i].DistrictId) {
            doors.push(doorObjects[i]);
        }
    }
    
    for (var i = 0; i < doors.length; i++) {

        $("#doors").append('<li class="list-group-item list-group-item-action">'
            + '<div class="row">'
                + '<div class="col-2">' + (i + 1) + '</div>'
                + '<div class="col-2">' + doors[i].DoorNo + '</div>'
                + '<div class="col-3">' + doors[i].DistrictName + '</div>'
                + '<div class="col-5"><button id=\'btn' + (i + 1) + '\'class="btn btn-primary" onclick= "zoomToDoor(' + i + ')">Kapıyı Göster</button></div>'
            + '</div>'
            + '</li>');
    }
}

$("#queryAdres").on("click", function () {

    $("#districts").empty();

    $("#doors").empty();

    for (var i = 0; i < districtObjects.length; i++) {

        $("#districts").append('<li class="list-group-item list-group-item-action" onclick=\'showDoors(' + i + ')\'>'
            + '<div class="row">'
                + '<div class="col-2">' + (i + 1) + '</div>'
                + '<div class="col-5">' + districtObjects[i].Name + '</div>'
                + '<div class="col-5"><button id=\'btn' + (i + 1) + '\'class="btn btn-primary" onclick= "zoomToDistrict(' + i + ')">Mahalleyi Göster</button></div>'
            + '</div>'
            + '</li>')

    }
    
    $("#lists").toggle();

});

$("#view").click(function () {

    $(this).parent().addClass('focus active');

    $("#addDistrict").parent().attr('class', 'btn btn-success');

    $("#addDoor").parent().attr('class', 'btn btn-success');

});

$("#addDistrict").click(function () {

    $(this).parent().addClass('focus active');

    $("#view").parent().attr('class', 'btn btn-success');

    $("#addDoor").parent().attr('class', 'btn btn-success');

});

$("#addDoor").click(function () {

    $(this).parent().addClass('focus active');

    $("#view").parent().attr('class', 'btn btn-success');

    $("#addDistrict").parent().attr('class', 'btn btn-success');

});
