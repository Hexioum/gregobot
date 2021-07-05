const fs = require("fs");
const axios = require('axios');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const sharp = require('sharp');
// Imgur Pre V2
const imgur = require('imgur');
const clientId = process.env.IMGUR_CLIENTID;
const albumId = process.env.IMGUR_ALBUMID;
imgur.setClientId(clientId)
imgur.setAPIUrl('https://api.imgur.com/3/')
// Imgur V2
/*const { ImgurClient } = require('imgur');
//imgcli = new ImgurClient({ accessToken: process.env.IMGUR_SECRET });
imgcli = new ImgurClient({
	username: process.env.IMGUR_USERNAME,
	password: process.env.IMGUR_PASSWORD,
	clientId: process.env.IMGUR_CLIENTID,
  });*/
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
		{ name: 'Fondo', value: '`  0` Blanco\n`  1` Negro\n`  2` Azulado\n`  3` Verde Lima\n`  4` Amarillo\n`  5` Naranja\n`  6` Rojo\n`  7` Morado\n`  8` Dorado\n`DGN` Líneas Diagonales\n`GFL` GFrontline (gris)\n`KKA` Koikatsu 1\n`KKU` Koikatsu 2\n`PAT` Patronato\n`UM1` Uma Musume\n`UM2` Uma Musume (Hall)\n`WXP` WinXP Bliss', inline: true },
		{ name: 'Marco', value: '0) Blanco (Default)\n1) Negro\n2) Rojo\n3) Naranja\n4) Amarillo 2077\n5) Verde Radioactivo\n6) Celestito\n7) Azul\n8) Morita\n9) Gamer', inline: true },
	)
	.addField('Acercamiento', '`7 8 9`\n`4 5 6`\n`1 2 3`\n0 = Sin Zoom (Por defecto)', true)
	.setTimestamp()
	.setFooter('gregobot® 2021');

