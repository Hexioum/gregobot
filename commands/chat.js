const dotenv = require('dotenv');
dotenv.config();
// node-fetch for making HTTP requests
const fetch = require('node-fetch');
API_URL = 'https://api-inference.huggingface.co/models/hexioum/DialoGPT-small-gregobot';
module.exports = {
	name: 'chat',
	aliases: ['conversemos','cuentame','dime','hablemos'],
	description: 'Gregorio te conversa',
	execute(message) {
        if (message.content.toLowerCase().startsWith('<@749824051945537637> ')) {
            message.content = message.content.substring(22)
        } else if (message.content.toLowerCase().startsWith('gr conversemos, ')) {
            message.content = message.content.substring(16)
        } else if (message.content.toLowerCase().startsWith('gr cuentame, ')) {
            message.content = message.content.substring(13)
        } else if (message.content.toLowerCase().startsWith('gr dime, ')) {
            message.content = message.content.substring(9)
        } else if (message.content.toLowerCase().startsWith('gr hablemos, ')) {
            message.content = message.content.substring(13)
        };
        
        var replies = ["calmao que estoy viendo una wea", "que wea?", "estoy hecho pico", "sry manito ando subiendo la montaña"];
        var random = Math.floor(Math.random() * 4);

        // form the payload
        const payload = {
            inputs: {
                text: `${message.content}`
            }
        };
        const headers = {
            'Authorization': 'Bearer ' + process.env.HUGFACE_READ
        };

        console.log(`"${message.content}"`);

        try {
            message.channel.sendTyping();
			getReply(message);
		} catch(err) {
			return console.log(`getReply: ${err}`);
		};
        
		async function getReply (message) {
            // query the server
            const response = await fetch(API_URL, {
                method: 'post',
                body: JSON.stringify(payload),
                headers: headers
            });
            const data = await response.json();
            let botResponse = '';
            if (data.hasOwnProperty('generated_text')) {
                botResponse = data.generated_text;
            } else if (data.hasOwnProperty('error')) { // error condition
                botResponse = `**chucha:** ${data.error}`;
            }
            // send message to channel as a reply
            if (botResponse == "Model hexioum/DialoGPT-small-gregobot is currently loading") {
                message.reply(replies[random]);
            } else {
                message.reply(botResponse);
            };
        }
	},
};