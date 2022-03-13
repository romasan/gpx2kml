#!/usr/bin/env node
const gpxParser = require('gpxparser');
const tokml = require('tokml');

function convert (gpxtext) {
    const gpx = new gpxParser();
    gpx.parse(gpxtext);
    const geoJSON = gpx.toGeoJSON();
    let xml = tokml(geoJSON);
    xml = xml.replace(/\[object Object\]/ig, '');
    const format = require('xml-formatter');
    return format(xml, { indentation: ' ' });
}

function write (text, file) {
    if (file) {
        eval('require')('fs').writeFileSync(file, text)
    } else {
        process.stdout.write(text);
    }
}

if ((typeof process !== 'undefined') && (process.release && process.release.name === 'node')) {
    const yargs = require('yargs/yargs');
    const hideBin = require('yargs/helpers').hideBin
    const argv = yargs(hideBin(process.argv)).argv;
    const file = argv._ && argv._[0];
    const multiple = argv._.length > 1;
    if (multiple) {
        for (const file of argv._) {
            if (file && eval('require')('fs').existsSync(file)) {
                const outputName = file.replace(/.gpx$/, '') + '.kml';
                const text = eval('require')('fs').readFileSync(file, { encoding: 'utf-8'});
                const output = convert(text);
                write(output, outputName);
            }
        }
    } else if (file && eval('require')('fs').existsSync(file)) {
        const text = eval('require')('fs').readFileSync(file, { encoding: 'utf-8'});
        const output = convert(text);
        write(output, argv.o);
    } else {
        const proc = process.stdin.on('readable', () => {
            let text = '';
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                text += chunk.toString();
            }
            if (text) {
                const output = convert(text);
                write(output, argv.o);
                process.exit(proc.fd);
            }
        });
    }

} else {
    module.exports = convert;
}
