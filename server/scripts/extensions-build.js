// const { SERVER_DIR } = require('./lib/constants');
// const path = require('path');
// const glob = require('glob');
// const editJsonFile = require('edit-json-file');
// const { exec } = require('child_process');

// async function main() {
//     const EXTENSIONS_DIR = path.resolve(SERVER_DIR, './storage/extensions');

//     const filepaths = glob.globSync('*/package.json', { cwd: EXTENSIONS_DIR, absolute: true });
//     await Promise.all(filepaths.map(filepath => {
//         const file = editJsonFile(filepath);
//         const name = file.get('name');
//         console.log(`Building extension '${name}'...`);

//         exec('yarn build', { cwd: path.dirname(filepath) }, (err, stdout, stderr) => {
//             process.stdout.push(stderr);
//             process.stdout.push(stdout);
//             console.log(err);
//         })
//     }))
// }

// main();
