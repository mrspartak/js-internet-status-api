const url = require('url');
const net = require('net');
const Promise = require('bluebird');
const http = require('http')
const fsPromise = require('fs').promises

const INTERVAL = +process.env.INTERVAL * 1000 || 10000;
const PORT = +process.env.PORT || 3010;

const CHECK_WEBSITE = process.env.CHECK_WEBSITE || 'https://google.com';
const CHECK_TIMEOUT = +process.env.CHECK_TIMEOUT * 1000 || 5000;
const CHECK_RETRIES = +process.env.CHECK_RETRIES || 2;

//hours
const RELEVANCE_TIMEOUT = +process.env.RELEVANCE_TIMEOUT * 60 * 60 || 24 * 60 * 60;

console.log('APP_CONFIG', {
	INTERVAL,
	PORT,
	CHECK_WEBSITE,
	CHECK_TIMEOUT,
	CHECK_RETRIES,
	RELEVANCE_TIMEOUT
})

Promise.config({
	cancellation: true
});

let dataFile = './data/state.json'

let CONNECTIONS_LOST = [], lastStatus, currentStatus, startTs, finishTs

;(async () => {
	let state = await getState()
	if(state && state.success) 
		({CONNECTIONS_LOST, lastStatus, currentStatus, startTs, finishTs} = state)
})()

let saveCounter = 0
setInterval(async () => {
	saveCounter++
	let connected = await check()
	connected = connected === false ? false : true
	currentStatus = connected === false ? false : true

	if(lastStatus !== connected) {
		lastStatus = connected
		
		//become disabled
		if(connected === false) {
			console.log('CONNECTION LOST')
			startTs = now()
			await saveState()
		} else if(startTs) {
			console.log('CONNECTED')
			finishTs = now()

			CONNECTIONS_LOST.push({
				start: startTs,
				finish: finishTs,
				duration: finishTs - startTs
			})
			await saveState()
		}
	}
	await saveState()
	if(saveCounter * INTERVAL >= 60 * 1000) {
		await saveState()
	}
}, INTERVAL)


const server = http.createServer((request, response) => {
	if(request.url == '/') {
		response.end(JSON.stringify({
			success: true,
			currentStatus,
			lastTs: (startTs ? now() - startTs : false),
			archive: CONNECTIONS_LOST
		}))
	} else {
		response.end('')
	}    
})

server.listen(PORT, (err) => {
	if (err) return console.log('something bad happened', err.message)
	console.log(`server is listening on ${PORT}`)
})

async function getState() {
	try {
		let data = await fsPromise.readFile(dataFile)
		return JSON.parse(data)
	} catch(ex) {
		return {}
	}
}

async function saveState() {
	saveCounter = 0

	CONNECTIONS_LOST = CONNECTIONS_LOST.filter(data => data.start > now() - RELEVANCE_TIMEOUT)
	await fsPromise.writeFile(dataFile, JSON.stringify({success:true, CONNECTIONS_LOST, lastStatus, currentStatus, startTs, finishTs}))
}

function now() {
	return parseInt((new Date().getTime())/1000)
}

async function check() {
	try {
		return await checkInternetConnected({
			timeout: CHECK_TIMEOUT,
			retries: CHECK_RETRIES,
			domain: CHECK_WEBSITE
		})
	} catch(ex) {
		return false
	}
}

async function checkInternetConnected (config = {}) {
	const {timeout = 5000, retries = 5, domain = 'https://apple.com'} = config;
	const urlInfo = url.parse(domain);
	if (urlInfo.port === null) {
		if (urlInfo.protocol === 'ftp:') {
			urlInfo.port = '21';
		} else if (urlInfo.protocol === 'http:') {
			urlInfo.port = '80';
		} else if (urlInfo.protocol === 'https:') {
			urlInfo.port = '443';
		}
	}
	const defaultPort = Number.parseInt(urlInfo.port || '80');
	const hostname = urlInfo.hostname || urlInfo.pathname;

	for (let i = 0; i < retries; i++) {
		const connectPromise = new Promise(function (resolve, reject, onCancel) {

			const client = new net.Socket();
			client.connect({ port: defaultPort, host: hostname }, () => {
				client.destroy();
				resolve(true);
			});
			client.on('data', (data) => {
			});
			client.on('error', (err) => {
				client.destroy();
				reject(err);
			});
			client.on('close', () => {
			});

			onCancel(() => {
				client.destroy();
			});
		});

		try {
			await connectPromise.timeout(timeout);
		} catch (ex) {
			if (i === (retries - 1)) {
				throw ex;
			}
		}
	}
}