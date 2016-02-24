var Download = require('download');
var nudity = require('nudity');
var fs = require('fs');


String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

function VNudity(url, cfg, callback) {
	var pathNewVideo = cfg.storage + url.hashCode() + '.mp4';
	self = this;
	this.counter = 0;
	this.url = url;
	this.nSeconds = cfg.nSeconds;
	this.callback = callback;
	this.pathNewVideo = pathNewVideo;
	this.newName = url.hashCode();
	this.folderVideo = cfg.storage;
	this.capturesPath = cfg.storage + this.newName + '.vidcap/';

	new Download({mode: '755'})
	    .get(url)
	    .rename(url.hashCode() + '.mp4')
	    .dest(cfg.storage)
	    .run(function(err, files){
	    	if (err) {return console.log(err);}
	    	self.processVideo();
	    	
	    });
};

module.exports = VNudity;

VNudity.prototype.processVideo = function (){
	var self = this; 
	var exec = require('child_process').exec;
	console.log()
	var cmd = 'vidcap -i ' +  self.nSeconds + ' ' + self.pathNewVideo;
	exec(cmd, {cwd:this.folderVideo} ,function(err, stdout, stderr){
		if (err) {return console.log(err);}
		self.processCaptures();
	});
	//return this;
};

VNudity.prototype.processCaptures = function () {
	var self = this;
	fs.readdir(self.capturesPath, function(err, items) {
	    if (err) {return console.log(err);}
	    var numCaptures = items.length;
	    self.numCaptures = numCaptures;
	  	items.forEach(function(item, i){
			nudity.scanFile(self.capturesPath + item, function(err, res){
				if (err) {return console.log(err);}
				self.endProcess(item, i, res);
			});
	  	});
	});
}



VNudity.prototype.endProcess = function(item, i, res) {
							  	
  	if (res) {this.counter++;}
  	fs.unlink(this.capturesPath + item, function(err) {//delete each file
	    if (err) { return console.error(err);}
	});
  	if (i==(this.numCaptures-1))
	{	
		fs.rmdirSync(this.capturesPath); //delete captures path
		fs.unlink(this.pathNewVideo, function(err) { //delete video
		    if (err) { return console.error(err);}
		});
		var percent = (100*this.counter)/this.numCaptures;
			res = (percent>35 ? true:false);
		var err;
		if (percent>100 || percent<0) {err="Percent error, verify path captures"}
		this.callback(err, res);
	}
};

