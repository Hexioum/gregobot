const client = require('../bot.js')

const dotenv = require('dotenv');
dotenv.config();
const { QuickDB } = require('quick.db');
const db = new QuickDB();
const { gregorid } = require('../config.json');

module.exports = {
	name: 'restart',
	aliases: ['reinicia','update'],
	description: 'Gregorio volverá en breve.',
	args: true,
	usage: 'grego reinicia',
	execute(message, args, client) {
		let member = message.author;
		if (member.id === '360892991499665408') {
			console.log('[Reinicia] El usuario tiene permisos.');
		} else {
			return message.channel.send("no");
		}
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
		} else if (args[0] === "booru cd") {
			db.delete(`booru_cd`);
		} else if (args[0] === "booru mem") {
			db.delete(`booruLastfind`);
		} else if (args[0] === "wishlists") {
			db.delete(`wishlists`);
		}
		if (args[0] === "avatar") {
			try {
				//client.user.setAvatar(memberGr.avatarURL());
				console.log(client);
				const avtUrl = getAvatar().then(result => 
					client.user.setAvatar(`https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.png`)
					)
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
				}, 3000);
			})
			.then(client.destroy())
			.then(client.login(process.env.BOT_TOKEN))
		}

		} catch(err) {
			message.channel.send(`ERROR: ${err.message}`)
		}

		async function getAvatar () {
			const response = await fetch(`https://discord.com/api/v9/users/${gregorid}`, {
				headers: {
					'Authorization': 'Bot ' + (process.env.BOT_TOKEN)
				}
			})
			return await response.json()
		}
	}
}