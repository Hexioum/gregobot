const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const fs = require("fs");
const sagiri = require("sagiri");
const client = sagiri(process.env.SAUCE_TOKEN, {
  results: 4,
  excludeMask: [1]
});
module.exports = {
	name: 'saucenao',
	aliases: ['source','sauce','salsa','fuente','reverse search','rs'],
	description: 'Obtiene el origen de la imágen mediante SauceNAO',
	args: true,
	usage: 'cantidad de resultados',
	execute(message, args) {
		let member = message.author;
		var memes = fs.readdirSync('./memes');
		if (typeof args[0] === 'undefined') {
			args[0] = "";
		};
		var url1 = args[0];
		var url2 = "";
		var results = "Nothing Happened.";
		for (var i = 0; i < memes.length; i++) {
			memes[i] = memes[i].replace(/[!$&'()*+,;=]/gi, '');
		}
		
		async function fetchMsg () {
			try {
				console.log(memes);
				message.channel.startTyping();
				if (args[0].toLowerCase().startsWith(`http`)) {
					sauceGet();
				} else {
					await getURL();
				}
			}
			catch(err) {
				console.log("chucha:"+err);
				return message.channel.stopTyping(true);
			}
		}
		async function getURL () {
			message.channel.messages.fetch({limit: 48}).then((messages) => {
				//const lastMessage = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0).first();
				const lastMessages = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0);	//object
				
				//lastMessages.first(2).forEach(message => console.log(message.attachments.first().url))
				var attFetch = Object.values(lastMessages.first(2));
				url1 = attFetch[0].attachments.first().url;
				url2 = attFetch[1].attachments.first().url;
				var filename = url1.substring(url1.lastIndexOf('/')+1);
				console.log(filename);
				console.log(`En caso de emergencia, veré `+url2);
				//console.log(lastMessages.first(2));
				//(filename.indexOf(memes) != -1)&&
				if (!memes.includes(`${filename}`)) {
					//Si el filename de la url no coincide con los archivos en la carpeta de memes
					try {
						sauceGet();
					} catch {
						console.log("No encontré una mierda.");
						message.channel.send("puta no se wn");
						
						let filter = m => m.author.id === message.author.id;
						message.channel.stopTyping(true);
						message.channel.send(`meh`).then(() => {
							message.channel.awaitMessages(filter, {
								max: 1,
								time: 25000, // Wait 25 seconds
								errors: ['time']
							})
							.then(message => {
								message = message.first()
								if (message.content.toLowerCase().includes(`puta`) || message.content.toLowerCase().includes(`rachel`) || message.content.toLowerCase().includes(`hermana`) || message.content.toLowerCase().includes(`mamala`) || message.content.toLowerCase().includes(`wn`)) {
									message.channel.send({files: ['./memes/chubis/triste.png']})
								} else if (message.content.toLowerCase().includes(`culiao`) || message.content.toLowerCase().includes(`qlo`) || message.content.toLowerCase().includes(`conchetumare`) || message.content.toLowerCase().includes(`ctm`) || message.content.toLowerCase().includes(`yapo`) || message.content.toLowerCase().includes(`chupala`) || message.content.toLowerCase().includes(`weon`)) {
									message.channel.send({files: ['./memes/chubis/atomar.jpg']})
								} else if (message.content.toLowerCase().includes(`payaso`) || message.content.toLowerCase().includes(`maricon`) || message.content.toLowerCase().includes(`🤡`) || message.content.toLowerCase().includes(`puto`)) {
									message.channel.send({files: ['./memes/chubis/avergonzao.jpg']})
								} else {
									return console.log('Supongo que no me insultaron...');
								}
							})
							.catch(collected => {
								return console.log('Se acabó el tiempo, nadie me insultó. Gané.');
							});
						});
					};
				} else {
					console.log(`Index: ${memes.indexOf(filename)}\nUsando la segunda URL...`);
					url1 = url2
					try {
						sauceGet();
					} catch {
						message.channel.send("puta no se wn");
						return console.log("No encontré una mierda.");
					};
				}
			});
		}
		try {
			fetchMsg();
		} catch(err) {
			return console.log(`fetchMsg: ${err}`);
		};
		
		async function sauceGet () {
			console.log(`Buscando el source de `+url1.substring(url1.lastIndexOf('/')+1))
			message.channel.stopTyping(true);
			try {
				results = await client(url1);
			} catch {
				try {
					results = await client(url2);
				} catch(err) {
					message.channel.send(`<@${member.id}> ERROR\nintenta copiando el link de la imágen y poniendo "gr salsa, https..."`);
					return console.log(`chucha: `+err);
				}
			}
			for (let i = 0; i < results.length; i++) {
				try {
					if ((results[i].url.startsWith("https://anidb.net/"))||(results[i].url.startsWith("https://deviantart.com/"))) {
						results.splice(i,1);
					};
					console.log(results[i].url);
					//console.log(results[i].url.includes(deviantart))
				} catch {
					console.log('No tengo mas URLs');
					break;
				}
			}
		/*	if (results[1].url.startsWith("https://danbooru.donmai.us/")) {
				return message.channel.send(results[1].url);
			}*/
			return message.channel.send(`<@${member.id}> ${results[0].url}`);
		}
	},
};