const db = require('quick.db');
// Array list of replies
let relleno = ["aproximadamente unos", "aprox unos", "como", "creo que unos", "un total de"];
module.exports = {
	name: 'pajas',
	aliases: ['pallaringas','faps','manuelas'],
	description: 'Gregorio proporciona el cum worth del canal.',
//	args: true,
	usage: 'o grego faps/manuelas/pallaringas',
	execute(message, args) {
	let random = Math.floor(Math.random() * 5);
	let total = (db.get('gregoBot.nuts') * 14.7868).toFixed(2);
	if (args.length < 1) {
		message.channel.send(`mmmm eso hacen ${relleno[random]} ${total}ml`)
	}	else {
	if (args[0] === 'agregar') {
		if (args.length < 2) {
		db.add('gregoBot.nuts', 1)
		message.channel.send('listo, una mas')
	}	else if (args.length == 2) {
		db.add('gregoBot.nuts', args[1]);
		let result = db.get('gregoBot.nuts')
		message.channel.send(`listo, con eso hacen ${result}`);
		}
	}	else if ((args[0] === 'quitar')||(args[0] === 'reducir')||(args[0] === 'sustraer')||(args[0] === 'restar')) {
		if (args.length < 2) {
		db.subtract('gregoBot.nuts', 1)
		message.channel.send('cerati, una menos')
	}	else if (args.length == 2) {
		db.subtract('gregoBot.nuts', args[1]);
		let result = db.get('gregoBot.nuts')
		if (result < 0) {
			db.set('gregoBot.nuts', 0)
			console.log('La cantidad ha vuelto a 0.')
			message.channel.send(`es como volver a nacer`)
		} else message.channel.send(`listo, con eso hacen ${result}`);
		}
	}
	}
	return message.channel.stopTyping(true);
//Para esta parte tiene que devolver lo que es 1tbsp (14.7868ml)
//multiplicado por el número que haya almacenado en su base de datos
//correspondiente a la cantidad de imágenes que se hayan enviado a
//el canal de #monaschinas.
//Despues, poner un ".then" para luego entregar un dato curioso,
//por ejemplo: X mililitros corresponden a Y vasos de schop/Z botellas/2 tinas.
//o "lo que equivalen a 10 confores"/"que vienen a ser 2 confores industriales".
//Cuando se llegue a un milestone, genera una imágen con un caption. La imágen
//debe estar relacionada a la leche.
//Opcional: Darle un cooldown, es decir, un límite diario.
	},
};