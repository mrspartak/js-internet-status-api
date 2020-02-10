# js-internet-status-api
Return JSON with current status and disconnects history

[![Docker Cloud Automated build](https://img.shields.io/docker/cloud/automated/assorium/js-internet-status-api?style=for-the-badge "Docker Cloud Automated build")](https://hub.docker.com/r/assorium/js-internet-status-api "Docker Cloud Automated build")
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/assorium/js-internet-status-api?style=for-the-badge "Docker Cloud Build Status")](https://hub.docker.com/r/assorium/js-internet-status-api "Docker Cloud Build Status")
[![Docker Pulls](https://img.shields.io/docker/pulls/assorium/js-internet-status-api?style=for-the-badge "Docker Pulls")](https://hub.docker.com/r/assorium/js-internet-status-api "Docker Pulls")  <br/>

[![Latest Github tag](https://img.shields.io/github/v/tag/mrspartak/js-internet-status-api?sort=date&style=for-the-badge "Latest Github tag")](https://github.com/mrspartak/js-internet-status-api/releases "Latest Github tag")


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

    #just GET / request