var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();
var app = express();
app.use (logger('dev'));
app.use (bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:false
}));
var server = http.createServer(app);
var request = require('request');
app.get('/',(reg,res)=>
{
	res.send('home Page. Server running ok.');
});
//tao webhook
app.get('/webhook',function(req,res)
{
	if (req.query['hub.verify_token'] === 'ma_xac_minh_cua_ban'){
		res.send(req.query['hub.challenge']);
	}
	res.send('error');
});
//khi co nguoi nhan tin cho bot
app.post('/webhook',function(req,res)
{
	var entries = req.body.entry;
	for (var entry of entries){
		var messaging = entry.messaging;
		for (var message of messaging) {
			var senderID = server.sender.id;
			if (message.message){
				//if user send text
				if(message.message.text){
					var text = message.message.text;
					console.log (text);
					sendMessage(senderID,);
				}
			}
		}
	}
	res.status(200).send('OK');
});
//send info to restAPI
function sendMessage(senderID,message)
{
	request({
		url:'https://graph.facebook.com/v2.6/me/messages',
		qs:{
			access_token:'EAASwM2eZABCkBAMZB3Fmcndry60ZBPXDuTjh9MOYa5wX6Nlq2VR8GtwkMVB2Q46JHlyyGCHEGMeTZAnznGEHY0x7wreT7kI9fDZBIHavADv5RWDsM6Xr5mRYfHphszuiTL6i0clBH8GTCgDgXRaOUVMEAEYZCx0slwLvZCWyy9nOQZDZD';	
		},
		method:'post';
		json:{
				recipient:{
					id:senderID
				},
				message:{
					text:message
				}
			}

		}
	});
}
app.set('port',process.env.openshift_nodejs_port||process.env.port||3302);
app.set('ip',process.env.openshift_nodejs_ip||process.env.ip||127.0.0.1);
server.listen(app.get('port'),app.get('ip'),function(){
	console.log('chatbot listening at %s:%d', app.get('ip'),app.get('port'));
});