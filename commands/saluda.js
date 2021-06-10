// Array list of replies
let replies = ["wena wn", "buen dia grupo <:grBliss:749880374213083227>", "<:Grego2:852589102804107264>:interrobang:", "sry manito ando subiendo la montaña"];
module.exports = {
	name: 'saluda',
	aliases: ['salute','salude','saludame','salúdame'],
	description: 'Gregorio te saluda',
	execute(message) {
	let random = Math.floor(Math.random() * 4);
		message.channel.send(replies[random]);
	},
};