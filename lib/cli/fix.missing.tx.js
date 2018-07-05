'use strict';
const bcoin = require('bcoin');


function getBcoinConfig(params) {
    const network = params.network;
    const port = params.port;
    const prefix = params.prefix;

    if (!network || !port || !prefix) {
        throw new Error("Params not valid")
    }

    const config = {
        db: 'leveldb',
        checkpoints: true,
        network: network,
        listen: true,
        logConsole: true,
        logLevel: 'info',
        port: port,
        persistent: true,
        workers: true,
        memory: false,
        prefix: prefix
    };
    return config;
}

async function stopBcoin(node) {
    await node.stopSync();
    await node.disconnect();
}


async function startBcoin(node) {
    await node.open();
    await node.connect();
}

async function fixTx(txid, params) {
    const bcoinConfig = getBcoinConfig(params);
    const node = new bcoin.FullNode(bcoinConfig);

    await startBcoin(node);
    const tx = await node.getTX(txid);
    await stopBcoin(node);
    if (!tx) {
        throw new Error(`TX with txid ${txid} not found`);
    } else {
        console.log(tx);
    }
}

module.exports = {
    fixTx: fixTx
};