module.exports = {
	name: 'tarjeta',
	aliases: ['card','mudacrop'],
	description: 'Gregorio te ayuda a cortar imágenes para su bot favorito (Usando Sharp).',
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
		let theImage = "PIC1.PNG";
		var alignX = 0;
		var alignY = 0;
		let member = message.author
		const random = Math.floor(Math.random()*1000000000000);
		var url1 = "https://i.imgur.com/Fr6MFsI.png";
		var finalResult;

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
		} 
		try {if (backgrounds.includes("bg_"+args[0].toLowerCase()+".png") === false) {
			console.log(args[0]);//Can't use args[0].toLowerCase() since it returns TypeError when args[0] is not specified.
			return message.channel.send('no tengo ese fondo');
			}
		} catch {
			args[0] = 0;
			console.log("args[0] no fue especificado y se ha cambiado a 0.");
		} finally {
			fetchMsg();
		};
		
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
				fileType = url1.substring(url1.lastIndexOf('.')+1, url1.length);
				console.log(url1);
				console.log("El archivo encontrado es un "+fileType);//gets file type
				if ((fileType == "mp4")||(fileType == "mov")||(fileType == "avi")||(fileType == "3gp")) {
					message.channel.send(`no puedo usar un video <@${member.id}>`)
					return message.channel.stopTyping(true);
				} else {
					try {
						imgResize();
					} catch {
						console.log("getURL:"+err);
						message.channel.send(`intenta denuevo <@${member.id}>`)
						return message.channel.stopTyping(true);
					}
				};
			}).catch(err => {
				console.log("chucha:"+err);
				return message.channel.stopTyping(true);
			});
		}
		
		async function imgResize () {
			const imageResponse = await axios({url: url1, responseType: 'arraybuffer'})
			theImage = Buffer.from(imageResponse.data, 'binary');
			let cBorder = `./mdcards/card_ol${args[1]}.png`;
			var crdAlign = args[2]
			var rotAngle = args[3]
			let alignment = [
				"centre",
				"southwest",
				"south",
				"southeast",
				"west",
				"centre",
				"east",
				"northwest",
				"north",
				"northeast"
			]
			if (crdAlign > 0) {
				if ((args[2] === '8')||(args[2] === '5')||(args[2] === '2')) {
					alignX = 113;
				};
				if ((args[2] === '9')||(args[2] === '6')||(args[2] === '3')) {
					alignX = 225;
				};
				if ((args[2] === '4')||(args[2] === '5')||(args[2] === '6')) {
					alignY = 175;
				};
				if ((args[2] === '1')||(args[2] === '2')||(args[2] === '3')) {
					alignY = 350;
				};

				await sharp(theImage)
					.png()//.jpeg({ mozjpeg: true })
					.rotate(Number(rotAngle))
					.resize(450,700)
					.composite([{ input: cBorder, gravity: alignment[Number(args[2])] }])
					.extract({ left: alignX, top: alignY, width: 225, height: 350 })
					.toBuffer()
					.then(function(outputBuffer) {
						console.log(`Generando carta para ${member.username}, con alineación ${args[2]} y una rotación de ${args[3]} grados.`)
						cardMaker(outputBuffer);
					})
					.catch(err => {
						message.channel.stopTyping(true);
						return console.error(`Alignbruh\n`+`*${err}*`);
					});
				}
			else {
				await sharp(theImage)
					.png()
					.rotate(Number(rotAngle))	// set angle
					.resize(225,350)
					.composite([{ input: cBorder, gravity: alignment['north'] }])
					.toBuffer()
					.then(function(outputBuffer) {
						console.log(`Generando carta para ${member.username}, con alineación ${args[2]} y una rotación de ${args[3]} grados.`)
						cardMaker(outputBuffer);
					})
					.catch(err => {
						message.channel.stopTyping(true);
						message.channel.send(`ta en webp esta wea??\n`+err);
						return console.error(`Bruh\n`+`*${err}*`);
					});
			};
		}
		async function cardMaker (x) {
			console.log(`El fondo sería: bg_${args[0]}.png`);
			let alignment = [
				"centre",
				"southwest",
				"south",
				"southeast",
				"west",
				"centre",
				"east",
				"northwest",
				"north",
				"northeast"
			]
			await sharp(`./mdcards/bgs/bg_${args[0]}.png`)
					.composite([{ input: x, gravity: alignment[Number(args[2])] }])
					.png()
					.toBuffer()
					.then(function(outputBuffer) {
					console.log(`Generando carta para ${member.username}, marco ${args[1]} y alineación ${alignment[Number(args[2])]}.`);
					message.channel.stopTyping(true);
					finalResult = outputBuffer;
					message.channel.send(`<@${member.id}> toma amigo :))))))))`, { files: [outputBuffer] })
					.then((message) => deleteMessage(message, outputBuffer))
					.catch(err => {
						message.channel.send(`estoy hecho mierda <@${member.id}>`)
						message.channel.stopTyping(true)
						console.error(err)
					})
				})
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
			}, 3000);
		}
		// Interacciones con reacciones.
		async function emojiMessage(message, validReactions) {
            for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && (!user.bot)
		console.log(`user: ${message.author.username}`);
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
		//	await cardClear();
			console.log("Terminando react detection.")
			if (emoji === "🗑️") {
				console.log("It's rewind time.")
				if (message.deletable == true) {
					console.log("Borrando el mensaje.")
					message.delete()
				}
				if (!message.deletable == false) {
					"No puedo borrar el mensaje"
				}
			} else if (emoji === "📤") {
				message.edit(`subiendo a imgur *(Puede tardar hasta 20 segundos)*`);
				console.log("OK. Intentando subir.");
				try {
					message.reactions.removeAll();
					//hay que convertir el buffer de finalResult a base64
					await cardUpload(finalResult);
				} catch(err) {
						console.log("Error al intentar remover los emojis.");
				};
				/*
				*  Aqui despues borro el mensaje y redirijo a otra función async que subirá el archivo a imgur.
				*/
			}
		}

		async function cardUploadbeta () {
			message.channel.messages.fetch().then((messages) => {
				const lastMessage = messages.sort((a, b) => b.createdTimestamp - a.createdTimestamp).filter((m) => m.attachments.size > 0).first();
				url1 = lastMessage.attachments.first().url;
				fileType = url1.substring(url1.lastIndexOf('.')+1, url1.length);
				console.log(url1);
				console.log("El archivo encontrado es un "+fileType);//gets file type
				if ((fileType == "mp4")||(fileType == "mov")||(fileType == "avi")||(fileType == "3gp")) {
					message.channel.send(`no puedo usar un video <@${member.id}>`)
					return message.channel.stopTyping(true);
				} else {
					console.log(`Consiguiendo URL`);
					try {
						cardUpload(url1);
					} catch(err) {
						message.channel.send(`no pude subirla 😦`);
						return console.log("cardUpload: "+err);
					} finally {
						return message.reactions.removeAll();
					}
				};
			}).catch(err => {
				console.log("chucha:"+err);
				return message.channel.stopTyping(true);
			});
		}
			
		async function cardUpload () {
			//fOutput = `./card_${random}.png`
			message.channel.startTyping();
			console.log(`Iniciando subida a Imgur...\nArchivo: ${finalResult.toString('base64').substring(0,64)}`);
			imgur.setCredentials(process.env.IMGUR_USERNAME, process.env.IMGUR_PASSWORD, process.env.IMGUR_CLIENTID);
			imgur.uploadBase64(finalResult.toString('base64'), albumId).then((json) => {
				console.log(json.link);
				message.channel.stopTyping(true);
				return message.channel.send(`<@${member.id}>\n\`\`\`$ai NOMBRE $${json.link}\`\`\``);
			}).catch((err) => {
				message.channel.stopTyping(true);
				message.channel.send(`no pude subirla 😦`);
				return console.log("cardUpload: "+err);
			});
			
			/*try {
				//imgcli.on('uploadProgress', (progress) => console.log(progress));
				const response = await imgcli.upload({
					image: `${finalResult.toString('base64')}`,
					album: 'xf1t75w',
					type: 'base64',
					title: 'Mudacrop',
					description: `Requested by ${message.author.username}`,
				});
				console.log(response.data.link);
				message.channel.send(`<@${member.id}>\n\`\`\`$ai NOMBRE $${response.data.link}\`\`\``)
			} catch(err) {
				//message.react(`⚠`);
				message.channel.send(`no pude subirla 😦`);
				return console.log("cardUpload: "+err);
			}*/
		}
	},
};