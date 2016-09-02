## System admin app currently checking whether various apps are up

### How to get set up
1. Clone the repo <br>
2. Add the domains you would like to [monitor](https://github.com/epicallan/system-monitor/blob/master/src/configs/domains.js) <br>
3. Rename the [config.example.js](https://github.com/epicallan/system-monitor/blob/master/src/configs/config.example.js)  file to config.js and put the right email credentials.
<br>Incase emails arent coming through check your gmail settings.<br>
4. Install the NPM dependencies by `npm install`<br>
5. Finally, run `npm start` or start up the app as a [docker](https://github.com/epicallan/system-monitor/blob/master/Dockerfile) container

## Docker setup

```
$ // cd into app root and run
$ docker build -t system-monitor .
$ docker run -p 7000:7000  -v /home/user/system-monitor/src/configs:/src/src/configs \
 --name system-app -d  system-monitor
```
The config folder is set up as a volume so that any changes e.g addition of a new domain to the domains.js file can cause the app to restart

## Tips
- visit the localhost:7000/status route to see current state of the domains.
- On App start a function is started that checks for app status every after 10 mins

## TODO
- create proper views for the various api endpoints -- currently only one localhost:7000/status

@ MIT LICENSED
