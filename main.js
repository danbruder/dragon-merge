import L from "leaflet/dist/leaflet.js"
import "leaflet/dist/leaflet.css"; // <- Leaflet styles
import statesData from './statesData'
import {interpolate} from './interpolateLine'

var map = L.map('map').setView([37.8, -96], 4);

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.geoJson(statesData, { 
    style: function(feature) { 
        return { color: '#b0c4de', fill: false }
    }
}).addTo(map);

var trip_status = "NONE";
var line_state = "NONE";
var line
var first_dot 
var second_dot
var distance 

map.on("click", function(evt) { 
    if (line_state == "NONE") { 
        var marker = L.circleMarker(evt.latlng, {
            radius:8, 
            color: "orange",
            fill: true
        })
        marker.addTo(map)
        first_dot = marker
        line_state = "FIRST_DOT"
        if (dragon) { 
            map.removeLayer(dragon)
            dragon = null
        }

    } else if (line_state == "FIRST_DOT") { 
        var marker = L.circleMarker(evt.latlng, {
            radius:8, 
            color: "orange",
            fill: true
        })
        marker.addTo(map)
        second_dot = marker

        var polyline = L.polyline([
            first_dot.getLatLng(),
            second_dot.getLatLng(),
        ], {color: 'orange', weight: 5}).addTo(map);

        distance =( map.distance(
            first_dot.getLatLng(),
            second_dot.getLatLng(),
        ) / 1000).toFixed(2)
        $("#distance-val").html(`${distance} km`)

        if (line) { 
            map.removeLayer(line)
        }
        if (first_dot) { 
            map.removeLayer(first_dot)
        }
        if (second_dot) { 
            map.removeLayer(second_dot)
        }
        line = polyline
        line_state = "NONE"
    }
});

var kph = 0
var range = $("#range")
range.change(function(evt) { 
    var val = evt.target.value
    kph = val
    $("#range-val").html(`${val} kph`)
})

var dragon

$("#start").click(function() { 
    if (!line) { 
        return
    }

    if (dragon) { 
        map.removeLayer(dragon)
        dragon = null
    }

    // UI state
    $("#start").html("Here' we go!")
    $("#start").attr("disabled")
    $("#start").addClass("bg-gray-500")

    var many = interpolate(map, line.getLatLngs(), 5)
    var marker = L.circleMarker(many[0], {
        radius: 10, 
        color: "green",
        fill: true
    })
    marker.addTo(map)
    dragon = marker

    var i = 0
    var clear = setInterval(function() { 
        if (i < many.length / 2) { 
            marker.setLatLng(many[i])
            line.setLatLngs([many[0], many[i]])
            i++
        } else { 
            clearInterval(clear)

            $("#start").removeAttr("disabled")
            $("#start").removeClass("bg-gray-500")
            $("#start").text("Start")

        }
    }, 50)
})
