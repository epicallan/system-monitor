## System admin currently checking whether various apps are up

### How to get set up
1. Clone the repo <br>
2. Add the domains you would like to [monitor](https://github.com/epicallan/system-monitor/blob/master/src/configs/domains.js) <br>
2. Install the NPM dependencies by `npm install`<br>
5. Finally, run `npm start` or start up the app as a (docker)[https://github.com/epicallan/system-monitor/blob/master/Dockerfile] container

## Tips
- visit the localhost:7000/status route to see current state of the domains.
- On App start a function is started that checks for app status every after 10 mins

## TODO
- create proper views for the various api endpoints -- currently only one localhost:7000/status

@ MIT LICENSED
