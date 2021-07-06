module.exports = {
	name: 'balance',
	aliases: ['leche','milk','currency','cums','cummies','jizz','jizzies','semen'],
	description: 'Gregorio comprueba la cantidad de leche que tienes almacenada.',
	args: true,
	usage: 'grego leche',
	execute(message, args) {
        const target = message.mentions.users.first() || message.author
        const targetId = target.id

        console.log('ID:', targetId);
    }
}