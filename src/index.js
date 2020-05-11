const ss = require('./simplesocks5')
const process = require('process')

const args = process.argv;

let host = undefined;
let port = 1080;
let flag = '';

function showHelp() {
    console.log("simplesocks5: A simply socks5 proxy server.");
    console.log("Args help:");
    console.log("\thost <host>  bind to host, default is 0.0.0.0");
    console.log("\tport <port>  listen port, default is 1080");
    console.log("\thelp         show this help");
}

// Parse args
for (idx in args) {
    const arg = args[idx];
    if (arg == 'host') {
        flag = 'host';
    } else if (arg == 'port') {
        flag = 'port'
    } else if (flag == 'host') {
        host = arg;
        flag = '';
    } else if (flag == 'port') {
        port = parseInt(arg);
        flag = '';
    } else if (arg == 'help' || arg == '-h' || arg == '--help') {
        showHelp();
        process.exit(0);
    }
}

ss.start(port, host);