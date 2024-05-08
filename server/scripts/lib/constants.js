const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../../../');
const CORE_DIR = path.resolve(ROOT_DIR, './core');
const SERVER_DIR = path.resolve(ROOT_DIR, './app/server');
const CLIENT_DIR = path.resolve(ROOT_DIR, './app/client');

const CORE_PACKAGE_JSON = path.resolve(CORE_DIR, 'package.json');
const SERVER_PACKAGE_JSON = path.resolve(SERVER_DIR, 'package.json');
const CLIENT_PACKAGE_JSON = path.resolve(CLIENT_DIR, 'package.json');

module.exports = {
    ROOT_DIR, 
    CORE_DIR, SERVER_DIR, CLIENT_DIR,
    CORE_PACKAGE_JSON, SERVER_PACKAGE_JSON, CLIENT_PACKAGE_JSON
}