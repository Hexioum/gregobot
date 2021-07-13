const Booru = require('booru');
const axios = require('axios');
var gis = require('g-i-s');
const db = require('quick.db');
const Discord = require('discord.js');
const sharp = require('sharp');

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
	.addField('Aliases adicionales', 'aporta, busca, colabora, comparte, postea, sacate uno, skt1', false)
	.setTimestamp()
	.setFooter('gregobot® 2021');

const gflChars = [
    "43m", "6p62", "9a-91",
    "a-91", "aa-12", "aat-52", "ads", "aek-999", "ak-12", "ak-15", "ak-47", "ak-74u", "ak-alfa",
    "ameli", "an94", "ar70", "art556", "arx-160", "as val", "ash-12.7", "astra", "aug",
    "ballista", "bren ten", "bren",
    "c-93", "c-ms", "c96", "carcano m1891", "carcano m91/38", "caws", "cf05",
    "contender", "cr-21", "cz-52", "cz-805", "cz2000", "cz75",
    "dp-12", "dp28", "dsr-50",
    "em-2", "evo 3",
    "f1", "f2000", "fal", "falcon", "famas", "fg42", "five-seven",
    "fmg-9", "fnc", "fnp9", "fp-6",
    "g11", "g17", "g28", "g3", "g36", "g36c", "g41", "g43",
    "galil", "gepard m1", "gr hk45", "grizzly", "gsh-18",
    "hk33", "hk416", "hmg21", "honey badger", "howa 89", "hp-35", "hs2000",
    "idw", "ingram", "ithaca m37", "iws-2000", "jericho", "js 9", "js05",
    "k11", "k2", "k3", "k31", "k5", "kac-pdw", "kar98k", "klin", "ks-23", "ksg", "ksvk",
    "l85a1", "lee-enfield", "lewis gun", "liberator", "lwmmg",
    "m1 garand", "m1014", "m12", "m14", "m16a1", "m1887", "m1895 cb", "m1895", "m1897", "m1911", "m1918 bar", "m1919a4", "m1a1",
    "m200", "m21", "m249 saw", "m2hb", "m3", "m38", "m45", "m4a1", "m500", "m590", "m60",
    "m82", "m82a1", "m870", "m9", "m950a", "m99", "magal", "makarov", "mdr",
    "mg23", "mg3", "mg34", "mg36", "mg4", "mg42", "mg5", "micro uzi", "mk 12", "mk23", "mk46", "mk48",
    "model l", "mosin-nagant", "mp-443", "mp-446", "mp-448", "mp40", "mp5", "mp7", "mt-9", "mz75",
    "negev", "ns2000", "ntw-20",
    "ots-12", "ots-14", "ots-39", "ots-44",
    "p08", "p22", "p226", "p30", "p38", "p7", "p90", "p99", "pa-15", "pk", "pkp",
    "pp-19", "pp-19-01", "pp-2000", "pp-90", "ppk", "pps-41", "ppsh-41", "psg-1", "psm", "ptrd", "px4 storm", "python", "pzb39",
    "qjy-88",
    "r5", "r93", "rfb", "ribeyrolles", "rmb-93", "ro635", "rpd", "rpk-16", "rt-20", "s.a.t.8", "saa", "saf", "saiga-12", "sar-21",
    "scw", "scarecrow", "serdyukov", "shipka", "sig-510", "sig-556", "six12", "skorpion", "sks", "sl8",
    "spas-12", "spectre-m4", "spitfire", "spp-1", "spr a3g", "springfield", "sr-3mp", "srs", "ssg 69",
    "st ar-15", "stechkin", "sten mkii", "steyr scout", "stg44", "suomi", "super sass", "super-shorty",
    "sv-98", "svd", "svt-38", "t-5000", "t-cms", "t65", "t77", "t91", "tabuk", "tac-50", "tar-21", "tec-9",
    "thompson", "thunder", "tmp", "tokarev", "type 56-1", "type 56r", "type 59", "type 62", "type 63", "type 64",
    "type 79", "type 80", "type 81", "type 88", "type 95", "type 92", "type 97", "type 97 shotgun", "type 100",
    "ukm-2000", "ump40", "ump45", "ump9", "usas-12", "usp compact",
    "vector", "vm59",
    "wa2000", "webley", "welrod mk2", "welrod mkii", "wz.29",
    "x95", "xm3", "xm8",
    "z-62", "zas m21", "zas m76", "zb-26"
]
    
