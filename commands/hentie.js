const Discord = require('discord.js');
const bot = new Discord.Client({ 
ws: { intents: [
	'GUILDS',
	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS'] }
});
bot.commands = new Discord.Collection();
const { API, } = require('nhentai-api');

module.exports = {
	name: 'hentie',
	aliases: ['hentai','manga','nh','nhentai','conocimiento'],
	description: 'Gregorio hace la búsqueda por ti',
	args: true,
	usage: 'los números... que significan??',
	execute(message, args) {
		let random = Math.floor(Math.random()*350000);
        const api = new API();
        if ((args.length === 0)||(isNaN(args[0]))) {
			message.channel.send(`https://nhentai.to/g/${random}`);
		}
        if ((args[0] == 34)||(args[0] == 3434)||(args[0] == 343434)) {
            message.channel.send({files: ['./memes/;momopatas;.png']})
            .catch(() => console.error('Que onda?? No pude responder.'));
		}
        if (args[0].length > 6) {
            message.channel.send(`https://nhentai.to/g/${random}`)
            .then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
            .catch(() => console.error('Que onda?? No pude responder.'));
		}
        if (args.length > 0) {
            api.getBook(Number(args[0])).then(book => {
                api.getImageURL(book.cover);    // https://t.nhentai.net/galleries/343434/cover.jpg
                api.getImageURL(book.pages[1]); // https://i.nhentai.net/galleries/343434/2.jpg
            //  console.log(book);
                mangaInfo(book);
            })
            .catch(err => {
                console.error(err)
            });
		}
        return;
        
		async function mangaInfo (book) {
        //  TypeError: Converting circular structure to JSON
            var nhArray = Object.values(book);
        //  var nhTags = Object.values(nhArray[6]);
            var x = "";
            //let i = 0; i < ignoreList.length; i++
            for (let i = 0; i < book.tags.length; i++) {
                x += ", " + book.tags[i].name;
            }
            nhTags = x.substring(2);
            console.log(api.getImageURL(book.cover));
            const helpEmbed = new Discord.MessageEmbed()
            .setColor('#ED2553')
            .setTitle(nhArray[0].english)
            .setURL(`https://nhentai.to/g/${nhArray[1]}`)
            .setAuthor('Buscador de Conocimiento', 'https://i.imgur.com/ZmtGJgz.png')
            .setDescription(`**Tags:** ${nhTags}.`)
            .setThumbnail(api.getImageURL(book.cover))
            .addField('Visitas', `${nhArray[2]}`, true)
            .addField('Favoritos', `${nhArray[3]}`, true)
            .setTimestamp(`Publicado el: ${nhArray[5]}`)
            .setFooter('gregobot® 2021');
			return message.channel.send(helpEmbed);
        }
    },
};