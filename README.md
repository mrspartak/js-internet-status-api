# js-internet-status-api
Return JSON with current status and disconnects history


## Environment variables

    #port app will be launched at
    const PORT = process.env.PORT || 3010
    #interval to check connection in seconds
    const INTERVAL = +process.env.INTERVAL * 1000 || 10000;

## API

    #just GET / request