const net = require('net');
const ss = require('socks5');

function myWrite(dst, src, data) {
    try {
        if (!dst.write(data)) {
            src.pause();
            dst.on('drain', () => src.resume());
            setTimeout(() => src.resume(), 100);
        }
    } catch (ignored) {}
}

const server = ss.createServer((socket, port, address, ready) => {
    // 记录本机地址和服务器地址
    let localstr = undefined;
    let remotestr = address + ":" + port;
    console.log("New connection to " + remotestr);
    // 和目标建立连接
    const proxy = net.createConnection({
        port: port,
        host: address
    }, ready);
    // 目标连接建立事件
    proxy.on('connect', () => {
        localstr = proxy.localAddress + ":" + proxy.localPort;
        console.log("Connected to " + remotestr + " with " + localstr);
    });
    // 数据传输事件
    proxy.on('data', data => {
        console.log("Receive %d Bytes from %s", data.length, remotestr);
        myWrite(socket, proxy, data);
    });
    socket.on('data', data => {
        console.log("Send %d Bytes to %s", data.length, remotestr);
        myWrite(proxy, socket, data);
    });
    // 连接关闭事件
    proxy.on('close', err => {
        socket.removeAllListeners('data');
        socket.end();
        console.log("Server closed the connection " + remotestr);
    });
    socket.on('close', err => {
        proxy.removeAllListeners('data');
        proxy.end();
        console.log("Client closed the connection" + remotestr);
    })
}, undefined);

server.on('error', e => {
    console.error('SERVER ERROR: %j', e);
});

function start(port, host) {
    if (!host) {
        host = "0.0.0.0"
    }
    server.listen(port, host);
}

module.exports = {
    start
}