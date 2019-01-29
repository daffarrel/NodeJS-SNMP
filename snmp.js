#!/usr/bin/env node

// The snmp object is the main entry point to the library.
var snmp = require('snmp-native');
var util = require('util');
var request= require('request')

var host = '127.0.0.1';
var community = 'public';

//Endpoint to push
var url=' ';

//Specify the intervals in minutes.
var interval=0.05;


setInterval(snmpGet, interval*60*1000);

function snmpGet(){

//Specify the OIDs
var oids = ['.1.3.6.1.2.1.2.2.1.5.2','.1.3.6.1.4.1.2021.4.6.0'];
var data=[];

// A session is required to communicate with an agent.
var session = new snmp.Session({ host: host, community: community });
session.getAll({ oids: oids }, function (err, varbinds) {
        varbinds.forEach(function (vb) {
        console.log(vb.oid + ' = ' + vb.value);
        data.push(vb.value);
    });
    session.close();
    postData(data);
});
}


function postData(data){

//Create payload. The index of data corresponds to the index of the OIDs array.
var payload = '{"s":332,"d":{"b":'+data[0]+',"r":'+data[1]+'}}';
console.log(payload);

    var options = {
        method: 'post',
        url: url,
        headers: {"Content-Type": "application/json"},
        body: payload,
    };
    request(options, function(error, response, body) {
   if(error){
    console.log(error);
   }
else{
    console.log(body);
        }
    });


}

