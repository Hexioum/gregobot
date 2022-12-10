const { Client, GatewayIntentBits, PermissionsBitField, Collection } = require('discord.js');
const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
		]
	}
);
bot.commands = new Collection();

const dotenv = require('dotenv');
dotenv.config();
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const { gregorid } = require('../config.json');

module.exports = {
	name: 'restart',
	aliases: ['update','reinicia'],
	description: 'Gregorio volverá en breve.',
	args: true,
	usage: 'grego reinicia',
	execute(message, args) {
		let member = message.author;
//	Check the server owner ID
	if (member.roles.has('438748454823526400')) return message.channel.send("no");
	// resolve(guildID) and get gregoID	(GET AVATAR)
/*	bot.users.fetch(gregorid).then(myUser => {
    bot.user.setAvatar(myUser.avatarURL())})
	.then(() => console.log(myUser))
	.catch((err) => console.log(`avatarURL:`+err));*/
	//const memberGr = client.users.fetch(gregorid);
    try {
		if (args[0] === "booru") {
			db.delete(`booru_cd`);
			db.delete(`booruLastfind`);
		} else if (args[0] === "booru cooldown") {
			db.delete(`booru_cd`);
		} else if (args[0] === "booru memory") {
			db.delete(`booruLastfind`);
		} else if (args[0] === "wishlists") {
			db.delete(`wishlists`);
		}
		if (args[0] === "avatar") {
			try {
				//client.user.setAvatar(memberGr.avatarURL());
				console.log(getAvatar());
				try {
					return message.react('✅');
				} catch (err) {
					return console.log(`No puedo reaccionar: ${err}`);
				};
			} catch(err) {
				console.log("No puedo cambiar el avatar: "+err)
				try {
					return message.react('❌');
				} catch (err) {
					return console.log(`No puedo reaccionar: ${err}`);
				};
			}
		} else {
			message.channel.send("volveré...").then(msg => {
				setTimeout(function(){
					msg.edit("toc toc!");
					msg.react('🆗');
				}, 4000);
			})
			.then(bot.destroy())
			.then(bot.login(process.env.BOT_TOKEN))
		}

		} catch(e) {
			message.channel.send(`ERROR: ${e.message}`)
		}

		async function getAvatar () {
			const response = await fetch(`https://discord.com/api/v9/users/${gregorid}`, {
				headers: {
					'Authorization': 'Bot ' + (process.env.BOT_TOKEN)
				}
			})
			return JSON.stringify(await response.json(), null, 4)
		}		
	}
}