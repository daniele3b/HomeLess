var amqp = require('amqplib/callback_api');
const config = require('config')

function sendInfoToOneServer(info){

    //const service = info.service

    //Some logic to determine which service has to be used must be put here...
    
    amqp.connect('amqp://localhost', function(error0, connection) {
    
    if (error0) {
        throw error0;
    }
  
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        
        const queue = config.get('amqp_queue');

        channel.assertQueue(queue, {
            durable: false
        });

        /*const dataToSend = {
            name: info.name,
            surname: info.surname,
            birthday: info.birthday,  // ...
            day: info.day,  // ...
            street: info.street,
            city: info.city,
            cap: info.cap,
            to: info.to
        }*/

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() { 
        connection.close(); 
        process.exit(0) 
    }, 500);

    });
}

exports.sendInfoToOneServer = sendInfoToOneServer