const dotenv = require('dotenv');
dotenv.config();
// node-fetch for making HTTP requests
const fetch = require('node-fetch');
API_URL = 'https://api-inference.huggingface.co/models/hexioum/DialoGPT-small-gregobot';
const cheerio = require("cheerio");
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
        if (message.content.length > 255) {
            return message.reply(`mucho texto`);
        }
        
        // form the payload
        var payload = {
            inputs: {
                text: `${message.content}`
            }
        };
        const headers = {
            'Authorization': 'Bearer ' + process.env.HUGFACE_READ
        };

        var replies = [
            "calmao que estoy viendo una wea",
            "ah?",
            "estoy hecho pico",
            "sry manito ando subiendo la montaña",
            "calmao",
            "su cs?"
        ];
        var random = Math.floor(Math.random() * 6);

        if (message.content.startsWith("https://")) {
            let url = message.content;
            fetch(url).then(res => res.text())
            .then(html => {
                const parse = cheerio.load(html)
                message.content = parse("meta[property='og:title']")[0].attribs.content;
                console.log(`URL detectada: ${message.content}`)
                payload = {
                    inputs: {
                        text: `${message.content}`
                    }
                };
                try {
                    message.channel.sendTyping();
                    getReply(message);
                } catch(err) {
                    return console.log(`getReply: ${err}`);
                };
            })
        } else {
            message.content.replace(/[^\w\s]|(.)(?=\1)/gi, "")
            payload = {
                inputs: {
                    text: `${message.content}`
                }
            };
            try {
                message.channel.sendTyping();
                getReply(message);
            } catch(err) {
                return console.log(`getReply: ${err}`);
            };
        };
        
		async function getReply (message) {
            console.log(`Recibido: "${message.content}"`);
            // query the server
            const response = await fetch(API_URL, {
                method: 'post',
                body: JSON.stringify(payload),
                headers: headers
            });
            const data = await response.json();
            let botResponse = '';
            let error = false;
            if (data.hasOwnProperty('generated_text')) {
                botResponse = data.generated_text;
            } else if (data.hasOwnProperty('error')) { // error condition
                botResponse = `**chucha:** ${data.error}`;
                error = true;
            }
            // send message to channel as a reply
            if (error == true) {
                message.reply(replies[random]);
                console.log(botResponse);
            } else {
                if (botResponse.startsWith("y ")) {
                    message.reply(botResponse.substring(2));
                } else {
                    message.reply(botResponse);
                };
            };
        }
	},
};