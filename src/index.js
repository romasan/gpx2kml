const gpxParser = require('gpxparser')
const tokml = require('tokml')

function convert (gpxtext) {
    const gpx = new gpxParser()
    gpx.parse(gpxtext)
    const geoJSON = gpx.toGeoJSON()
    let xml = tokml(geoJSON).replace(/\[object Object\]/ig, '')
    const format = require('xml-formatter')
    return format(xml, { indentation: ' ' })
}

module.exports = convert
