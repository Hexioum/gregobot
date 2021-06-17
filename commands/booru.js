const Booru = require('booru');
const axios = require('axios');
var gis = require('g-i-s');
const db = require('quick.db');
const Discord = require('discord.js');
/*var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();*/
const sharp = require('sharp');
const client = new Discord.Client({ 
    ws: { intents: [
        'GUILDS',
        'GUILD_PRESENCES',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'] }
    });
client.commands = new Discord.Collection();

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#00B0F4')
	.setTitle('Aportes')
	.setURL('https://vimeo.com/434895153')
	.setAuthor('GregoBot Ayuda', 'https://i.imgur.com/ZmtGJgz.png')
	.setDescription('Gregorio comparte conocimiento al canal <#441386860300730378>.')
	.setThumbnail('https://i.imgur.com/9wVwEZu.gif')
	.addFields(
		{ name: 'Uso del comando', value: '**Ejemplo**: `Grego sacate uno`\nDa una imagen aleatoria buscando en 5 sitios booru distintos.\n\nSe puede especificar el personaje a buscar.\n**Ejemplo**: `gr postea, zelda`\n\nSi no se encuentra, intentar buscar con nombres de serie en paréntesis.\n**Ejemplo**: `gr aporta, type 95 (gfl)`\nO si es un nombre y apellido, intercambiarlos.\n**Ejemplo**: `gr busca, sakurai momoka`' }
	)
	.addField('Aliases adicionales', 'aporta, busca, colabora, comparte, dame, postea, sacate uno, skt1', false)
	.setTimestamp()
	.setFooter('gregobot® 2021');
    
module.exports = {
	name: 'booru',
	aliases: ['aporta','busca','busqueda','colabora','comparte','dame','postea','sacate uno','skt1'],
	description: 'Gregorio busca imágenes en distintas boorus por tí',
	args: true,
	usage: 'tags',
	execute(message, args) {
		if ((args[0] === 'ayuda')||(args[0] === 'help')||(args[0] === 'info')) {
			return message.channel.send(helpEmbed);
		};
		let member = message.author
        let retries = 0
        let nameIsflipped = false
		let random = Math.floor(Math.random() * 2);
        var url = "";
        var fileSize = '';
        let posts = [""]
        var boorus = [
            "konachan.com",
            "yande.re",
            "gelbooru",
            "danbooru"
        ];
        
        let poison = [
            "rating:explicit",
            "ass",
            "breasts",
            "bikini",
            "censored",
            "nipples",
            "pantsu",
            "uncensored"
        ];
        let randomPo = Math.floor(Math.random() * (poison.length - 1) + 1);

        let imgofDay = [
            "ass",//cow_print, monster_girl, lolita_fashion
            "breasts",//maid
            "bikini",//heterocromiércoles, wedding_dress, nurse
            "nipples",//thong thursday, japanese_clothes
            "nopan",//animal_ears, thong
            "sex",//demon_girl, succubus, horns
            "petite"//nun
        ];
        
        if ((typeof args[0] !== 'undefined')) {
            if ((args[0].toLowerCase().startsWith('sopp'))||(args[0].toLowerCase().includes('sopmod'))) {
                return message.channel.send('andate a la mierda nacho');
            } else {
                tagsFix(args[0]);    
                var gisOptions = {
                    searchTerm: `${args[0]} hentai`,
                    queryStringAddition: '&tbs=isz:l',  // Large images only
                    filterOutDomains: [
                        'blogspot.com',
                        'hentai-img.com',
                        'thatpervert.com',
                        'sh-cdn.com',
                        'hentaifox.com'
                    ]
                };
            };
        };

		if ((message.channel.nsfw === false)&&(message.channel.id != 438754239494357004)) {
			return message.channel.send('en <#441386860300730378> si');
        } else {
            shuffle(boorus);
            boorus.push("paheal"); // Add rule34 at the end of the array
            startBooru();
        };

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
        
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
          
              // Pick a remaining element...
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1;
          
              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
            console.log("Orden de boorus: "+array);
            return array;
        };

        function flipName(sentence) {
            var str = args[0];
            sentence = str.split(/_| /);
            console.log(`Volteando nombres: `+sentence);
            if (sentence.length > 1) {
                temporaryValue = sentence[0];
                sentence[0] = sentence[1];
                sentence[1] = temporaryValue;
                sentence = sentence.join("_");
                if (nameIsflipped === true) {
                    nameIsflipped = false;
                } else {
                    nameIsflipped = true;
                };
                if (sentence.startsWith('(')) {
                    return console.log("No hay nada que voltear.");
                } else {
                    console.log(`Ahora es: `+sentence);
                    args[0] = sentence
                    return sentence;
                };
            } else {
                return console.log("No hay nada que voltear.")
            }
        }

        async function tagsFix() {
		    if (args[0].toLowerCase().startsWith('m4 sop')) return message.channel.send('chancho qlo ojala te salga un tumor');
            if (args[0].toLowerCase().startsWith('m4_sop')) return message.channel.send('no');
            if (args[0].toLowerCase().startsWith('sopmod')) return args[0] = `warframe`;
            if (args[0].toLowerCase().startsWith('zelda')) {
                args[0] = args[0].toLowerCase().replace(/zelda+/gi, 'princess_zelda');
            } else if (args[0].toLowerCase() === 'leche') {
                args[0] = `lactation`
            } else if (args[0].toLowerCase() === 'rin tohsaka') {
                args[0] = `toosaka_rin`
            } else if (args[0].toLowerCase() === 'misty') {
                args[0] = `kasumi_(pokemon)`
            } else if (args[0].toLowerCase() === 'lisa') {
                args[0] = `lisa_(genshin_impact)`
            } else if (args[0].toLowerCase() === 'ganyu') {
                args[0] = `ganyu_(genshin_impact)`
            } else if (args[0].toLowerCase() === 'ganyu leche') {
                args[0] = `ganyu_(genshin_impact)`;
                poison.push('lactation');
                randomPo = poison.length-1;
            } else if (args[0].toLowerCase() === 'keqing') {
                args[0] = `keqing_(genshin_impact)`
            } else if (args[0].toLowerCase() === 'xiangling') {
                args[0] = `xiangling_(genshin_impact)`
            } else if (args[0].toLowerCase() === 'xiangling zorra pelua') {
                args[0] = `xiangling_(genshin_impact)`;
                poison.push('pubic_hair');
                randomPo = poison.length-1;
            } else if (args[0].toLowerCase() === 'bache') {
                args[0] = `bache_(azur_lane)`
            } else if (args[0].toLowerCase() === 'super shorty') {
                args[0] = `super_shorty_(girls_frontline)`
            } else if ((args[0].toLowerCase() === 'aa-12')||(args[0].toLowerCase() === 'aa12')) {
                args[0] = `aa-12_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'hk416') {
                args[0] = `hk416_(girls_frontline)`
            } else if ((args[0].toLowerCase() === 'pa-15')||(args[0].toLowerCase() === 'pa15')) {
                args[0] = `pa-15_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'p90') {
                args[0] = `p90_(girls_frontline)`
            } else if ((args[0].toLowerCase() === 'ro635')||(args[0].toLowerCase() === 'ro')) {
                args[0] = `ro635_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'ump9') {
                args[0] = `ump9_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'nyto') {
                if (random === 0) {
                    args[0] = `nyto_black_(girls_frontline)`
                } else {
                    args[0] = `nyto_polarday_(girls_frontline)`
                }
            } else if (args[0].toLowerCase() === 'sexo') {
                args[0] = `sex`;
                randomPo = 10;
            };
            args[0] = args[0].toLowerCase().replace(/\(al\)+/gi, '(azur_lane)');
            args[0] = args[0].toLowerCase().replace(/\(ba\)+/gi, '(blue_archive)');
            args[0] = args[0].toLowerCase().replace(/\(gfl\)+/gi, '(girls_frontline)');
            args[0] = args[0].toLowerCase().replace(/\(gi\)+/gi, '(genshin_impact)');
            args[0] = args[0].toLowerCase().replace(/\(uni\)+|\(unib\)+|\(unist\)+|\(uniclr\)+/gi, '(under_night_in-birth)');
            console.log(`Buscando ${args[0]}...`);
            var oneRegex = / poto+| culo+| ass+| raja+| posaderas+/gi ;
            var oneMatch = args.some(e => oneRegex.test(e));
            var twoRegex = / sopmod+| s0pm0d+| soppu+| sop mod+/gi ;
            var twoMatch = args.some(e => twoRegex.test(e));
            var thrRegex = / leche+| milk+| lechita+/gi ;
            var thrMatch = args.some(e => thrRegex.test(e));
            if (oneMatch === true) {
                poison.push('ass');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ poto+| culo+| ass+| raja+| posaderas+/gi, '');
                // Para remover las palabras pero conservar el resto
            } else if (twoMatch === true) {
                randomPo = 10;
                args[0] = `warframe`;
            } else if (thrMatch === true) {
                poison.push('lactation');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ leche+| milk+| lechita+/gi, '');
                // Para remover las palabras pero conservar el resto
            }
        };

		async function startBooru () {
            if ((boorus.length > 0)&&(retries < 5)) {
                try {
                    message.channel.startTyping();
                    console.log(`Boorus restantes: `+boorus);
                    await searchBoorus();
                } catch(err) {
                    retries = retries+1;
                    startBooru();
                    console.log("chucha:"+err+"\nReintentando...");
                } finally {
                    return message.channel.stopTyping(true);
                };
            } else if (retries === 5) {
                console.log("Buscando en Google Imágenes...");
                try {
                    gis(gisOptions, gisResults);
                } catch(err) {
                    retries = retries+1;
                    startBooru();
                    console.log("chucha:"+err+"\nReintentando...");
                };
            } else {
                message.channel.send(`<@${member.id}> no encontre niuna wea 🙁`);
                message.channel.stopTyping(true);
                return console.log("chucha: No encontré nada.");
            };
        };

		async function searchBoorus () {
        

        let cooldown = 300000; // 5 minutes in ms
        let lastSearch = await db.fetch(`grSearch_${message.author.id}`);

            //if (!message.member.hasPermission('ADMINISTRATOR')) {
            if (lastSearch !== null && cooldown - (Date.now() - lastSearch) > 0) {
                // If user still has a cooldown
                let timeObj = ms(cooldown - (Date.now() - lastSearch)); // timeObj.hours = 12
                // Await response from message author
                message.channel.send(`nah`).then(() => {
                    return message.channel.stopTyping(true);
                });
            } else {
                // Picks a random tag

                const channel = message.client.channels.cache.get('438754239494357004');
                const now = new Date(); // for reference, PST is UTC-8
                let day = now.getDay();
                const dayHours = now.getHours();
                
                if ((typeof args[0] !== 'undefined')) {
                    // Pone underscores donde en el comando pusieron espacios.
                    imgofDay[Number(day)-1] = args[0].toLowerCase().replace(/[ :]/gi, '_');
                }/* else {
                    poison[Number(randomPo)] = "rating:explicit"
                }*/
                if ((retries > 0)||(poison.length < 9)) {    // If not a forced tag
                    shuffle(poison);
                };
                
                var tags = [imgofDay[Number(day)-1],poison[Number(randomPo)]];

                if ((boorus[0] === "danbooru")||(retries > 4)) {
                    //Removes topic if it's danbooru because they limit their tag search, also remove if He ain't finding anything?
                    tags.splice(1,1);
                    //var booruRemoved = boorus.shift(); // Removes the first booru
                }
                console.log(tags);
                
                console.log(`Se buscó el tag ${imgofDay[Number(day)-1]} y ${poison[Number(randomPo)]} en ${boorus[Number(0)]}, para representar el día ${day}. Se supone que son las ${dayHours} hrs.`);
                
                // Check if the character exists
                let posts = await Booru.search(`${boorus[Number(0)]}`, imgofDay[Number(day)-1], { limit: 1, random: true })
                
                if (typeof posts[0] === 'undefined') {
                    console.log(`No encontré nada en ${boorus[Number(0)]}: Reintentando (${retries})...`);
                    if (nameIsflipped === true || !(args[0].includes("_"))) {
                        var booruRemoved = boorus.shift();  // Removes the first booru if the name was already flipped
                    };
                    await flipName(args[0]);                // Flip the name
                    retries = retries+1;
                    startBooru();                           // Searches again
                } else {
                    if (boorus[0] === "paheal") {
                        console.log("Regla 34 es.");
                        message.channel.send({files: [posts[0].fileUrl]});
                        message.channel.stopTyping(true);
                        esperarRespuesta();
                    } else {
                        let posts = await Booru.search(`${boorus[Number(0)]}`, tags, { limit: 1, random: true })
                        console.log(`Encontré esto: ${posts[0].fileUrl}\nScore: ${posts[0].score}\nRating: ${posts[0].rating}`);

                        if (typeof posts[0] === 'undefined') {
                            console.log(`No encontré nada en ${boorus[Number(0)]}: Reintentando (${retries})...`);
                            var booruRemoved = boorus.shift();  // Removes the first booru
                            retries = retries+1;
                            if (retries < 5) {
                                startBooru();                       // Searches again
                            } else {
                                //getFileSize(url);
                                gis(gisOptions, gisResults);
                            };
                        } else {
                            try {
                                if ((boorus[0] === "danbooru")&&(posts[0].rating === 's')) {
                                    console.log("Meh, busco otra");
                                    var booruRemoved = boorus.shift();  // Removes the first booru
                                    // Retry without adding to the "retries" counter
                                    startBooru(); // Searches again
                                } else {
                                    console.log("Esta está buena, la envío altiro.");
                                    url = posts[0].fileUrl;
                                    message.channel.send({files: [posts[0].fileUrl]})
                                    .catch(() => imgReduce(url));
                                    esperarRespuesta();
                                };
                            }
                            catch(err) {
                                console.log(`No... ${err}\nIntentaré convertir el archivo a jpg.`);
                                imgReduce(posts[0]);
                            }
                        }
                    }
                };
            }
        };

        function gisResults(error, results) {
            let random = Math.floor(Math.random() * Number(23-retries));
            if (error) {
                console.log(error);
            } else {
                console.log(JSON.stringify(results, null, '  '));
                if (results[Number(random)].width > 639) {
                    try {
                        console.log(`Enviando:\n${results[Number(random)].url}`);
                        message.channel.send({files: [results[Number(random)].url]});
                    } catch {
                        console.log("No puedo enviar el resultado de Google.");
                        retries = retries+1;
                        startBooru();
                    } finally {
                        message.channel.stopTyping(true);
                    }
                } else {
                    retries = retries+1;
                    if (retries < 8) {
                        gisResults();
                    } else {
                        console.log("Me rindo, no encuentro nada.");
                        message.channel.send(`<@${member.id}> no encontre niuna wea 🙁`);
                    }
                };
            }
        };
        
        // Usar esta función para reducir el tamaño de archivo si es que este excede el límite de subida de discord (8Mb)
		async function imgReduce () {
            console.log("Intentando reducir tamaño de archivo.");
			const imageResponse = await axios({url: url, responseType: 'arraybuffer'});
			theImage = Buffer.from(imageResponse.data, 'binary');
            await sharp(theImage)
            .jpeg({ mozjpeg: true })    // Use mozjpeg to reduce output JPEG file size (slower)
            .toBuffer()
            .then(function(outputBuffer) {
                console.log(`Reduciendo tamaño de archivo...`);
                message.channel.stopTyping(true);
                message.channel.send({ files: [outputBuffer] });
            })
            .catch(err => {
                message.channel.stopTyping(true);
                message.channel.send(posts[0].fileUrl);
                return console.error(`Bruh\n`+`*${err}*`);
            })
        };
        
		// Interacciones con reacciones.
		async function emojiMessage(message, validReactions) {
            for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && (!user.bot)
		message.channel.stopTyping(true);

        return message
            .awaitReactions(filter, {
                max: 1,
                time: 25000
            })
            .then(collected => collected.first() && collected.first().emoji.name)
			.then(() => message.reactions.remove(message.author.id))
			.catch(err => console.log("Oh: "+err));
		}

        async function esperarRespuesta() {
            let filter = m => m.author.id === message.author.id;
		/*	const emoji = await emojiMessage(message, ["👍", "🗑️"]);
            message.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 30000 }).then(collected => {
                    if (collected.first().emoji.name == '🗑️') {
                        message.edit('*MENSAJE BORRADO*');
                        console.log('Mensaje borrado.');
                    }
                    else
                        console.log('Operation canceled.')
                        .then(() => message.reactions.remove(message.author.id))
                        .catch(err => console.log("Oh: "+err));
            }).catch(() => {
                console.log('No reaction after 30 seconds, operation canceled')
                .then(() => message.reactions.removeAll())
                .catch(err => console.log("Oh: "+err));
            });*/
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 21000, // Wait 21 seconds
                errors: ['time']
            })
            .then(message => {
                message = message.first()
                if (message.content.toLowerCase().includes(`gracias`) || message.content.toLowerCase().includes(`agradecido`) || message.content.toLowerCase().includes(`buena`) || message.content.toLowerCase().includes(`wena`) || message.content.toLowerCase().includes(`based`) || message.content.toLowerCase().includes(`basado`) || message.content.toLowerCase().includes(`buenísima`) || message.content.toLowerCase().includes(` rica`)) {
                    message.channel.send({files: ['./memes/;tinttulo;.png']})
                } else if (message.content.toLowerCase().includes(`puta`) || message.content.toLowerCase().includes(`rachel`) || message.content.toLowerCase().includes(`wea mala`) || message.content.toLowerCase().includes(`mamala`) || message.content.toLowerCase().includes(`inculto`) || message.content.toLowerCase().includes(`no cacha`)) {
                    message.channel.send({files: ['./memes/chubis/triste.png']})
                } else if (message.content.toLowerCase().includes(`culiao`) || message.content.toLowerCase().includes(`qlo`) || message.content.toLowerCase().includes(`conchetumare`) || message.content.toLowerCase().includes(`ctm`) || message.content.toLowerCase().includes(`yapo`) || message.content.toLowerCase().includes(`chupala`)) {
                    message.channel.send({files: ['./memes/chubis/atomar.jpg']})
                } else if (message.content.toLowerCase().includes(`payaso`) || message.content.toLowerCase().includes(`maricon`) || message.content.toLowerCase().includes(`🤡`) || message.content.toLowerCase().includes(`puto`)) {
                    message.channel.send({files: ['./memes/chubis/avergonzao.jpg']})
                } else {
                    return console.log('Supongo que no me insultaron...');
                }
            })
            .catch(collected => {
                return console.log('Se acabó el tiempo, nadie me insultó. Gané.');
            });
        };

        function getFileSize(url) {
            console.log(`Entrando a la función getFileSize de:\n${url}`);
            fileSize = '';//var
            var http = new XMLHttpRequest();
            http.open('HEAD', url, true); // true = Asynchronous
            http.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    if (this.status === 200) {
                        fileSize = this.getResponseHeader('content-length');
                        console.log('fileSize = ' + fileSize);
                        // ok here is the only place in the code where we have our request result and file size ...
                        // the problem is that here we are in the middle of anonymous function nested into another function and it does not look pretty
                    }
                }
            };
            http.send(); // it will submit request and jump to the next line immediately, without even waiting for request result b/c we used ASYNC XHR call
            return ('At this moment, we do not even have Request Results b/c we used ASYNC call to follow with stupid JavaScript patterns');
        };

    },
};