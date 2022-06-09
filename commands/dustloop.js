const Discord = require('discord.js');
const wiki = require('wikijs').default;

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#00B0F4')
	.setTitle('Dustloop')
	.setURL('https://www.dustloop.com/wiki/index.php?title=Main_Page')
	.setAuthor({name:'GregoBot Ayuda',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
	.setDescription('Gregorio proporciona un vasto conocimiento sobre los juegos de pelea.')
	.setThumbnail('https://www.dustloop.com/wiki/images/thumb/3/30/Dustloop_Wiki.png/175px-Dustloop_Wiki.png')
	.addFields(
		{ name: 'Uso del comando', value: '**Ejemplo**: grego fd, ky, dp' }
	)
	.addField('Aliases adicionales', 'dl, dustloop, fd, frame data, info, intel', false)
	.setTimestamp()
	.setFooter({text:'gregobot® 2021'});

const infoEmbed = new Discord.MessageEmbed()
    .setColor('#FF9C2C')
    .setTitle('Post')
	.setURL('https://www.dustloop.com/wiki/index.php?title=Main_Page')
    .setDescription('*No hay resultados*')
    .setFooter({text:'dustloop.com'});

    //chaos code, dengeki, melty blood, samsho v, skullgirls, under night.
const mizChars = [
    "adler",
    "bravo",
    "elektrosoldat",
    "eltnum",
    "hikaru",
    "perfecti",
    "phonon",
    "ray",
    "sai",
    "seth",
    "sion",
    "wagner"
    ]

const kiChars = [
    "aganos","arbiter","aria",
    "cinder",
    "eagle",
    "fulgore",
    "gargos","general raam","glacius",
    "hisako",
    "jago",
    "kan ra","kan-ra","kilgore","kim wu","kimwu",
    "maya","mira",
    "omen","orchid",
    "raam","rash","riptor",
    "sabrewulf","sadira","shadow jago","shin hisako","spinal",
    "thunder","tj combo","tusk"
    ]

module.exports = {
	name: 'dustloop',
	aliases: ['dl','fd','frame data','info','intel'],
	description: 'Para la tech en los juegos de pelea.',
	args: true,
	usage: 'dl, <nombre del personaje>, <comando>',
	execute(message, args) {
        if (typeof args[0] === 'undefined') {
            return message.reply({ embeds: [helpEmbed] });
        }
        if ((args[0] === 'ayuda')||(args[0] === 'help')||(args[0] === 'info')) {
			return message.reply({ embeds: [helpEmbed] });
		};
        
        var wikiApi = 'http://www.dustloop.com/wiki/api.php'
        var onWiki = true;

        if (typeof args!=='undefined') {
            main(args[0])//actualmente sólo se puede ingresar un parámetro de búsqueda.
            .catch(err => {
                console.error(err);
                return message.reply(`puta... intenta mas rato`);
            });
        } else if (args[0].length > 23) {//revisar aqui, para que compruebe en el orden correcto.
            message.channel.send(`mucho texto`)
            .then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
            .catch(() => console.error('Que onda?? No pude responder.'));
		} else if (args.length > 2) {
            message.channel.send(`maximo 2 argumentos`)
            .then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
            .catch(() => console.error('Que onda?? No pude responder.'));
		}
        return;
        
    async function fetchData(msg, results) {
        //ver si el pj corresponde a otra wiki
        if (kiChars.indexOf(args[0].toLowerCase()) > -1) {
            args[0] = args[0].toLowerCase().replace(/\s|[-]|general+/g, '');
            onWiki = false;
            return message.reply(`https://ki.infil.net/${args[0]}.html`);
        } else if (mizChars.indexOf(args[0].toLowerCase()) > -1) {
            wikiApi = 'https://wiki.gbl.gg/api.php';
        };
        results = wiki({
            apiUrl: wikiApi,
            origin: null
        }).search(msg)
            console.log(results);
            return results;
        }

    async function main() {
        console.log("Buscando tech...");
    var results = await fetchData(args[0], results);
        if (onWiki == true) {
            postEmbed(results);
        }
    }

    async function postEmbed (results) {
        var resList = results.results
        if (typeof resList === 'undefined') {
            return message.reply('no hay resultados al buscar **'+args[0]+'**')
        }
        //filtrar las pags de "Matchups", "Frame Data", "Strategy", "Combos"
        var res = resList.filter(s=>~s.indexOf("/"));
        if (res.length < 2) {
            return message.reply('no hay resultados al buscar **'+args[0]+'**')
        } else {
            res = res.slice(0,9);
            infoEmbed.setAuthor({name:'Dustloop Test',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
            .setTitle('Resultados de búsqueda')
            .setDescription(res.join('\n'));
            console.log(`Resultado Final:\n ${res}`);
            return message.reply({ embeds: [infoEmbed] });
        }
    }

    }
}