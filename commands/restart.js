const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('quick.db');
const client = new Discord.Client();
module.exports = {
	name: 'restart',
	aliases: ['update','reinicia'],
	description: 'Gregorio volverá en breve.',
	args: true,
	usage: 'grego reinicia',
	execute(message, args) {
//	Check the server owner ID
	if(message.author.id != "360892991499665408") return message.channel.send("no");

    try {
		if (args[0] === "booru") {
			db.delete(`booru_cd`);
			db.delete(`booruLastfind`);
		} else if (args[0] === "booru cooldown") {
			db.delete(`booru_cd`);
		} else if (args[0] === "booru memory") {
			db.delete(`booruLastfind`);
		};
		message.channel.send("volveré...").then(msg => {
			setTimeout(function(){
				msg.edit("toc toc!");
				msg.react('🆗');
				message.channel.stopTyping(true);
			}, 6000);
		})
		.then(client.destroy())
		.then(client.login(process.env.BOT_TOKEN))

		} catch(e) {
			message.channel.send(`ERROR: ${e.message}`)
		}
	}
}