const url = require('url');
const net = require('net');
const Promise = require('bluebird');
const http = require('http')

const INTERVAL = +process.env.INTERVAL * 1000 || 10000;
const PORT = +process.env.PORT || 3010;

Promise.config({
	cancellation: true
});

let CONNECTIONS_LOST = []

let lastStatus, currentStatus, startTs, finishTs
setInterval(async () => {
	let connected = await check()
	connected = connected === false ? false : true
	currentStatus = connected === false ? false : true

	if(lastStatus !== connected) {
		lastStatus = connected
		
		//become disabled
		if(connected === false) {
			console.log('CONNECTION LOST')
			startTs = now()
		} else if(startTs) {
			console.log('CONNECTED')
			finishTs = now()

			CONNECTIONS_LOST.push({
				start: startTs,
				finish: finishTs,
				duration: finishTs - startTs
			})
		}
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

function now() {
	return parseInt((new Date().getTime())/1000)
}

async function check() {
	try {
		return await checkInternetConnected({
			timeout: 2000,
			retries: 2
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