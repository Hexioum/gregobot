module.exports = {
	name: 'decide',
	aliases: ['elige','elije','escoge','escoje'],
	description: 'Gregorio será el juez.',
	args: true,
	usage: '<opcion1>, <opcion2>',
	execute(message, args) {
	message.channel.sendTyping();
	// Banned
	var oneRegex = / homof+| homoph+| nazi+| racist+/gi ;
	var oneMatch = args.some(e => oneRegex.test(e));
	var twoRegex = / argentino+| boliviano+| peruano+| venezolano+| venaco+| haitiano+/gi ;
	var twoMatch = args.some(e => twoRegex.test(e));
	// Not banned, he actually likes these things?
	var trdRegex = / furro+| furry+| fursona+| fursuit+| zoof+/gi ;
	var trdMatch = args.some(e => trdRegex.test(e));
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
				message.reply('faltan opciones');
			}
			else if (args[0] === 'o') {
				message.reply('!?!?!?!?!?');
			}
			else if (trdMatch === true) {
				message.reply('por ultima vez... SOY YIFFER')
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random] === 'o') {
				message.reply(`${args[0]}`);
			}
			else if (args[random] === 'ki') {
				message.reply('killer es');
			}
			else if (args[random] === 'mbaa') {
				message.reply('melty es');
			}
			else if (args[random] === 'guilty gear') {
				message.reply('guilty es');
			}
			else if (args[random].toLowerCase() === 'ser gay') {
				message.reply({files: ['./memes/grillos.png']})
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random].toLowerCase() === 'ser negro') {
				message.reply('no sabria decirte')
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random].toLowerCase() === 'pico') {
				message.reply({files: ['./memes/grillos.png']})
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random].toLowerCase() === 'pene') {
				message.reply({files: ['./memes/grillos.png']})
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random].toLowerCase() === 'tula') {
				message.reply({files: ['./memes/grillos.png']})
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random].toLowerCase() === 'pichula') {
				message.reply({files: ['./memes/grillos.png']})
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (args[random] === 'patas') {
				message.reply({files: ['./memes/momopatas.png']})
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (twoMatch === true) {
				message.reply('mejor morir')
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			else if (oneMatch === true) {
				message.reply('🤷🏻‍♂️')
				.catch(() => console.error('Que onda?? No pude responder.'));
			}
			//	Removes special symbols.
			else message.reply(args[random].replace(/[^\w\s\xc0-\xff]/gi, ''))
		}, 2000);
	}
};