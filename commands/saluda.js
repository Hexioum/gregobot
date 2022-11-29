// Array list of replies
let replies = ["wena wn", "buen dia grupo <:grBliss:749880374213083227>", "<:Grego2:961372170339098694>:interrobang:", "sry manito ando subiendo la montaña", "QUIEN UN NOSGOTH?", "su cs?"];
module.exports = {
	name: 'saluda',
	aliases: ['salute','salude','saludame','salúdame'],
	description: 'Gregorio te saluda',
	execute(message) {
	let random = Math.floor(Math.random() * 6);
		message.reply(replies[random]);
	},
};