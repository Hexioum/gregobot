module.exports = {
	name: 'decide',
	aliases: ['elige','elije','escoge','escoje'],
	description: 'Gregorio será el juez.',
	args: true,
	usage: '<opcion1>, <opcion2>',
	execute(message, args) {
	message.channel.startTyping();
setTimeout(function(){
	let pos = args.indexOf("o")
	if (pos >= 0)
		args.splice(pos, 1);
	let pos2 = args.indexOf("entre")
	if (pos2 >= 0)
		args.splice(pos2, 1);
	let pos3 = args.indexOf("gear")
	if (pos3 >= 0)
		args.splice(pos3, 1);
	let random = Math.floor(Math.random()*args.length)
		console.log(args)
		console.log(`Se le han proporcionado a Grego ${args.length} opciones y eligió la número ${random}`)
		if (args.length < 2) {
			message.channel.send('faltan opciones');
		}
		else if (args[0] === 'o') {
			message.channel.send('!?!?!?!?!?');
		}
		else if (args[random] === 'o') {
			message.channel.send(`${args[0]}`);
		}
		else if (args[random] === 'ki') {
			message.channel.send('killer es');
		}
		else if (args[random] === 'mbaa') {
			message.channel.send('melty es');
		}
		else if (args[random].includes === 'guilty gear') {
			message.channel.send('guilty es');
		}
		else if (args[random].includes === 'lgbt') {
			message.channel.send('que asco 🙁')
			.catch(() => console.error('Que onda?? No pude responder.'));
		}
		else if (args[random] === 'ser gay') {
			message.channel.send({files: ['./memes/grillos.png']})
			.catch(() => console.error('Que onda?? No pude responder.'));
		}
		else if (args[random] === 'ser negro') {
			message.channel.send('no sabria decirte')
			.catch(() => console.error('Que onda?? No pude responder.'));
		}
		else if (args[random] === 'pico') {
			message.channel.send({files: ['./memes/grillos.png']})
			.catch(() => console.error('Que onda?? No pude responder.'));
		}
		else if (args[random] === 'pene') {
			message.channel.send({files: ['./memes/grillos.png']})
			.catch(() => console.error('Que onda?? No pude responder.'));
		}
		else if (args[random] === 'patas') {
			message.channel.send({files: ['./memes/momopatas.png']})
			.catch(() => console.error('Que onda?? No pude responder.'));
		}
		else message.channel.send(args[random])
		return message.channel.stopTyping(true);
	}, 250);
}};