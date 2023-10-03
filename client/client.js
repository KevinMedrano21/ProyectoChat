const net = require('net');
const router = express.Router();
const express = require('express');
const readline = require('readline-sync');
const servidor ={
    port:3000,
    host:'localhost'
}

const client = net.createConnection(servidor);

client.on('connect', ()=>{
    console.log('conexion satisfactoria')
    sendLine()
})

client.on('data', (data)=>{
    console.log('El servidor dice' +data)
    sendLine()
})

client.on('error', (err)=>{
    console.log(err.message)
})


function sendLine(){
    var line = readline.question('\n ingresa un mensaje \n')
    if (line==0) {
        client.end()
    }else{
        client.write(line)
    }
}

