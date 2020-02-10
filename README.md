# js-internet-status-api
Return JSON with current status and disconnects history

[![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/assorium/js-internet-status-api?style=for-the-badge "Docker Cloud Automated build")](https://hub.docker.com/r/assorium/js-internet-status-api "Docker Cloud Automated build")
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/assorium/js-internet-status-api?style=for-the-badge "Docker Cloud Build Status")](https://hub.docker.com/r/assorium/js-internet-status-api "Docker Cloud Build Status")
[![Docker Pulls](https://img.shields.io/docker/pulls/assorium/js-internet-status-api?style=for-the-badge "Docker Pulls")](https://hub.docker.com/r/assorium/js-internet-status-api "Docker Pulls")  <br/>

[![Latest Github tag](https://img.shields.io/github/v/tag/mrspartak/js-internet-status-api?sort=date&style=for-the-badge "Latest Github tag")](https://github.com/mrspartak/js-internet-status-api/releases "Latest Github tag")

## Docker run
Run with defaults
```
docker run -p 3010:3010 --name internet-check \
  -v internet-check:/home/node/app/data \
  assorium/js-internet-status-api:latest
```
Or use environment variables
```
docker run -p 3010:3010 --name internet-check \
  -v internet-check:/home/node/app/data \
  -e CHECK_WEBSITE=https://example.com -e RELEVANCE_TIMEOUT=1 \
  assorium/js-internet-status-api:latest
```

## Environment variables

    #port app will be launched at
    const PORT = process.env.PORT || 3010
    
    #interval to check connection in seconds
    const INTERVAL = +process.env.INTERVAL * 1000 || 10000;
    
    #website to check connection
    const CHECK_WEBSITE = process.env.CHECK_WEBSITE || 'https://google.com';
    #timeout in seconds
    const CHECK_TIMEOUT = +process.env.CHECK_TIMEOUT * 1000 || 5000;
    #retries
    const CHECK_RETRIES = +process.env.CHECK_RETRIES || 2;
    
    #this time in hours data will be stored
    const RELEVANCE_TIMEOUT = +process.env.RELEVANCE_TIMEOUT * 60 * 60 || 24 * 60 * 60;

## API

JSON API | GET /
```
{
	success: true,
	serverTS: 1581347597,
	currentStatus: true, //current connections status: true|false
	lastTs: 4861, //last disconnect seconds ago
	archive: [ //history of disconnects
		{
			start: 1581342736,
			finish: 1581342756,
			duration: 20
		}
	]
}
```

Graphs | GET /graph.html
![image](https://user-images.githubusercontent.com/993910/74189670-e6722380-4c61-11ea-9b8e-c8860138f95c.png)
