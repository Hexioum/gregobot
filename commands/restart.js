const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
	name: 'restart',
	aliases: ['update','reinicia'],
	description: 'Gregorio volverá en breve.',
	args: false,
	usage: 'grego reinicia',
	execute(message) {
//	Check the server owner ID
	if(message.author.id != "360892991499665408") return message.channel.send("no");

    try {
		message.channel.send("volveré...").then(msg => {
			setTimeout(function(){
				msg.edit("toc toc!");
				msg.react('🆗');
			}, 6000);
		})
		.then(client.destroy())
		.then(client.login(process.env.BOT_TOKEN))

		} catch(e) {
			message.channel.send(`ERROR: ${e.message}`)
		}
	}
}