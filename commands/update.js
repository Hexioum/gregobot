const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
	name: 'update',
	aliases: ['actualiza el avatar','arregla el avatar','cambia el avatar','cambia la foto'],
	description: 'Gregorio cambia su avatar.',
	execute(message) {
	client.users.fetch(gregorid).then(myUser => {
    client.user.setAvatar(myUser.avatarURL())})
	.then(() => console.log(myUser))
	.catch(() => console.log(`Cambié el avatar hace muy poco...`));
	},
};