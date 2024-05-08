const { CORE_PACKAGE_JSON } = require('./lib/constants');
const editJsonFile = require('edit-json-file');

if(process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production';
}

async function main() {
    const file = editJsonFile(CORE_PACKAGE_JSON);
    const mainfile = file.get(`mains.${process.env.NODE_ENV}`);

    if(typeof mainfile !== 'string') {
        throw new Error(`No main file specified for mode '${process.env.NODE_ENV}'.`);
    }

    file.set('main', mainfile);
    file.save();
}

main();