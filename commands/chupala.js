// Array list of replies
let replies = ["que te pasa enfermo?", "a veces me pregunto porque dios me sigue dejando vivir en este planeta de mierda", "wn fome", "<:perroHm:739735108314988554>"];
module.exports = {
	name: 'chupala',
	aliases: ['chupalo','mamala','mamalo','haceme un kiko','chupame el pico','chupa el pene','mascala','mascalo','agachate y conocelo'],
	description: 'Gregorio se defiende',
	execute(message) {
	let random = Math.floor(Math.random() * 4);
		message.channel.send(replies[random]);
	},
};
