var ba = require('beeradvocate-api');
let intros = ["aaah la", "ah se, la", "se, la"];
let proviene = ["proveniente de", "esa es de", "una maravilla de"];
module.exports = {
	name: 'chelas',
	aliases: ['chela','cerveza','cachai la','pilsen'],
	description: 'Gregorio dará información sobre cervezas.',
	args: true,
	usage: 'chela, oettinger',
	execute(message, args) {
	let random1 = Math.floor(Math.random() * 3);
	let random2 = Math.floor(Math.random() * 3);
	message.channel.startTyping();
	if (args.length < 1) {
	message.channel.send('DONDE??')
	return message.channel.stopTyping(true);
	} else if (args.length > 1) {
	message.channel.send('mucha wea, una a la vez porfa')
	return message.channel.stopTyping(true);
	} else
	ba.beerSearch(args[0], function(beers) {
    console.log(beers)
	if (args[0] === 'undefined') {
			message.channel.send('me suena wn, pero no me acuerdo que tal es');
			return message.channel.stopTyping(true);
		}
	else if ((args[0] === 'pico')||(args[0] === 'pene')||(args[0] === 'pichi')||(args[0] === 'pichí')||(args[0] === 'semen')) {
			message.channel.send({files: ['./memes/grillos.png']})
			.catch(() => console.error('Que onda?? No pude responder.'));
			return message.channel.stopTyping(true);
		}
	else message.channel.send(`${intros[random1]} ${beers.beer_name}, ${proviene[random2]} ${beers.brewery_location}`)
	.then (() => message.channel.send(`${beers.brewery_url}`))
	.then (() => message.channel.stopTyping(true))
	.catch(() => console.error('Algo pasó, pero no puedo terminar mi discurso'));
	})
	},
};