const Discord = require('discord.js');
const wiki = require('wikijs').default;
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const bot = new Discord.Client({ 
    intents: ['GUILDS','GUILD_PRESENCES','GUILD_MEMBERS','GUILD_MESSAGES','GUILD_MESSAGE_REACTIONS'] }
    );

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
	.addField('Aliases adicionales', 'dl, dustloop, fd, frame data, miz, mizuumi, wiki', false)
	.setTimestamp()
	.setFooter({text:'gregobot® 2021'});

const infoEmbed = new Discord.MessageEmbed()
    .setColor('#FF9C2C')
    .setTitle('Post')
	.setURL('https://www.dustloop.com/wiki/index.php?title=Main_Page')
    .setDescription('*No hay resultados*')
    .setFooter({text:'dustloop.com'});

const dlpChars = [
    "answer",
    "ky","ky kiske",
    "ruby rose",
    "sol", "sol badguy"
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
const mizChars = [//Evitar pjs que aparecen en ambas wikis, como los de UNIB en BBTag.
    "adler","annie",
    "beowulf","big band","bravo",
    "cerebella",
    "double",
    "elektrosoldat","eliza","eltnum",
    "filia","fukua",
    "haohmaru","hikaru",
    "main","michael","michael roa","ms. fortune",
    "painwheel","parasoul","peacock","perfecti","phonon",
    "ray","roa","robo-fortune",
    "saber","sai","seth","sion","squigly",
    "umbrella",
    "valdamjong","valentine",
    "wagner"
    ]

module.exports = {
	name: 'dustloop',
	aliases: ['dl','fd','frame data','miz','mizuumi','wiki'],
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
        
        var wikiName = 'Dustloop'
        var wikiApi = 'http://www.dustloop.com/wiki/api.php'
        var onWiki = true;

        if (args[0].includes('/')) {
            buildResult(args[0])
            .catch(err => {
                console.error(err);
                return message.reply(`puta... intenta mas rato`);
            });
		} else if (args[0].length > 23) {
            message.channel.send(`mucho texto`)
            .then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
            .catch(() => console.error('Que onda?? No pude responder.'));
		} else if (args.length > 2) {
            message.channel.send(`maximo 2 argumentos`)
            .then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
            .catch(() => console.error('Que onda?? No pude responder.'));
		} else {
            main(args[0])//actualmente sólo se puede ingresar un parámetro de búsqueda.
            .catch(err => {
                console.error(err);
                return message.reply(`puta... intenta mas rato`);
            });
        }
        return;
        
        async function fetchDataDl(msg, results) {
            results = wiki({
                apiUrl: 'http://www.dustloop.com/wiki/api.php',
                origin: null
            }).search(msg)
                console.log(results);
                return results;
        }

        async function fetchDataMz(msg, results) {
            //ver si el pj corresponde a otra wiki
            results = wiki({
                apiUrl: 'https://wiki.gbl.gg/api.php',
                origin: null
            }).search(msg)
                console.log(results);
                return results;
            }

        async function fetchPage(msg, results) {
            results = wiki({
                apiUrl: wikiApi,
                origin: null
            }).page(msg)
            .then(page =>
                page
                    .chain()
                    .summary()
                    .image()
                    .request()
            )
                return results;
            }

    async function main() {
        console.log("Buscando tech...");
        //ver si el pj corresponde a otra wiki
        if (kiChars.indexOf(args[0].toLowerCase()) > -1) {
            args[0] = args[0].toLowerCase().replace(/\s|[-]|general+/g, '');
            onWiki = false;
            return message.reply(`https://ki.infil.net/${args[0]}.html`);
        } else if (dlpChars.indexOf(args[0].toLowerCase()) > -1) {//Para que busque solo en Dustloop y ahorre tiempo.
            var resultsDl = await fetchDataDl(args[0], resultsDl);
            wikiName = 'Dustloop';
            //wikiApi = 'http://www.dustloop.com/wiki/api.php'
            var results = resultsDl.results;
        } else if (mizChars.indexOf(args[0].toLowerCase()) > -1) {//Para que busque solo en Mizuumi y ahorre tiempo.
            var resultsMz = await fetchDataMz(args[0], resultsMz);
            wikiName = 'Mizuumi';
            //wikiApi = 'https://wiki.gbl.gg/api.php';
            var results = resultsMz.results;
        } else {
            var resultsDl = await fetchDataDl(args[0], resultsDl);
            if (resultsDl.results.length > 0) {
                wikiName = 'Dustloop';
            }
            var resultsMz = await fetchDataMz(args[0], resultsMz);
            if (resultsMz.results.length > 0) {
                wikiName = wikiName+'Mizuumi';
            }
            var results = resultsDl.results.concat(resultsMz.results);
            if (wikiName == 'DustloopMizuumi') {
                wikiName = 'Dustloop / Mizuumi';
                //hay posibilidad de que muestre ambas wikis pero despues filtre todos los resultados de uno.
            }
            console.log(results);
        };
        if (onWiki == true) {
            postEmbed(results);
        };
    }

    async function postEmbed (results) {
        var resList = results
        if (typeof resList === 'undefined') {
            return message.reply('no hay resultados al buscar **'+args[0]+'**');
        }
        console.log(typeof resList);
        //Buscar en ambas wikis al mismo tiempo, como los pjs que aparecen en UNIB y BBTAG.
        //Permitir buscar personajes de melty como h-roa, f-hime, c-maids.
        //Evitar la busqueda de juegos, limitarla solo a personajes. O quizas dar la lista de personajes y solo eso.
        var res = resList.filter(s=>~s.indexOf("/"))
        .filter(s => !s.match(/\/Data+|BBCP\/+|BBCS2+|DFC1+|Changelog+|Combos+|Controls+|EXVSMBON+|FAQ+|\/Fighting +|Frame Data+|Frametool+|GG\/+|GGAC\/+|GGReload+|GGXRD-R\/+|Glossary+|HUD+|Links+|Matchup+|MBAA\/+|Menus+|Netplay+|Normal+|Okizeme+|PS2+|Reflector+|Resources+|Starter+|Story+|Strategy+|\/System+|template+|UNIEL+|UNIST+/i))
        .slice(0,20);
        if (res.length < 1) {
            if (wikiName!= 'Mizuumi') {
                wikiName = 'Mizuumi'
                wikiApi = 'https://wiki.gbl.gg/api.php';
                main();
            } else {
            return message.reply('no hay resultados al buscar **'+args[0]+'**')
            }
        } else {
            if (res.length > 1) {
                var lenDesc = res.length+' artículos'
            } else {
                buildResult();
            }
            infoEmbed.setAuthor({name:'Tech Finder',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
            .setTitle('Resultados de búsqueda')
            .setDescription('Encontrado '+lenDesc+'.')
            .setFooter({text: wikiName});
            console.log(`Resultado Final:\n ${res}`);

            var results = res.map(x => x.split('/', 2));
            var resLast = [];
            var resultFinal = [];
            for (var i = 0; i < res.length; i++) {
                resLast[i] = res[i].split(/[\/]+/);
                if ((resLast[i][0] == 'Melty Blood' && resLast[i][1].includes('MB'))||(resLast[i][0] == 'Under Night In-Birth' && resLast[i][1].includes('UNI'))) {
                    resLast[i].shift();
                };
                if (resLast[i][0] === 'BBCF') {
                    resLast[i][0] = `BlazBlue Centralfiction`
                } else if (resLast[i][0] === 'BBCPE') {
                    resLast[i][0] = `BlazBlue Chronophantasma Extend`
                } else if (resLast[i][0] === 'BBCSE') {
                    resLast[i][0] = `BlazBlue Continuum Shift Extend`
                } else if (resLast[i][0] === 'BBTag') {
                    resLast[i][0] = `BlazBlue Cross Tag Battle`
                } else if (resLast[i][0] === 'GBVS') {
                    resLast[i][0] = `Granblue Fantasy: Versus`
                } else if (resLast[i][0] === 'GG2') {
                    resLast[i][0] = `Guilty Gear 2: Overture`
                } else if (resLast[i][0] === 'GGACR') {
                    resLast[i][0] = `Guilty Gear Accent Core +R`
                } else if (resLast[i][0] === 'GGML') {
                    resLast[i][0] = `Guilty Gear: Missing Link`
                } else if (resLast[i][0] === 'GGST') {
                    resLast[i][0] = `Guilty Gear Strive`
                } else if (resLast[i][0] === 'GGXRD') {
                    resLast[i][0] = `Guilty Gear Xrd -SIGN-`
                } else if (resLast[i][0] === 'GGXRD-R2') {
                    resLast[i][0] = `Guilty Gear Xrd Rev2`
                } else if (resLast[i][0] === 'MBAACC') {
                    resLast[i][0] = `Melty Blood Actress Again Current Code`
                } else if (resLast[i][0] === 'MBTL') {
                    resLast[i][0] = `Melty Blood Type Lumina`
                } else if (resLast[i][0] === 'UNICLR') {
                    resLast[i][0] = `Under Night In-Birth Exe:Late[cl-r]`
                } else if (resLast[i][0] === 'UNIEL') {
                    resLast[i][0] = `Under Night In-Birth Exe:Late`
                } else if (resLast[i][0] === 'UNIST') {
                    resLast[i][0] = `Under Night In-Birth Exe:Late[st]`
                }
                //console.log(resLast);
                if (resLast[i].length > 2 && results[i][1]!= resLast[resLast.length-1]) {
                    resLast[i][1] = `${resLast[i][1]} (${resLast[i][resLast[i].length-1]})`
                };
                resultFinal[i] = {description:resLast[i][0],label:resLast[i][1],value:res[i]};
                //console.log(resultFinal[i]);
            }
            console.log(resultFinal);

            const menu = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('dustloop')
					.setPlaceholder('Selecciona un resultado')
					.addOptions([resultFinal])
			);

            await message.reply({ embeds: [infoEmbed], components: [menu] });
        }
    }

    async function buildResult () {
        let search = args[0];
        let results = [];
        fetchPage(search,results);
        console.log(results);
        infoEmbed.setAuthor({name:'Tech Finder',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
        .setTitle('Nombre Personaje')
        .setDescription('Overview')
        .setFooter({text: wikiName});
        await message.reply({ embeds: [infoEmbed], components: [] });
    }

    }
}