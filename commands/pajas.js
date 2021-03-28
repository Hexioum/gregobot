const db = require('quick.db');
// Array list of replies
let relleno = ["aproximadamente unos", "aprox unos", "como", "creo que unos", "un total de"];
let chamullo = ["lo que viene a ser", "osea", "es decir", "que vendria a ser", "lo que equivale a"]
module.exports = {
	name: 'pajas',
	aliases: ['pallaringas','faps','manuelas','manfinflas','manivelas','coom'],
	description: 'Gregorio proporciona el coom worth del canal.',
//	args: true,
	usage: 'o grego faps/manuelas/coom',
	execute(message, args) {
	let random1 = Math.floor(Math.random() * 5);
	let random2 = Math.floor(Math.random() * 5);
	let coinflip = Math.floor(Math.random() * 2);
	let total = (db.get('gregoBot.nuts') * 14.7868).toFixed(2);
	let bathtub = Math.floor(total / 158987);
	let barrels = Math.floor(total / 50000);
	let confort = Math.ceil((db.get('gregoBot.nuts')*55) / 4994);//nuts*90.8 = 1conf = 1342ml
	let bottles = Math.floor(total / 1250);
	let jars = Math.floor(total / 473.176);
	let latas = Math.floor(total / 350);
	//11cm * 5cuadros = nut. (el confort es de 5000cm) aprox 4994cm si fuesen cuadros perfectos.
	if (args.length < 1) {
		message.channel.startTyping()
		.then(() => message.channel.send(`mmmm eso hacen ${relleno[random1]} ${total}ml`))
		.catch(() => console.error('Que onda?? No pude responder.'));
	setTimeout(function(){
		if ((bathtub > 1)&&(coinflip == 1)) {
			message.channel.send(`${chamullo[random2]} ${bathtub} tinas.`);
		} else if (bathtub == 1) {
			message.channel.send(`${chamullo[random2]} una tina entera.`);
		} else if ((barrels > 1)&&(coinflip == 1)) {
			message.channel.send(`${chamullo[random2]} ${barrels} barriles de chela.`);
		} else if (barrels == 1) {
			message.channel.send(`${chamullo[random2]} un barril de chela`);
		} else if ((confort > 1)&&(coinflip == 1)) {
			message.channel.send(`${chamullo[random2]} al menos ${confort} confores de 50 metros`);
		} else if ((bottles > 1)&&(coinflip == 1)) {
			message.channel.send(`${chamullo[random2]} ${bottles} botellas de austral.`);
		} else if (bottles == 1) {
			message.channel.send(`${chamullo[random2]} una botella retornable.`);
		} else if ((jars > 1)&&(coinflip === 1)) {
			message.channel.send(`${chamullo[random2]} ${jars} frascos para poner figuritas.`);
		} else if (jars == 1) {
			message.channel.send(`${chamullo[random2]} ${jars} frasco para poner figuritas.`);
		} else if (latas > 1) {
			message.channel.send(`${chamullo[random2]} ${latas} latas de chela.`);
		} else if (latas == 1) {
			message.channel.send(`${chamullo[random2]} suficiente para llenar una lata de chela`);
		} else if (latas < 1) {
			message.channel.send({files: ['./memes/nooooooooooooooo.mp4']});
		} return message.channel.stopTyping(true);
	}, 200);
	}	else {
	if ((args[0] === 'agregar')||(args[0] === 'add')) {
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