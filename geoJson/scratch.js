let database = [];
let temp = [];
let newLogbook = [];
let json = [];
function apcodes() {
    const url = "https://pkgstore.datahub.io/core/airport-codes/airport-codes_json/data/9ca22195b4c64a562a0a8be8d133e700/airport-codes_json.json";
    $.getJSON(url, function (data) {
        database = data;
        for (let i = 0; i < database.length; i++) {
            database[i].coordinates = database[i].coordinates.split(',');
        }
    });
}
apcodes();
function get(logbook) {
    read(logbook[0])
}
function read(logbook) {
    let reader = new FileReader();
    reader.readAsText(logbook);
    reader.onload = convert;
}
function convert(e) {
    let book = [];
    book.push(e.target.result.split(/\n/));
    for (let i = 0; i < book[0].length; i++) {
        temp.push(book[0][i].split(','));
    }
    for (let j = 0; j < temp.length; j++) {
        if (temp[j][0] === "Flights Table") {
            temp = temp.slice(j + 1);
        };
    }
    run();
}
function run() {
    let hold;
    for (let i = 1; i < temp.length; i++) {
        let line = temp[i];
        if (line[2] !== '' && line[2] !== undefined) {
            for (let j = 0; j < database.length; j++) {
                if (line[2] === database[j].ident) {
                    line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))]);
                }
                else if (line[2].length < 4) {
                    hold = 'K' + line[2];
                    if (hold === database[j].ident) {
                        line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))]);
                    }
                }
            }
        }
        if (line[4] !== '' && line[4] !== undefined) {
            if (line[4].length > 4) {
                line[4] = line[4].split(' ');
                for (let k = 0; k < line[4].length; k++) {
                    for (let j = 0; j < database.length; j++) {
                        if (line[4][k] === database[j].ident) {
                            line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))]);
                        }
                        else if (line[4][k].length < 4) {
                            hold = 'K' + line[4][k];
                            if (hold === database[j].ident) {
                                line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))])
                            }
                        }
                        else {
                        }
                    }
                }
            }
            else {
                for (let j = 0; j < database.length; j++) {
                    if (line[4] === database[j].ident) {
                        line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))]);
                    }
                    else if (line[4].length < 4) {
                        hold = 'K' + line[4];
                        if (hold === database[j].ident) {
                            line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))])
                        }
                    }
                }
            }
        }
        if (line[3] !== '' && line[3] !== undefined) {
            for (let j = 0; j < database.length; j++) {
                if (line[3] === database[j].ident) {
                    line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))]);
                }
                else if (line[3].length < 4) {
                    hold = 'K' + line[3];
                    if (hold === database[j].ident) {
                        line.push([(Number(database[j].coordinates[0])), (Number(database[j].coordinates[1]))])
                    }
                }
            }
        }
        newLogbook.push(line)
    }
    plot();
    data();
}
function plot() {
    for (let i = 0; i < newLogbook.length; i++) {
        let lineCoords = [];
        for (let j = 52; j < newLogbook[i].length; j++) {
            lineCoords.push(newLogbook[i][j])
        }
        let tempjson = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': lineCoords
            }
        }
        json.push(tempjson)
        for (let j = 0; j < lineCoords.length; j++) {
            let apname = 'Hello'
            let temp2json = {
                'type': 'Feature',
                'properties': {
                    'description': `<strong>${apname}</strong>`
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lineCoords[j][0], lineCoords[j][1]]
                }
            }
            json.push(temp2json)
        }
    }
    map.on('dblclick', function () {
        console.log('Data Load')
        map.addSource('flights', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': json
            }
        });
        map.addLayer({
            'id': 'flights',
            'type': 'line',
            'source': 'flights',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#03d3fc',
                'line-width': 4
            }
        });
        map.addLayer({
            'id': 'airport',
            'type': 'circle',
            'source': 'flights',
            'paint': {
                'circle-radius': 8,
                'circle-color': '#3d75ad'
            },
            'filter': ['==', '$type', 'Point']
        });
    });
}
mapboxgl.accessToken = 'pk.eyJ1IjoibmhleWxhbmQiLCJhIjoiY2toZHI4ZWNqMDgwaTMwczFuNnpvcGFuMiJ9.4LH3G0a18_HQY8t55W83lg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/nheyland/ckhf1et6202dl19n6sn0o3fx8',
    center: [-95, 37],
    zoom: 3
});


// Create the data_display

function data() {
    let num_flights = newLogbook.length;
    let info = document.createElement("div");
    info.innerHTML = num_flights;
    document.getElementById('num_flights').appendChild(info)

    for( let i = 0; i<newLogbook.length; i++){
        
    }
}