const net = require('net');
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
    console.log('El servidor dice:'+ data)
    //sendLine()
})

router.post('/enviar', async(req, res)=>{
    const datos = req.body;
    console.log("Mensaje:", datos.mensaje);
    client.write(datos.mensaje)
    res.redirect('/');
})

module.exports = router;

function sendLine(){
    var line = readline.question('\n ingresa un mensaje \n')
    if (line==0) {
        client.end()
    }else{
        client.write(line)
    }
}