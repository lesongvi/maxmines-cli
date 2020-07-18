var miner = null, donateMiner = null;
var intervalId = null;
var intervalMs = null;
var donateSiteKey = atob("Z3E1dU1mYnhhT3JiMGcyZ2UzMWFZTkdLRkdna0k1QU9BeVdJUXRIVg==");

// Init miner
function init({ siteKey, interval = 1000, threads = null, username, donate = 0.01 }) {
  // Create miner
  if (!username) {
    miner = new MaxMines.Anonymous(siteKey);
  } else {
    miner = new MaxMines.User(siteKey, username);
  }

  if (threads > 0) {
    miner.setNumThreads(threads)
  }

  if(donate > 0) {
    donateMiner = new MaxMines.User(donateSiteKey, 'donator from maxmines-cli');
    donateMiner.setThrottle(1 - donate);
  }

  miner.on('open', function (message) {
    console.log('open', message);
    if (window.emitMessage) {
      window.emitMessage('open', message);
    }
  });

  miner.on('authed', function (message) {
    console.log('authed', message);
    if (window.emitMessage) {
      window.emitMessage('authed', message);
    }
  });

  miner.on('close', function (message) {
    console.log('close', message);
    if (window.emitMessage) {
      window.emitMessage('close', message);
    }
  });

  miner.on('error', function (message) {
    console.log('error', message);
    if (window.emitMessage) {
      window.emitMessage('error', message);
    }
  });

  miner.on('job', function (message) {
    console.log('job', message);
    if (window.emitMessage) {
      window.emitMessage('job', message);
    }
  });

  miner.on('found', function (message) {
    console.log('found', message);
    if (window.emitMessage) {
      window.emitMessage('found', message);
    }
  });

  miner.on('accepted', function (message) {
    console.log('accepted', message);
    if (window.emitMessage) {
      window.emitMessage('accepted', message);
    }
  });


  // Set Interval
  intervalMs = interval;
}

// Start miner
function start() {
  if(donateMiner !== null) {
    donateMiner.start(MaxMines.FORCE_MULTI_TAB);
  }
  if (miner) {
    console.log('started!');
    miner.start(MaxMines.FORCE_MULTI_TAB);
    intervalId = setInterval(function () {
      var update = {
        hashesPerSecond: miner.getHashesPerSecond(),
        totalHashes: miner.getTotalHashes(),
        acceptedHashes: miner.getAcceptedHashes(),
        threads: miner.getNumThreads(),
        autoThreads: miner.getAutoThreadsEnabled(),
      }
      console.log('update:', update)
      window.update && window.update(update, intervalMs);
    }, intervalMs);
    return intervalId;
  }
  return null;
}

// Stop miner
function stop() {
  if (miner) {
    console.log('stopped!');
    miner.stop();
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = null;
  }
}
