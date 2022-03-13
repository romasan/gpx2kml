const gpxParser = require('gpxparser');
const tokml = require('tokml');

function convert (gpxtext) {
    const gpx = new gpxParser();
    gpx.parse(gpxtext);
    let geoJSON = gpx.toGeoJSON();
    return tokml(geoJSON);
}

if ((typeof process !== 'undefined') && (process.release && process.release.name === 'node')) {
    const yargs = require('yargs/yargs');
    const hideBin = require('yargs/helpers').hideBin
    const argv = yargs(hideBin(process.argv)).argv;
    const file = argv._ && argv._[0];

    if (file && eval('require')('fs').existsSync(file)) {
        const text = eval('require')('fs').readFileSync(file, { encoding: 'utf-8'});
        const output = convert(text);
        if (argv.o) {
            eval('require')('fs').writeFileSync(argv.o, output)
        } else {
            process.stdout.write(output);
        }
    } else {
        const proc = process.stdin.on('readable', () => {
            let text = '';
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                text += chunk.toString();
            }
            if (text) {
                const output = convert(text);
                if (argv.o) {
                    eval('require')('fs').writeFileSync(argv.o, output)
                } else {
                    process.stdout.write(output);
                }
                process.exit(proc.fd);
            }
        });
    }

} else {
    module.exports = convert;
}
