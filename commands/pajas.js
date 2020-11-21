// Array list of replies
let replies = ["mmm", "mmmm", "eh?"];
module.exports = {
	name: 'pajas',
	description: 'Gregorio proporciona el cum worth del canal.',
	execute(message) {
	let random = Math.floor(Math.random() * 3);
		message.channel.send(replies[random]);
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