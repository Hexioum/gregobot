const fs = require("fs")
const Discord = require('discord.js');
const bot = new Discord.Client({ 
ws: { intents: [
	'GUILDS',
	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS'] }
});
// a class that extend JS's native Map class and include more extensive functionality.
bot.commands = new Discord.Collection();
var Jimp = require('jimp');
module.exports = {
	name: 'tarjeta',
	aliases: ['card','mudacrop'],
	description: 'Gregorio te ayuda a cortar imágenes para su bot favorito.',
	args: true,
	usage: 'Alineación Horizontal, Alin. Vertical, Ángulo de rotación',
	execute(message, args) {
	if (args.length > 3) {
		return message.channel.send('demasiados argumentos');
	}
	let member = message.author
	let random = Math.floor(Math.random()*100000000);
	//	Check args and fill empty values with something else.
/*	if (args[2] === 'undefined') {
		let rotAngle = 0;
	}	else {
		let rotAngle = args[2];
	}
	if (isNaN(args[1])) {
		let alignY = 0.5;
	}
	if (isNaN(args[0])) {
		let alignX = 0.5;
	}*/
	message.channel.startTyping();
	var url1 = "https://i.imgur.com/Fr6MFsI.png";
	
	async function fetchMsg () {
		try {
			await getURL();
		}
		catch(err) {
			console.log("chucha:"+err);
		}
	}
	async function getURL () {
		message.channel.messages.fetch().then((messages) => {
			const lastMessage = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0).first();
			url1 = lastMessage.attachments.first().url;
			console.log(url1);//	console.log("7");
			cardMaker();
		});
	}
	fetchMsg();
	
	async function cardMaker () {
		let fOutput = `card_${random}.png`
		let outline = await Jimp.read('./memes/card_outline.png')
		await Jimp.read({
			url: url1, // Required!
			headers: {}
		})
		.then(imgEdit => {
		return imgEdit
	//		.rotate(rotAngle,[Jimp.RESIZE_BEZIER])			// set angle
			.cover(225,350)	// resize
			.composite(outline,0,0)// composites another Jimp image over this image at 0,0
			.write(fOutput)// save
		})
		.then(() => console.log(`Generando carta para ${member.username}...`))
		.then(() => message.channel.send(`<@${member.id}> toma amigo :))))))))`, { files: [fOutput] }))
		.then(() => message.channel.stopTyping(true))
		.catch(err => {
			console.error(err);
		});

		setTimeout(function(){
		try {
			fs.unlink(fOutput, (err) => {
				if (err) {
					console.log("No se pudo borrar la imágen:"+err);
				} else {
					console.log('Se ha borrado la carta tras haberla enviado.');                                
				}
			});
		}	catch(err) {
			console.log(err);
		}	finally {
			console.log()
			return message.channel.stopTyping(true);
		}
			}, 6000);
		}

	},
};