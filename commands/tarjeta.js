const fs = require("fs");
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
const backgrounds = fs.readdirSync('./mdcards/bgs');
const helpEmbed = new Discord.MessageEmbed()
	.setColor('#00B0F4')
	.setTitle('Mudacrop')
	.setURL('https://vimeo.com/434895153')
	.setAuthor('GregoBot Ayuda', 'https://i.imgur.com/ZmtGJgz.png')
	.setDescription('Gregorio te ayuda a cortar imágenes para su bot favorito.')
	.setThumbnail('https://wiki.gbl.gg/images/8/88/Numpad.jpg')
	.addFields(
		{ name: 'Uso de el comando', value: 'Todos los valores son opcionales.\n*Ejemplos:*\n`gr mudacrop` Fondo blanco, marco blanco, sin zoom.\n`gr card, 1, 4, 8` Fondo azulado, marco amarillo (Amarillo!), acercamiento hacia arriba.\n`gr tarjeta, 0, 0, 5` Fondo y marco por defecto, acercamiento hacia el centro.' },
		{ name: 'Fondo', value: '`  0` Blanco\n`  1` Azulado\n`  2` Verde Lima\n`  4` Naranja\n`GFL` GFrontline (gris)\n`KKA` Koikatsu 1\n`KKU` Koikatsu 2\n`UM1` Uma Musume\n`UM2` Uma Musume (Hall)\n`PAT` Patronato\n`WXP` WinXP Bliss', inline: true },
		{ name: 'Marco', value: '0) Blanco (Default)\n1) Negro\n2) Rojo\n3) Naranja\n4) Amarillo Amarillo\n5) Verde Radioactivo\n6) Celestito\n7) Azul\n8) Morita\n9) Gamer', inline: true },
	)
	.addField('Acercamiento', '`7 8 9`\n`4 5 6`\n`1 2 3`\n0 = Sin Zoom (Por defecto)', true)
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
		if (message.channel.id === 441386860300730378) {
			return message.channel.send('usa <#742472922093846588> po');
		}

		if (args.length > 4) {
			return message.channel.send('demasiados argumentos');
		}
		if ((args[0] === 'ayuda')||(args[0] === 'help')||(args[0] === 'info')) {
			return message.channel.send(helpEmbed);
		}
		console.log(backgrounds);
		var alignX = 0;
		var alignY = 0;
		let member = message.author
		let random = Math.floor(Math.random()*100000000);
		var url1 = "https://i.imgur.com/Fr6MFsI.png";

		//	Check args and fill invalid values with something else.
		if ((typeof args[3] === 'undefined')||(isNaN(args[3]))) {
			args[3] = 0;
			console.log(args[3])
		}
		if ((typeof args[2] === 'undefined')||(isNaN(args[2]))||(args[2] > 9)) {
			args[2] = 0;
		}
		if ((typeof args[1] === 'undefined')||(isNaN(args[1]))||(args[1] > 10)) {
			args[1] = 0;
		}
		if (typeof args[0] === 'undefined') {
			args[0] = 0;
			console.log(args[0])
		} else if (backgrounds.includes("bg_"+args[0]+".png") === false) {
			console.log(args[0]);//Can't use args[0].toLowerCase() since it returns TypeError when args[0] is not specified.
			return message.channel.send('no tengo ese fondo');
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
				console.log(url1);
				imgResize();
			}).catch(err => {
				console.log("chucha:"+err);
				return message.channel.stopTyping(true);
			});
		}
		fetchMsg();
		
		async function imgResize () {
			var crdAlign = args[2]
			var rotAngle = args[3]
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
						console.log(`Generando carta para ${member.username}, con alineación ${args[2]} y una rotación de ${args[3]} grados.`)
						if ((args[2] === '8')||(args[2] === '5')||(args[2] === '2')) {
							alignX = -113;
						};
						if ((args[2] === '9')||(args[2] === '6')||(args[2] === '3')) {
							alignX = -225;
						};
						if ((args[2] === '4')||(args[2] === '5')||(args[2] === '6')) {
							alignY = -175;
						};
						if ((args[2] === '1')||(args[2] === '2')||(args[2] === '3')) {
							alignY = -350;
						};
						cardMaker();
					})
					.catch(err => {
						message.channel.stopTyping(true);
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
						console.log(`Generando carta para ${member.username}, con alineación ${args[2]} y una rotación de ${args[3]} grados.`)
						cardMaker();
					})
					.catch(err => {
						message.channel.stopTyping(true);
						return console.error(`Deg = ${rotAngle}\n`+err);
					});
			};
		}
		async function cardMaker () {
			const fOutput = `card_${random}.png`
			console.log(`El fondo sería: bg_${args[0]}.png`)
			let cBorder = `./mdcards/card_ol${args[1]}.png`
			let chInput = await Jimp.read(fOutput)
			let outline = await Jimp.read(cBorder)
			await Jimp.read(`./mdcards/bgs/bg_${args[0]}.png`)
			.then(imgCard => {
				return imgCard
					.cover(225,350)			// resize
					.composite(chInput,Number(alignX),Number(alignY))	// composites another Jimp image over this image at X,Y
					.composite(outline,0,0)
					.write(fOutput)			// save
				})
				.then(() => console.log(`Generando carta para ${member.username}, marco ${args[1]} y alineación X${alignX} e Y${alignY}.`))
				.then(() => message.channel.send(`<@${member.id}> toma amigo :))))))))`, { files: [fOutput] }))
				.then((message) => deleteMessage(message))
				.catch(err => {
					message.channel.send(`no puedo <@${member.id}>`)
					message.channel.stopTyping(true)
					console.error(err)
				})
		}
		// Para liberar espacio.
		async function cardClear () {
			fOutput = `card_${random}.png`
			setTimeout(function(){
				try {
					fs.unlink(fOutput, (err) => {
						if (err) {
							console.log("No se pudo borrar la imágen:"+err);
						} else {
							return console.log('Se ha borrado la carta tras haberla enviado.');                                
						}
					});
				}	catch(err) {
					console.log(err);
				}	finally {
					console.log("Mudacrop finalizado.")
				}
			}, 1000);
		}
		// Interacciones con reacciones.
		async function emojiMessage(message, validReactions) {
            for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && (!user.bot)
		message.channel.stopTyping(true);

        return message
            .awaitReactions(filter, {
                max: 1,
                time: 30000
            })
            .then(collected => collected.first() && collected.first().emoji.name)
			.catch(err => console.log("Oh: "+err));
		}

		async function deleteMessage(message) {
			const emoji = await emojiMessage(message, ["🗑️", "📤"]);
			await cardClear();
			console.log("Terminando react detection.")

			if (emoji === "🗑️") {
				console.log("It's rewind time.")
				if (message.deletable == true) {
					console.log("Se puede borrar el mensaje")
					console.log("Borrando...")
					message.delete()
				}
				if (!message.deletable == false) {
					"No puedo borrar el mensaje"
				}
			} else if (emoji === "📤") {
				message.channel.send(`de ahi la subo a imgur 🙂`);
				console.log("OK. A futuro la subiré a imgur.");
				try {
					message.reactions.removeAll();
				} catch(err) {
						console.log("Error al intentar remover los emojis.");
				};
				/*
				*  Aqui despues borro el mensaje y redirijo a otra función async que subirá el archivo a imgur.
				*/
			}
		}
	},
};