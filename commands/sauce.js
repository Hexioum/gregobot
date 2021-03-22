const Discord = require('discord.js');
const sagiri = require("sagiri");
// 430fabed3e4ae214ccd9806d15ab0aabdb9b71c6 process.env.SAUCE_TOKEN
const client = sagiri("430fabed3e4ae214ccd9806d15ab0aabdb9b71c6", {
  results: 5,
  excludeMask: [1]
})
module.exports = {
	name: 'saucenao',
	aliases: ['source','sauce','fuente','search'],
	description: 'Gregorio obtiene el source mediante SauceNAO',
	args: false,
	usage: 'cantidad de resultados',
	execute(message) {
		var url1 = "https://cdn.discordapp.com/attachments/441386860300730378/822114125638795334/20210318_112702.jpg";
		var results = "Nothing Happened.";
		
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
				sauceGet();
			});
		}
		fetchMsg();
		
		async function sauceGet () {
			message.channel.stopTyping(true);
			results = await client(url1);
			for (let i = 0; i < results.length; i++) {
				console.log(results[1].url)
			}
			return message.channel.send(results[1].url);
		}
	},
};