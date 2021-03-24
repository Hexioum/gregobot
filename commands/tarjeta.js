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
const helpEmbed = new Discord.MessageEmbed()
	.setColor('#00B0F4')
	.setTitle('Mudacrop')
	.setURL('https://vimeo.com/434895153')
	.setAuthor('GregoBot Ayuda', 'https://i.imgur.com/ZmtGJgz.png')
	.setDescription('Gregorio te ayuda a cortar imágenes para su bot favorito.')
	.setThumbnail('https://wiki.gbl.gg/images/8/88/Numpad.jpg')
	.addFields(
		{ name: 'Uso de el comando', value: 'Todos los valores son opcionales.\n*Ejemplo: gr mudacrop, 8, 1*\nEn este caso, se hace un acercamiento hacia arriba, y se utiliza el segundo marco (negro), pero como se ignoró el valor de rotación, este será igual a 0 grados.' },
		{ name: 'Acercamiento', value: '`7 8 9`\n`4 5 6`\n`1 2 3`\n0 = Sin Zoom (Por defecto)', inline: true },
		{ name: 'Marco', value: '0) Blanco (Default)\n1) Negro\n2) Rojo\n3) Naranja\n4) Amarillo Amarillo\n5) Verde Radioactivo\n6) Celestito\n7) Azul\n8) Morita\n9) Gamer', inline: true },
	)
	.addField('Ángulo o Rotación', 'De 0 a 359\n90 = Voltear hacia la derecha\n270 = Voltear hacia la izquierda', true)
	.setTimestamp()
	.setFooter('gregobot® 2021');

var Jimp = require('jimp');
module.exports = {
	name: 'tarjeta',
	aliases: ['card','mudacrop'],
	description: 'Gregorio te ayuda a cortar imágenes para su bot favorito.',
	args: true,
	usage: 'Alineación (numpad), Marco, Ángulo',
	execute(message, args) {
	/*	if (message.channel.id != 742472922093846588) {
			return message.channel.send('usa #borg po');
		}*/

		if (args.length > 3) {
			return message.channel.send('demasiados argumentos');
		}
		if ((args[0] === 'ayuda')||(args[0] === 'help')||(args[0] === 'info')) {
			return message.channel.send(helpEmbed);
		}
		var alignX = 0;
		var alignY = 0;
		let member = message.author
		let random = Math.floor(Math.random()*100000000);
		var url1 = "https://i.imgur.com/Fr6MFsI.png";

		//	Check args and fill invalid values with something else.
		if ((args[2] === 'undefined')||(isNaN(args[2]))) {
			args[2] = 0;
			console.log(args[2])
		}
		if ((args[1] === 'undefined')||(isNaN(args[1]))||(args[1] > 9)) {
			args[1] = 0;
		}
		if ((args[0] === 'undefined')||(isNaN(args[0]))) {
			args[0] = 0;
		}
		
		async function fetchMsg () {
			try {
				message.channel.startTyping();
				await getURL();
			}
			catch(err) {
				console.log("chucha:"+err);
				return message.channel.stopTyping(true);
			}
		}
		async function getURL () {
			message.channel.messages.fetch().then((messages) => {
				const lastMessage = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0).first();
				url1 = lastMessage.attachments.first().url;
				console.log(url1);//	console.log("7");
				imgResize();
			});
		}
		fetchMsg();
		
		async function imgResize () {
			var crdAlign = args[0]
			var rotAngle = args[2]
			let fOutput = `card_${random}.png`
			if (crdAlign > 0) {
				await Jimp.read(url1)
				.then(imgEdit => {
					return imgEdit
						.rotate(Number(rotAngle),false)			// set angle
						.cover(450,700)	// resize
						.write(fOutput)	// save
					})
					.then(() => {
						console.log(`Generando carta para ${member.username}, con alineación ${args[0]} y una rotación de ${args[2]} grados.`)
						if ((args[0] === '8')||(args[0] === '5')||(args[0] === '2')) {
							alignX = -113;
						};
						if ((args[0] === '9')||(args[0] === '6')||(args[0] === '3')) {
							alignX = -225;
						};
						if ((args[0] === '4')||(args[0] === '5')||(args[0] === '6')) {
							alignY = -175;
						};
						if ((args[0] === '1')||(args[0] === '2')||(args[0] === '3')) {
							alignY = -350;
						};
						cardMaker();
					})
					.catch(err => {
						message.channel.stopTyping(true)
						return console.error(err);
					});
				}
			else {
				await Jimp.read(url1)
				.then(imgEdit => {
					return imgEdit
						.rotate(Number(rotAngle),false)			// set angle
						.cover(225,350)	// resize
						.write(fOutput)	// save
					})
					.then(() => {
						console.log(`Generando carta para ${member.username}, con alineación ${args[0]} y una rotación de ${args[2]} grados.`)
						cardMaker();
					})
					.catch(err => {
						message.channel.stopTyping(true)
						return console.error(`Deg = ${rotAngle}\n`+err);
					});
			};
		}
		async function cardMaker () {
			let fOutput = `card_${random}.png`
			let cBorder = `./memes/card_ol${args[1]}.png`
			let chInput = await Jimp.read(fOutput)
			let outline = await Jimp.read(cBorder)
			await Jimp.read('./memes/card_bgGFL.png')
			.then(imgCard => {
				return imgCard
					.cover(225,350)			// resize
					.composite(chInput,Number(alignX),Number(alignY))	// composites another Jimp image over this image at X,Y
					.composite(outline,0,0)
					.write(fOutput)			// save
				})
				.then(() => console.log(`Generando carta para ${member.username}, marco ${args[1]} y alineación X${alignX} e Y${alignY}.`))
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