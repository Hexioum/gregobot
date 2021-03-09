const Discord = require('discord.js');
const bot = new Discord.Client();
let { gregorid, ownnick } = require('./../config.json');
let gifreaction = 'https://thumbs.gfycat.com/VioletAcrobaticHound-size_restricted.gif'
module.exports = {
	name: 'alma',
	aliases: ['soul','mudae'],
	description: 'Gregorio absorbe tu alma.',
	args: true,
	usage: '<Nombre> o <Usuario>, <Victima> (opcional)',
	execute(message, args) {
	const ownnick = process.env.BOT_NICKNAME //Improvement Pending
	console.log(args)
	if (args.length < 1) {
		let victim = message.author.id
	//	get own nickname
	//	let gregonick = guild.members.fetch(gregorid)
	//	console.log(gregonick.username)
		message.channel.send(`**${ownnick}**: tu alma(cuerpo incluido) es mia **<@${victim}>** ${gifreaction}`)
		.then(() => console.log(`Se obtuvo el alma de el autor.`))
		.catch(() => console.error('error'));
	} else if (args.length > 2) {
		message.channel.send('mucho texto');
	} else if (args.length == 1) {
		let vicname	= message.author.username
		if (!message.mentions.users.size) {
			message.channel.send(`**${vicname}**: tu alma(cuerpo incluido) es mia **${args[0]}** ${gifreaction}`)
			.catch(() => console.error('No hay permisos para robar almas?'));
		} else {
			const taggedUser = message.mentions.users.first();
			async function tagUsername() {
				await bot.users.fetch(taggedUser);
				}
			message.channel.send(`**${vicname}**: tu alma(cuerpo incluido) es mia **${taggedUser.username}** ${gifreaction}`)
			.catch(() => console.error('No hay permisos para robar almas?'));
		}
		// bot.guilds.cache.get('749824051945537637')
	} else {
		message.channel.send(`**${args[0]}**: tu alma(cuerpo incluido) es mia **${args[1]}** ${gifreaction}`)
		.catch(() => console.error('No hay permisos para robar almas?'));
		}
	},
};