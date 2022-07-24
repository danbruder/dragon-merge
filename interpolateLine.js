import "leaflet/dist/leaflet.js"
import "leaflet-geometryutil/src/leaflet.geometryutil"

export function interpolate(map, latlngArray, times){

    const interpolatedLatLngs = [...latlngArray]

    var addedPoints = []

    // get interpolated points, push to arr addedPoints
    for (let i = 0; i < interpolatedLatLngs.length; i++){

        var nextPointIndex = i === interpolatedLatLngs.length - 1 ? 0 : i + 1
        var currentPoint = interpolatedLatLngs[i]
        var nextPoint = interpolatedLatLngs[nextPointIndex]

        var addedPoint = {
            index: i,
            point: L.GeometryUtil.interpolateOnLine(map, [currentPoint, nextPoint], 0.5).latLng
        }

        addedPoints.push(addedPoint)
    }

    // loop through arr addedPoints, fold points into array at appropriate place 
    // (their own index + the index of their preceeding point + 1)
    for (let i = 0; i < addedPoints.length; i++){
        interpolatedLatLngs.splice( addedPoints[i].index + i + 1, 0, addedPoints[i].point)
    }

    if(times > 0) { 
        return interpolate(map, interpolatedLatLngs, times - 1)
    } else { 
        return interpolatedLatLngs
    }
}
