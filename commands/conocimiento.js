const Discord = require('discord.js');
const { API, } = require('nhentai-api');

module.exports = {
	name: 'hentie',
	aliases: ['hentai','manga','nh','nhentai','conocimiento'],
	description: 'Para la búsqueda del conocimiento',
	args: true,
	usage: 'nh, <valor entre 0 y 999999>',
	execute(message, args) {
        if ((message.channel.nsfw === false)&&(message.channel.id != 438754239494357004)) {
			return message.channel.send('en <#441386860300730378> si');
        }
		let random = Math.floor(Math.random()*380000);
        const api = new API();
        if (typeof args!=='undefined') {
			api.getBook(Number(random)).then(book => {
                api.getImageURL(book.cover);    // https://t.nhentai.net/galleries/343434/cover.jpg
                api.getImageURL(book.pages[1]); // https://i.nhentai.net/galleries/343434/2.jpg
                mangaInfo(book);
            })
            .catch(err => {
                console.error(err);
                return message.reply(`puta... intenta mas rato`);
            });
		} else if (isNaN.args[0]) {
			message.channel.send(`https://nhentai.to/g/${random}`);
		} else if ((args[0] == 34)||(args[0] == 3434)||(args[0] == 343434)) {
            message.channel.send({files: ['./memes/;momopatas;.png']})
            .catch(() => console.error('Que onda?? No pude responder.'));
		} else if (args[0].length > 6) {
            message.channel.send(`https://nhentai.to/g/${random}`)
            .then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
            .catch(() => console.error('Que onda?? No pude responder.'));
		} else if (args.length > 0) {
            api.getBook(Number(args[0])).then(book => {
                api.getImageURL(book.cover);    // https://t.nhentai.net/galleries/343434/cover.jpg
                api.getImageURL(book.pages[1]); // https://i.nhentai.net/galleries/343434/2.jpg
                mangaInfo(book);
            })
            .catch(err => {
                console.error(err);
                return message.channel.send(`puta... intenta mas rato`);
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
            .setURL(`https://nhentai.net/g/${nhArray[1]}`)
            .setAuthor({name:'Buscador de Conocimiento',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
            .setDescription(`**Tags:** ${nhTags}.`)
            //.setThumbnail('https://i.imgur.com/uLAimaY.png')
            .setImage(api.getImageURL(book.cover))
            .addField('Visitas', `${nhArray[2]}`, true)
            .addField('Favoritos', `${nhArray[3]}`, true)
            .setTimestamp(nhArray[5])
            .setFooter({text:'Fecha de publicación',iconURL:'https://i.imgur.com/uLAimaY.png'});//gregobot® 2021
			return message.reply({ embeds: [helpEmbed] });
        }
    },
};