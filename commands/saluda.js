// Array list of replies
let replies = ["wena wn", "buen dia grupo <:grBliss:749880374213083227>", "<:Grego:750502194108956682>:interrobang:"];
module.exports = {
	name: 'saluda',
	description: 'Gregorio te saluda',
	execute(message) {
	let random = Math.floor(Math.random() * 3);
		message.channel.send(replies[random]);
	},
};