module.exports = {
	name: 'booru',
	aliases: ['aporta','busca','busqueda','colabora','comparte','postea','sacate uno','skt1'],
	description: 'Gregorio busca imágenes en distintas boorus por tí',
	args: true,
	usage: 'tags',
	execute(message, args) {
		if ((args[0] === 'ayuda')||(args[0] === 'help')||(args[0] === 'info')) {
			return message.channel.send(helpEmbed);
		};
		let member = message.author
        var booruCd = db.add(`booru_cd.${member.id}.rolls`, 1);
        const date = new Date(); // for reference, PST is UTC-8
        var minutos = date.getMinutes();
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
            if ((args[0].toLowerCase().startsWith('sopp'))||(args[0].toLowerCase().includes('sopmod'))||(args[0].length > 34)) {
                return message.channel.send('meh');
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
                        'preview.redd.it',
                        'external-preview.redd.it',
                        'hentaifox.com'
                    ]
                };
            };
        };
        
        console.log(db.get(`booru_cd.${member.id}.rolls`));
        
		if ((message.channel.nsfw === false)&&(message.channel.id != 438754239494357004)) {
			return message.channel.send('en <#441386860300730378> si');
        } else {
            shuffle(boorus);
            boorus.push("paheal");                      // Add rule34 at the end of the array
            if (db.get(`booru_cd.${member.id}.rolls`) < 3) {
                startBooru();
            } else {
                message.channel.send(`**${message.author.username}**, la ruleta está limitada a 2 usos cada 2 horas (la hora punta). **${60-minutos}** min restante(s).`);
            };
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
		    if (args[0].toLowerCase().startsWith('w (a')) return message.channel.send('chancho qlo ojala te salga un tumor');
            if (args[0].toLowerCase().startsWith('m4_sop')) return message.channel.send('no');
            if (args[0].toLowerCase().startsWith('sopmod')) return args[0] = `warframe`;
            if (args[0].toLowerCase().startsWith('zelda')) {
                args[0] = args[0].toLowerCase().replace(/zelda+/gi, 'princess_zelda');
            } else if (args[0].toLowerCase() === 'cp') {
                args[0] = `loli`
            } else if (args[0].toLowerCase() === 'leche') {
                args[0] = `lactation`
            } else if (args[0].toLowerCase() === 'rin tohsaka') {
                args[0] = `toosaka_rin`
            } else if ((args[0].toLowerCase() === 'javier perez')||(args[0].toLowerCase() === 'javier penes')) {
                args[0] = `jujutsu_kaisen`
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
            } else if (args[0].toLowerCase() === 'klee meao') {
                args[0] = `klee_(genshin_impact)`;
                poison.push('urine');
                randomPo = poison.length-1;
            } else if (args[0].toLowerCase() === 'bache') {
                args[0] = `bache_(azur_lane)`
            } else if (args[0].toLowerCase() === 'super shorty') {
                args[0] = `super_shorty_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'calico m950a') {
                args[0] = `m950a_(girls_frontline)`
            } else if ((args[0].toLowerCase() === 'ro635')||(args[0].toLowerCase() === 'ro')) {
                args[0] = `ro635_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'nyto') {
                if (random === 0) {
                    args[0] = `nyto_black_(girls_frontline)`
                } else {
                    args[0] = `nyto_polarday_(girls_frontline)`
                }
            } else if (args[0].toLowerCase() === 'sexo') {
                args[0] = `sex`;
                randomPo = 10;
            } else if (args[0].toLowerCase() === 'porno') {
                args[0] = `porno_(dohna_dohna)`
            } else if (gflChars.indexOf(args[0]) > -1) {
                args[0] = `${args[0]}_(girls_frontline)`
            };
            args[0] = args[0].toLowerCase().replace(/100%+/gi, '100_percent');
            args[0] = args[0].toLowerCase().replace(/\(ak\)+/gi, '(arknights)');
            args[0] = args[0].toLowerCase().replace(/\(al\)+/gi, '(azur_lane)');
            args[0] = args[0].toLowerCase().replace(/\(ba\)+/gi, '(blue_archive)');
            args[0] = args[0].toLowerCase().replace(/\(fgo\)+/gi, '(fate/grand_order)');
            args[0] = args[0].toLowerCase().replace(/\(gfl\)+/gi, '(girls_frontline)');
            args[0] = args[0].toLowerCase().replace(/\(gi\)+/gi, '(genshin_impact)');
            args[0] = args[0].toLowerCase().replace(/\(uni\)+|\(unib\)+|\(unist\)+|\(uniclr\)+/gi, '(under_night_in-birth)');
            args[0] = args[0].toLowerCase().replace(/\(dohna\)+|\(dd\)+/gi, '(dohna_dohna)');
            console.log(`Buscando ${args[0]}...`);
            var oneRegex = / poto+| culo+| ass+| raja+| posaderas+/gi ;
            var oneMatch = args.some(e => oneRegex.test(e));
            var twoRegex = / sopmod+| s0pm0d+| soppu+| sop mod+| gore+| grego+| gregorio+/gi ;
            var twoMatch = args.some(e => twoRegex.test(e));
            var trdRegex = / leche+| milk+| lechita+/gi ;
            var trdMatch = args.some(e => trdRegex.test(e));
            var fthRegex = / meao+| pichi+| pichí+/gi ;
            var fthMatch = args.some(e => fthRegex.test(e));
            if (oneMatch === true) {
                poison.push('ass');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ poto+| culo+| ass+| raja+| posaderas+/gi, '');
                // Para remover las palabras pero conservar el resto
            } else if (twoMatch === true) {
                randomPo = 10;
                args[0] = `warframe`;
            } else if (trdMatch === true) {
                poison.push('lactation');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ leche+| milk+| lechita+/gi, '');
            } else if (fthMatch === true) {
                poison.push('urine');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ meao+| pichi+| pichí+/gi, '');
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
