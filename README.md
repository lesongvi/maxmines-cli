Mine cryptocurrency [Monero (XMR)](https://getmonero.org/) using [MaxMines](https://maxmines.com/) from node.js


## Install

```
npm install
```

## Usage

```js
const MaxMines = require('maxmines');

(async () => {

  // Create miner
  const miner = await MaxMines('gq5uMfbxaOrb0g2ge31aYNGKFGgkI5AOAyWIQtHV'); // maxmines's Site Key

  // Start miner
  await miner.start();

  // Listen on events
  miner.on('found', () => console.log('Found!'))
  miner.on('accepted', () => console.log('Accepted!'))
  miner.on('update', data => console.log(`
    Hashes per second: ${data.hashesPerSecond}
    Total hashes: ${data.totalHashes}
    Accepted hashes: ${data.acceptedHashes}
  `));

  // Stop miner
  setTimeout(async () => await miner.stop(), 60000);
})();
```

## CLI

```
Usage:
cd bin
./maxmines <site-key>

<site-key>: Your MaxMines Site Key

Options:

  --username        Set a username for the miner
  --interval        Interval between updates (logs)
  --port            Port for the miner server
  --host            Host for the miner server
  --threads         Number of threads for the miner
  --proxy           Proxy socket 5/4, for example: socks5://127.0.0.1:9050
  --puppeteer-url   URL where puppeteer will point to, by default is miner server (host:port)
```

## API

- `MaxMines(siteKey[, options])`: Returns a promise of a `Miner` instance. It requires a [maxmines Site Key](https://maxmines.com/dashboard). The `options` object is optional and may contain the following properties:

  - `username`: Set a username for the miner. See [MaxMines.User](https://maxmines.com/documentation).

  - `interval`: Interval between `update` events in ms. Default is `1000`.

  - `port`: Port for the miner server. Default is `3002`.

  - `host`: Host for the miner server. Default is `localhost`.

  - `threads`: Number of threads. Default is `navigator.hardwareConcurrency` (number of CPU cores).

  - `proxy`: Puppeteer's proxy socket 5/4 (ie: `socks5://127.0.0.1:9050`).

- `miner.start()`: Connect to the pool and start mining. Returns a promise that will resolve once the miner is started.

- `miner.stop()`: Stop mining and disconnect from the pool. Returns a promise that will resolve once the miner is stopped.

- `miner.kill()`: Stop mining, disconnect from the pool, shutdown the server and close the headless browser. Returns a promise that will resolve once the miner is dead.

- `miner.on(event, callback)`: Specify a callback for an event. The event types are:

  - `update`: Informs `hashesPerSecond`, `totalHashes` and `acceptedHashes`.

  - `open`:	The connection to our mining pool was opened. Usually happens shortly after miner.start() was called.

  - `authed`:	The miner successfully authed with the mining pool and the siteKey was verified. Usually happens right after open.

  - `close`:	The connection to the pool was closed. Usually happens when miner.stop() was called.

  - `error`:	An error occured. In case of a connection error, the miner will automatically try to reconnect to the pool.

  - `job`:	A new mining job was received from the pool.

  - `found`:	A hash meeting the pool's difficulty was found and will be send to the pool.

  - `accepted`:	A hash that was sent to the pool was accepted.

- `miner.rpc(methodName, argsArray)`: This method allows you to interact with the maxmines miner instance. It returns a Promise that resolves the the value of the remote method that was called. The miner intance API can be [found here](https://maxmines.com/documentation). Here's an example:

```js
var miner = await MaxMines('PUBLIC_SITE_KEY');
await miner.rpc('isRunning'); // false
await miner.start();
await miner.rpc('isRunning'); // true
await miner.rpc('getThrottle'); // 0
await miner.rpc('setThrottle', [0.5]);
await miner.rpc('getThrottle'); // 0.5
```

## Environment Variables

All the following environment variables can be used to configure the miner from the outside:

- `MaxMines_SITE_KEY`: maxmines's Site Key

- `MaxMines_USERNAME`: Set a username to the miner. See [MaxMines.User](https://maxmines.com/documentation/miner).

- `MaxMines_INTERVAL`: The interval on which the miner reports an update

- `MaxMines_THREADS`: Number of threads

- `MaxMines_PORT`: The port that will be used to launch the server, and where puppeteer will point to

- `MaxMines_HOST`: The host that will be used to launch the server, and where puppeteer will point to

- `MaxMines_PUPPETEER_URL`: In case you don't want to point puppeteer to the local server, you can use this to make it point somewhere else where the miner is served (ie: `MaxMines_PUPPETEER_URL=http://maxmines.herokuapp.com`)

- `MaxMines_MINER_URL`: Set the MaxMines JavaScript Miner url. By defualt this is `https://maxmines.com/lib/maxmines.min.js`.

- `MaxMines_PROXY`: Puppeteer's proxy socket 5/4 (ie: `MaxMines_PROXY=socks5://127.0.0.1:9050`)

## Requisites

+ Node v8+


## Troubleshooting

#### I'm having errors on Ubuntu/Debian
Install these dependencies:

```
sudo apt-get -y install gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

