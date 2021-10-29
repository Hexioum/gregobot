const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('quick.db');
const client = new Discord.Client({ intents: ['GUILDS','GUILD_PRESENCES','GUILD_MEMBERS'] });
const { token, gregorid } = require('../config.json');
module.exports = {
	name: 'restart',
	aliases: ['update','reinicia'],
	description: 'Gregorio volverá en breve.',
	args: true,
	usage: 'grego reinicia',
	execute(message, args) {
//	Check the server owner ID
	if(message.author.id != "360892991499665408") return message.channel.send("no");
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
			.then(client.destroy())
			.then(client.login(process.env.BOT_TOKEN))
		}

		} catch(e) {
			message.channel.send(`ERROR: ${e.message}`)
		}

		async function getAvatar (avUrl) {
		const { displayAvatarURL } = await client.users.fetch(gregorid)
		.catch(console.error);

		return avUrl;
		};
	}
}