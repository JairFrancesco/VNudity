# VNudity

> Node.js video nudity detector based on nude.js

## Prerequisites

```
$ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++

```


## Install


```
$ npm install --save vnudity
```


## Usage


```js
var VNudity = require('vnudity');

new VNudity('https://mme.whatsapp.net/d/kVgx2VsFi0T7z-lYvMUP0FbMlDU/AgWaWTZDB0emjOvhtPQBixCIwAZuYw0GFgFxGetvH0vb.mp4?x=2', 
	   {storage: "/tmp/", nSeconds: 1}, 
	   function (err, res){
			if (res) {console.log("Adult content");} else {console.log("for all audiences");}				
	   });

```

## API

### new VNudity(url, options, callback)

Creates a new `VNudity` instance.

#### options

Type: `object`

##### options.storage

Type: `string`
Defines the path where the video will be downloaded.


##### options.nSeconds

Type: `integer`
Set the time between capture.

