const Booru = require('booru');
const axios = require('axios');
const parser = require('cron-parser');
var gis = require('g-i-s');
var md5 = require('md5');
const db = require('quick.db');
const Discord = require('discord.js');
const sharp = require('sharp');

//Troubleshoot
const disableCommand = false;
const disableTyping = false;

const helpEmbed = new Discord.MessageEmbed()
	.setColor('#00B0F4')
	.setTitle('Aportes')
	.setURL('https://vimeo.com/434895153')
	.setAuthor({name:'GregoBot Ayuda',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
	.setDescription('Gregorio comparte conocimiento al canal <#441386860300730378>.')
	.setThumbnail('https://i.imgur.com/9wVwEZu.gif')
	.addFields(
		{ name: 'Uso del comando', value: '**Ejemplo**: `Grego sacate uno`\nDa una imagen aleatoria buscando en 5 sitios booru distintos.\n\nSe puede especificar el personaje a buscar.\n**Ejemplo**: `gr postea, zelda`\n\nSi no se encuentra, intentar buscar con nombres de serie en paréntesis.\n**Ejemplo**: `gr aporta, type 95 (gfl)`\nO si es un nombre y apellido, intercambiarlos.\n**Ejemplo**: `gr busca, sakurai momoka`' }
	)
	.addField('Aliases adicionales', 'aporta, busca, colabora, comparte, postea, sacate uno, skt1', false)
	.setTimestamp()
	.setFooter({text:'gregobot® 2021'});

const booruEmbed = new Discord.MessageEmbed()
    .setColor('#FF9C2C')
    .setTitle('Post')
    .setURL('https://vimeo.com/434895153')
    .setDescription('Tags')
    .setFooter('Booru');

const alChars = [
    "amagi",
    "atago",
    "bache",
    "baltimore",
    "belfast",
    "bismarck",
    "bremerton",
    "dido",
    "enterprise",
    "essex",
    "formidable",
    "illustrious",
    "honolulu",
    "kawakaze",
    "laffey",
    "lappland",
    "le malin",
    "shimakaze",
    "sirius",
    "south dakota",
    "st. louis",
    "washington",
]

const fateapoChars = [
    "jack the ripper", "jeanne d'arc"
]

const fateChars = [
    "benienma",
    "euryale",
    "francis drake",
    "helena blavatsky",
    "ibaraki douji",
    "minamoto no raikou",
    "minamoto no yorimitsu",
    "nero claudius",
    "shuten douji",
    "stheno",
    "tamamo no mae"
]

const fateexChars = [
    "alice", "caster", "nursery rhyme"
]

const fategoChars = [
    "abigail williams",
    "cleopatra",
    "kiyohime",
    "mashu",
    "mata hari",
    "miyamoto musashi",
    "nitocris",
    "tiamat",
    "ushiwakamaru"
]

const gbfChars = [
    "alba","alexiel","alicia","aliza","almeida","anila","anthuria","augusta","azrael",
    "beatrix","cagliostro","camieux","carmelina","catura","charlotta","chloe","clarisse","cucouroux",
    "danua","djeeta","erin","esser","europa","ferry","fraux","friday","gabriel",
    "halluel","helel ben shalem","heles","illnott","ilsa","io","izmir","jessica",
    "karva","katalina","korwa","kumbhira","la coiffe","lecia","leviathan","lily","lyria",
    "magisa", "malluel", "maria theresa", "mary", "medusa", "metera", "mirin",
    "narmaya","nier","nio","orchid","pholia","predator","razia","rosamia","rosetta",
    "sarasa","satyr","scathacha","selfira","sen","shitori","shura","silva","societte","song","sturm",
    "tabina","tanya","therese","vajra","vikala","vira","yggy","yuel","yuisis","zeta","zooey"
]

const gflChars = [//removed "bren ten"
    "43m","6p62","9a-91","a-91","aa-12","aat-52","ads","aek-999","ak-12","ak-15","ak-47","ak-74u","ak-alfa",
    "ameli", "an94", "ar70", "art556", "arx-160", "as val", "ash-12.7", "astra", "aug", "ballista", "bren",
    "c-93", "c-ms", "c96", "carcano m1891", "carcano m91/38", "caws", "cf05",
    "contender", "cr-21", "cz-52", "cz-805", "cz2000", "cz75", "dp-12", "dp28", "dsr-50", "em-2", "evo 3",
    "f1", "f2000", "fal", "falcon", "famas", "fg42", "five-seven", "fmg-9", "fnc", "fnp9", "fp-6",
    "g11", "g17", "g28", "g3", "g36", "g36c", "g41", "g43", "galil", "gepard m1", "gr hk45", "grizzly", "gsh-18",
    "hk33", "hk416", "hmg21", "honey badger", "howa 89", "hp-35", "hs2000",
    "idw", "ingram", "ithaca m37", "iws-2000", "jericho", "js 9", "js05",
    "k11", "k2", "k3", "k31", "k5", "kac-pdw", "kar98k", "klin", "ks-23", "ksg", "ksvk",
    "l85a1", "lee-enfield", "lewis gun", "liberator", "lwmmg",
    "m1 garand", "m1014", "m12", "m14", "m16a1", "m1887", "m1895 cb", "m1895", "m1897", "m1911", "m1918 bar", "m1919a4", "m1a1",
    "m200", "m21", "m249 saw", "m2hb", "m3", "m38", "m45", "m4a1", "m500", "m590", "m60",
    "m82", "m82a1", "m870", "m9", "m950a", "m99", "magal", "makarov", "mdr",
    "mg23", "mg3", "mg34", "mg36", "mg4", "mg42", "mg5", "micro uzi", "mk 12", "mk23", "mk46", "mk48",
    "model l", "mosin-nagant", "mp-443", "mp-446", "mp-448", "mp40", "mp5", "mp7", "mt-9", "mz75",
    "negev", "ns2000", "ntw-20", "nyto black", "nyto mercurows", "nyto nimogen", "nyto polaroid",
    "ots-12", "ots-14", "ots-39", "ots-44", "p08", "p22", "p226", "p30", "p38", "p7", "p90", "p99", "pa-15", "pk", "pkp",
    "pp-19", "pp-19-01", "pp-2000", "pp-90", "ppk", "pps-41", "ppsh-41", "psg-1", "psm", "ptrd", "px4 storm", "python", "pzb39",
    "qjy-88", "r5", "r93", "rfb", "ribeyrolles", "rmb-93", "ro635", "rpd", "rpk-16", "rt-20",
    "s.a.t.8", "saa", "saf", "saiga-12", "sar-21", "scw", "scarecrow", "serdyukov", "shipka", "sig-510", "sig-556", "six12",
    "skorpion", "sks", "sl8", "spas-12", "spectre-m4", "spitfire", "spp-1", "spr a3g", "springfield", "sr-3mp", "srs", "ssg 69",
    "st ar-15", "stechkin", "sten mkii", "steyr scout", "stg44", "suomi", "super sass", "super-shorty",
    "sv-98", "svd", "svt-38", "t-5000", "t-cms", "t65", "t77", "t91", "tabuk", "tac-50", "tar-21", "tec-9",
    "thompson", "thunder", "tmp", "tokarev", "type 56-1", "type 56r", "type 59", "type 62", "type 63", "type 64",
    "type 79", "type 80", "type 81", "type 88", "type 95", "type 92", "type 97", "type 97 shotgun", "type 100",
    "ukm-2000", "ump40", "ump45", "ump9", "usas-12", "usp compact", "vector", "vm59",
    "wa2000", "webley", "welrod mkii", "wz.29", "x95", "xm3", "xm8", "z-62", "zas m21", "zas m76", "zb-26"
]

const giChars = [
    "amber", "barbara", "beidou", "cloud retainer", "collei",
    "diona", "eula", "fischl", "ganyu", "hu tao", "iansan", "jean",
    "kamisato ayaka", "katheryne", "kazari", "keqing", "kitsune saiguu", "klee",
    "la signora", "lisa", "lumine", "lynette", "madame ping", "mikoshi chiyo", "mona",
    "ningguang", "noelle", "paimon", "qiqi", "raiden shogun", "rosaria", "sasayuri", "sayu", "shenhe", "sucrose",
    "tubby", "vennessa", "xiangling", "xinyan", "yoimiya", "yanfei", "yaoyao", "yunjin"
]
//kujou_sara and sangonomiya_kokomi do not have "gi" in parentheses

const pkmnChars = [
    "anzu", "ariana", "atena", "ayumi", "bea", "caitlin", "cattleya", "cynthia",
    "elaine", "erika", "gloria", "haruka", "hilda", "jessie",
    "kanna", "karen", "karin", "kasumi", "katorea", "kotone", "kris",
    "lorelei", "lyra", "may", "mei", "melony", "mizuki", "musashi", "natsume",
    "olivia", "rurina", "saitou", "selene", "serena", "shirona", "touko"
]
    
module.exports = {
	name: 'booru',
	aliases: ['aporta','busca','busqueda','colabora','comparte','postea','sacate uno','skt1'],
	description: 'Gregorio busca imágenes en distintas boorus por tí',
	args: true,
	usage: 'tags',
	execute(message, args) {
        if (disableCommand == true) {
            return message.reply("comando deshabilitado");
        };
        if ((args[0] === 'ayuda')||(args[0] === 'help')||(args[0] === 'info')) {
			return message.reply({ embeds: [helpEmbed] });
		};
		let member = message.author
        var lastFind = db.get('booruLastfind');
        var cdBooru = db.add(`booru_cd.${member.id}.rolls`, 0);
        var wishlist = db.get(`wishlists.${member.id}`);
        var isWished = false
        if ((typeof args[0]==='undefined')&&(wishlist!== null)&&(typeof wishlist!=='undefined')) {
            console.log("Comprobando wishlist...");
            if (wishlist.length > 0) {
                wishlist = wishlist.join();
                wishlist = wishlist.split(',');
                let random = Math.floor(Math.random() * 21);
                console.log(`Random: ${random}\nWishlist contiene ${wishlist.length} personajes.`);
                if (random >= wishlist.length) {
                    console.log("El dado dice que será una búsqueda aleatoria.");
                    args[0] = '-rating:safe';
                } else {
                    console.log("El dado dice que estás de suerte.");
                    args[0] = wishlist[random];
                    isWished = true;
                }
            }
        };
        const date = new Date(); // for reference, PST is UTC-8
        let day = date.getDay();
        const dayHours = date.getHours();
        var hours = "";
        var minutes = "";

        var cnOptions = {
            currentDate: date,
            tz: 'America/Santiago'
        };
        const cronExpression = '0 0 */2 * * *';
        
        try {
        const interval = parser.parseExpression(cronExpression, cnOptions);
        const dateDiff = interval.next(); // Date:  01:00:00 GMT+0200
        difference = ddMinutes(dateDiff, date);
        hours = `${Math.floor(difference/60)}h `;
        minutes = `${difference%60}`;
        if (hours === '0h ') {
            console.log("Menos de una hora restante");
            hours = ""
        }
        } catch (err) {
        console.log('Error: '+err.message);
        }

        function ddMinutes(dateDiff, date) {
        var difference =(dateDiff.getTime() - date.getTime()) / 1000;
        difference /= 60;
        return Math.abs(Math.round(difference));
        }

        let retries = 0
        let nameIsflipped = false
		let random = Math.floor(Math.random() * 2);
        var url = "";
        var fileSize = '';
        let posts = [""]
        var boorus = [
            "konachan.com",
            "yande.re",
            "gelbooru",   //API changes, must be tested.
            "danbooru"
        ];
        
        let poison = [
            "rating:explicit",
            "ass",
            "breasts",
            "bikini",
            "cameltoe",
            "rating:q",
            "nipples",
            "panties",
            "uncensored"
        ];
        let randomPo = Math.floor(Math.random() * (poison.length - 1) + 1);

        let imgofDay = [
            "ass",//cow_print, monster_girl, lolita_fashion
            "breasts",//maid
            "bikini",//heterocromiércoles, wedding_dress, nurse
            "nipples",//thong thursday, japanese_clothes
            "pussy",//animal_ears, thong
            "sex",//demon_girl, succubus, horns
            "panties"//nun,petite
        ];
        
        let randomTopic = Math.floor(Math.random() * (imgofDay.length - 1) + 1);
        
        if ((typeof args[0] !== 'undefined')) {
            if ((args[0].toLowerCase().startsWith('sopp'))||(args[0].toLowerCase().includes('sopmod'))||(args[0].length > 32)) {
                return message.channel.send('meh');
            } else {
                tagsFix(args[0]);    
                var gisOptions = {
                    searchTerm: `${args[0]} hentai`,
                    queryStringAddition: '&tbs=isz:l',  // Large images only
                    filterOutDomains: [
                        'blogspot.com',
                        'external-preview.redd.it',
                        'hentai-img.com',
                        'hentaifox.com',
                        'preview.redd.it',
                        'sh-cdn.com',
                        'thatpervert.com',
                        'wixmp.com'
                    ]
                };
            };
        } else {
            if (random === 0) {
                args[0] = '-rating:safe';
                //args[0] = imgofDay[Number(randomTopic)];
            } else {
                args[0] = '-rating:safe';
            };
        };
        
        console.log(db.get(`booru_cd.${member.id}.rolls`));
        try {
            console.log(`Memory: ${lastFind.length}`);
        } catch {
            console.log(`Memory: 0`);
        };
        
		if ((message.channel.nsfw === false)&&(message.channel.id != 438754239494357004)) {
			return message.channel.send('en <#441386860300730378> si');
        } else {
            if (db.get(`booru_cd.${member.id}.rolls`) < 3) {
                shuffle(boorus);
                boorus.push("paheal");  // Add rule34 at the end of the array
                startBooru();
            } else {
                difference = hours+minutes;
                message.channel.send(`**${message.author.username}**, la ruleta está limitada a 3 usos cada 2 horas (la hora punta). **${difference}** min restante(s).`);
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
            if (args[0].toLowerCase().startsWith('m4 sop')) return message.channel.send('no');
            if (args[0].toLowerCase().startsWith('sopmod')) return args[0] = `warframe`;
		    if (args[0].toLowerCase().startsWith('w (a')) return message.channel.send('chancho qlo ojala te salga un tumor');

            var oneRegex = / poto+| culo+| ass+| raja+| posaderas+/gi ;
            var oneMatch = args.some(e => oneRegex.test(e));
            var twoRegex = / corpse+| decapitated+| gore+| guro+| sopmod+| s0pm0d+| soppu+/gi ; //shows something else
            var twoMatch = args.some(e => twoRegex.test(e));
            var trdRegex = / leche+| lechesita+| lechita+| milk+/gi ;
            var trdMatch = args.some(e => trdRegex.test(e));
            var fthRegex = / meao+| pichi+| pichí+/gi ;
            var fthMatch = args.some(e => fthRegex.test(e));
            var fftRegex = / zorra pelua+| zorra peluda+/gi;
            var fftMatch = args.some(e => fftRegex.test(e));
            var sixRegex = / 💤+| 🛌+| 😴+| 😪+/gi;           //cannot parse at the moment
            var sixMatch = args.some(e => sixRegex.test(e));
            if (oneMatch === true) {
                poison.push('ass');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ poto+| culo+| ass+| raja+| posaderas+/gi, '');
                // Para remover las palabras pero conservar el resto
            } else if (twoMatch === true) {
                //randomPo = 10;
                args[0] = `warframe`;
            } else if (trdMatch === true) {
                poison.push('lactation');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ leche+| milk+| lechita+/gi, '');
            } else if (fthMatch === true) {
                poison.push('urine');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ meao+| pichi+| pichí+/gi, '');
            } else if (fftMatch === true) {
                poison.push('pubic_hair');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ zorra pelua+| zorra peluda+/gi, '');
            } else if (sixMatch === true) {
                poison.push('sleeping');
                randomPo = poison.length-1;
                args[0] = args[0].toLowerCase().replace(/ 💤+| 🛌+| 😴+| 😪+/gi, '');
            }

            if ((args[0].toLowerCase() === 'cabras chicas')||(args[0].toLowerCase() === 'cp')||(args[0].toLowerCase() === 'cunny')||(args[0].toLowerCase() === 'cute and funny')) {
                args[0] = `loli`
            } else if (args[0].toLowerCase() === 'akane inuwaka') {
                args[0] = `inuwaka_akane`
            } else if (args[0].toLowerCase() === 'anie del lol') {
                args[0] = `annie_(league_of_legends)`
            } else if (args[0].toLowerCase() === 'annie of the stars') {
                args[0] = `annie_(skullgirls)`
            } else if (args[0].toLowerCase() === 'beni-enma') {
                args[0] = `benienma_(fate)`
            } else if (args[0].toLowerCase() === 'calico m950a') {
                args[0] = `m950a_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'cum eater') {
                args[0] = `open_mouth`;
                poison.push('cum');
                randomPo = poison.length-1;
            } else if (args[0].toLowerCase() === 'danmachi') {
                args[0] = `dungeon_ni_deai_wo_motomeru_no_wa_machigatteiru_darou_ka`
            } else if ((args[0].toLowerCase() === 'dnf')||(args[0].toLowerCase() === 'dnf duel')) {
                args[0] = `dungeon_and_fighter`
            } else if (args[0].toLowerCase() === 'fubuki') {
                args[0] = `fubuki_(one-punch_man)`
            } else if (args[0].toLowerCase() === 'ganyu leche') {
                args[0] = `ganyu_(genshin_impact)`;
                poison.push('lactation');
                randomPo = poison.length-1;
            } else if ((args[0].toLowerCase() === 'javier perez')||(args[0].toLowerCase() === 'javier penes')) {
                args[0] = `jujutsu_kaisen`
            } else if (args[0].toLowerCase() === 'mash') {
                args[0] = `mash_kyrielight`
            } else if (args[0].toLowerCase() === 'matoi ryuko') {
                args[0] = `matoi_ryuuko`
            } else if (args[0].toLowerCase() === 'mercurows') {
                args[0] = `nyto_mercurows_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'misty') {
                args[0] = `kasumi_(pokemon)`
            } else if (args[0].toLowerCase() === 'mommy milkers') {
                args[0] = `huge_breasts`
            } else if (args[0].toLowerCase() === 'nessa') {
                args[0] = `rurina_(pokemon)`
            } else if (args[0].toLowerCase() === 'nimogen') {
                args[0] = `nyto_nimogen_(girls_frontline)`
            } else if ((args[0].toLowerCase() === 'niña_moco')||(args[0].toLowerCase() === 'niñas_moco')) {
                args[0] = `slime_girl`
            } else if (args[0].toLowerCase().startsWith('zelda')) {
                args[0] = args[0].toLowerCase().replace(/zelda+/gi, 'princess_zelda');
            } else if (args[0].toLowerCase() === 'nyto') {
                if (random === 0) {
                    args[0] = `nyto_black_(girls_frontline)`
                } else {
                    args[0] = `nyto_polarday_(girls_frontline)`
                }
            } else if (args[0].toLowerCase() === 'pendejas rubias') {
                if (random === 0) {
                    args[0] = `loli`
                } else {
                    args[0] = `small_breasts`
                };
                poison.push('blonde_hair');
                randomPo = poison.length-1;
            } else if (args[0].toLowerCase() === 'porno') {
                args[0] = `porno_(dohna_dohna)`
            } else if (args[0].toLowerCase() === 'qwq') {
                args[0] = `;_;`
            } else if (args[0].toLowerCase() === 'rin tohsaka') {
                args[0] = `toosaka_rin`
            } else if (args[0].toLowerCase() === 'sabrina') {
                args[0] = `natsume_(pokemon)`
            } else if (args[0].toLowerCase() === 'satanichia') {
                args[0] = `satanichia_kurumizawa_mcdowell`
            } else if (args[0].toLowerCase() === 'super shorty') {
                args[0] = `super_shorty_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'tummy') {
                args[0] = `navel`
            } else if (args[0].toLowerCase() === 'welrod mk2') {
                args[0] = `welrod_mkii_(girls_frontline)`
            } else if (args[0].toLowerCase() === 'whitney') {
                args[0] = `akane_(pokemon)`
            } else if (args[0].toLowerCase() === 'yun jin') {
                args[0] = `yunjin_(genshin_impact)`;
            } else if (args[0].toLowerCase().startsWith('zelda')) {
                args[0] = args[0].toLowerCase().replace(/zelda+/gi, 'princess_zelda');
            } else if (args[0].toLowerCase().startsWith('sexo')) {
                args[0] = ``;
                poison.push('sex');
                randomPo = poison.length-1;
            } else if (alChars.indexOf(args[0].toLowerCase()) > -1) {   //FILTER
                args[0] = `${args[0]}_(azur_lane)`
            } else if (fateapoChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(fate/apocrypha)`
            } else if (fateChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(fate)`
            } else if (fateexChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(fate/extra)`
            } else if (fategoChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(fate/grand_order)`
            } else if (gbfChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(granblue_fantasy)`
            } else if (giChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(genshin_impact)`
            } else if (gflChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(girls_frontline)`
            } else if (pkmnChars.indexOf(args[0].toLowerCase()) > -1) {
                args[0] = `${args[0]}_(pokemon)`
            };
            args[0] = args[0].toLowerCase().replace(/100%+/gi, '100_percent');
            args[0] = args[0].toLowerCase().replace(/\(ak\)+/gi, '(arknights)');
            args[0] = args[0].toLowerCase().replace(/\(al\)+/gi, '(azur_lane)');
            args[0] = args[0].toLowerCase().replace(/\(ba\)+/gi, '(blue_archive)');
            args[0] = args[0].toLowerCase().replace(/\(fex\)+|\(f\/ex\)+/gi, '(fate/extra)');
            args[0] = args[0].toLowerCase().replace(/\(fgo\)+/gi, '(fate/grand_order)');
            args[0] = args[0].toLowerCase().replace(/\(gbf\)+/gi, '(granblue_fantasy)');
            args[0] = args[0].toLowerCase().replace(/\(gfl\)+/gi, '(girls_frontline)');
            args[0] = args[0].toLowerCase().replace(/\(gi\)+/gi, '(genshin_impact)');
            args[0] = args[0].toLowerCase().replace(/\(hi\)+/gi, '(honkai_impact)');
            args[0] = args[0].toLowerCase().replace(/\(kc\)+/gi, '(kancolle)');//(kantai_collection)
            args[0] = args[0].toLowerCase().replace(/\(opm\)+/gi, '(one-punch_man)');
            args[0] = args[0].toLowerCase().replace(/\(uni\)+|\(unib\)+|\(unist\)+|\(uniclr\)+/gi, '(under_night_in-birth)');
            args[0] = args[0].toLowerCase().replace(/\(dohna\)+|\(dd\)+/gi, '(dohna_dohna)');
            console.log(`Buscando ${args[0]}...`);
            return args[0];//.trim()?
        };

		async function startBooru () {
            try {
                db.delete(`booru.textCount`);
            } catch(err) {
                console.log("chucha:"+err+"\nError al borrar base de datos en booru.js");
            };
            if ((boorus.length > 0)&&(retries < 5)) {
                try {
                    if (disableTyping == false) {
                        message.channel.sendTyping();
                    }
                    console.log(`Boorus restantes: `+boorus);
                    await searchBoorus();
                } catch(err) {
                    retries = retries+1;
                    startBooru();
                    console.log("chucha:"+err+"\nReintentando...");
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
                db.subtract(`booru_cd.${member.id}.rolls`, 1);
                message.reply(`no encontre niuna wea con *${args[0]}* 🙁`);
                return console.log("chucha: No encontré nada.");
            };
        };

		async function searchBoorus () {
            // Picks a random tag
            const channel = message.client.channels.cache.get('438754239494357004');
            
            if ((typeof args[0] !== 'undefined')) {
                // Pone underscores donde en el comando pusieron espacios.
                imgofDay[Number(day)-1] = args[0].toLowerCase().replace(/[ ]/gi, '_');
                var tags = [imgofDay[Number(day)-1],poison[Number(randomPo)]];
            } else {
                var tags = [poison[Number(randomPo)]];
            };

            if ((retries > 0)||(poison.length < 9)) {    // If not a forced tag
                shuffle(poison);
            };
            
            //Specific searches that prevents adding tags.
            if ((args[0].startsWith('curss'))||(args[0].startsWith('slime_girl'))) {
                tags[1] = "-rating:safe";
            }
            //TODO: Change specific tags from yande.re such as seifuku for school_uniform, or megane for glasses, nopan for no_panties.
            if ((boorus[0] === "danbooru")||(retries > 4)) {
                //SERIES
                args[0] = args[0].toLowerCase().replace(/\(fate\/grand_order+/gi, '(fate');
                args[0] = args[0].toLowerCase().replace(/\(fate\/extra+/gi, '(fate');
                args[0] = args[0].toLowerCase().replace(/girls_frontline+/gi, `girls'_frontline`);
                args[0] = args[0].toLowerCase().replace(/high_school_dxd+/gi, `highschool_dxd`);
                //TAGS
                args[0] = args[0].toLowerCase().replace(/megane+/gi, 'glasses');
                args[0] = args[0].toLowerCase().replace(/nopan+/gi, 'no_panties');
                args[0] = args[0].toLowerCase().replace(/seifuku+/gi, 'school_uniform');
                //Removes topic if it's danbooru because they limit their tag search, also remove if does not find anything after 4 retries.
                tags.splice(1,1);
            } else if (boorus[0] === "gelbooru") {
                args[0] = args[0].toLowerCase().replace(/nopan+/gi, 'no_panties');
                args[0] = args[0].toLowerCase().replace(/pantsu+/gi, 'panties');
                //tags.push('-bara');
                imgofDay[Number(day)-1] = args[0].toLowerCase().replace(/highschool_dxd+/gi, `high_school_dxd`);
            } else if (boorus[0] === "konachan.com") {
                if (args[0].startsWith('slime_girl')) {
                    var booruRemoved = boorus.shift();
                }
            } else if (boorus[0] === "yande.re") {
                if (args[0].startsWith('slime_girl')) {
                    var booruRemoved = boorus.shift();
                }
                //TAGS
                args[0] = args[0].toLowerCase().replace(/glasses+/gi, 'megane');
                args[0] = args[0].toLowerCase().replace(/no_panties+/gi, 'nopan');
                args[0] = args[0].toLowerCase().replace(/panties+/gi, 'pantsu');
                args[0] = args[0].toLowerCase().replace(/school_uniform+/gi, 'seifuku');
            }
            console.log(tags);
            
            console.log(`Se buscó el tag ${imgofDay[Number(day)-1]} y ${poison[Number(1)]} en ${boorus[Number(0)]}, para representar el día ${day}. Se supone que son las ${dayHours} hrs.`);
            
            // Check if the character exists
            var posts = await Booru.search(`${boorus[Number(0)]}`, imgofDay[Number(day)-1], { limit: 1, random: true })
            
            if (lastFind == null) {
                lastFind = ["empty"];
            };
            
            if ((typeof posts[0] === 'undefined')||(lastFind.indexOf(md5(posts[0].fileUrl)) > -1)) {
                if (typeof posts[0] === 'undefined') {
                    console.log(`No encontré nada en ${boorus[Number(0)]}: Reintentando (${retries})...`);
                } else {
                    console.log(`Imagen repetida en ${boorus[Number(0)]}: Reintentando (${retries})...`);
                };
                if (nameIsflipped === true || !(args[0].includes("_"))) {
                    var booruRemoved = boorus.shift();  // Removes the first booru if the name was already flipped
                };
                await flipName(args[0]);                // Flip the name
                retries = retries+1;
                startBooru();                           // Searches again
            } else {
                if (boorus[0] === "paheal") {
                    if (isWished) {
                        try {
                            message.react('🌟');
                        } catch (err) {
                            console.log(`No puedo reaccionar: ${err}`);
                        };
                    };
                    console.log("Regla 34 es.");
                    try {
                    message.channel.send({files: [posts[0].fileUrl]});
                    db.add(`booru_cd.${member.id}.rolls`, 1);
                    } catch(err) {
                        message.channel.send(posts[0].fileUrl);
                        console.log("Chucha, pesa mucho :(");
                    } finally {
                        return esperarRespuesta();
                    }
                } else {
                    let posts = await Booru.search(`${boorus[Number(0)]}`, tags, { limit: 1, random: true });
                    console.log(`Encontré esto: ${posts[0].fileUrl}\nRating: ${posts[0].rating}`);

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
                            if ((boorus[0] === "danbooru")&&((posts[0].rating === 's')||(retries < 4))) {
                                console.log("Meh, busco otra");
                                var booruRemoved = boorus.shift();  // Removes the first booru
                                // Retry without adding to the "retries" counter
                                startBooru(); // Searches again
                            } else {
                                console.log("Esta está buena, la envío altiro.");
                            /*    if (isWished) {
                                    try {
                                        message.react('🌟');
                                    } catch (err) {
                                        console.log(`No puedo reaccionar: ${err}`);
                                    };
                                };*/
                                url = posts[0].fileUrl;
                                if (typeof lastFind !== 'undefined') {
                                    if (lastFind.length > 200) {
                                        db.delete('booruLastfind');
                                        console.log('Se ha reiniciado la lista de imagenes.');
                                    };
                                };
                                db.push('booruLastfind', md5(posts[0].fileUrl));
                                //const msg = message.channel.send({files: [posts[0].fileUrl]})
                                //const msg = message.reply(posts[0].fileUrl)
                                postEmbed(boorus, posts)
                                .then(() => db.add(`booru_cd.${member.id}.rolls`, 1))
                                .catch(() => imgReduce(posts, url));
                                return esperarRespuesta(message);
                            };
                        }
                        catch(err) {
                            console.log(`No... ${err}\nIntentaré convertir el archivo a jpg.`);
                            imgReduce(posts[0]);
                        }
                    }
                }
            };
        };

        function gisResults(error, results) {
            let random = Math.floor(Math.random() * Number(23-retries));
            if (error) {
                console.log(error);
            } else {
                console.log(JSON.stringify(results, null, '  '));
                if (typeof results[Number(random)] === undefined) {
                    retries = retries+1;
                    if (retries < 8) {
                        gisResults();
                    } else {
                        console.log("Me rindo, no encuentro nada.");
                        //db.subtract(`booru_cd.${member.id}.rolls`, 1);
                        return message.reply(`no encontre niuna wea 🙁`);
                    }
                } else {
                    try {
                        db.push('booruLastfind', md5(results[Number(random)].url));
                        console.log(`Enviando:\n${results[Number(random)].url}`);
                        message.channel.send({files: [results[Number(random)].url]});
                        db.add(`booru_cd.${member.id}.rolls`, 1);
                    } catch {
                        console.log("No puedo enviar el resultado de Google.");
                        retries = retries+1;
                        startBooru();
                    }
                };
            }
        };
        
        // Si es que excede el límite de subida de discord (8Mb)
		async function imgReduce () {
            console.log("Intentando reducir tamaño de archivo.");
			const imageResponse = await axios({url: url, responseType: 'arraybuffer'});
			theImage = Buffer.from(imageResponse.data, 'binary');
            await sharp(theImage)
            .jpeg({ mozjpeg: true })    // Reduces output JPEG file size (slower)
            .toBuffer()
            .then(function(outputBuffer) {
                console.log(`Reduciendo tamaño de archivo...`);
                return message.channel.send({ files: [outputBuffer] });
            })
            .catch(err => {
                console.error(`Bruh: `+`*${err}*`);
                try {
                    message.channel.send(posts[0].fileUrl);
                    db.add(`booru_cd.${member.id}.rolls`, 1);
                } catch {
                    console.log("Posts[0] no existe?");
                };
            })
        };

        async function postEmbed (boorus, posts) {
            console.log(`ID: ${posts[0].id}\nURL: ${posts[0].postView}\nTags: ${posts[0].tags}\nScore: ${posts[0].score}\nDate: ${posts[0].createdAt}\nBooru: ${boorus[0]}`);
            var booruTags = posts[0].tags,
            filteredTags = [//Removed: "dakimakura","undressing","x3"
                "!?","&gt;_&lt;","+_+",":/",":<",":>",":3",":c",":d",":i",":o",":p",":q",":t",";)",";<",";>",";3",";d",";o",";p",";q",">_<","@_@","^^^","^_^",
                "1boy","1girl","2boys","2girls","3:","3boys","3girls","4boys","4girls","5boys","5girls","6+boys","6+girls",
                "abdominals","abs","absurdres","adjusting_bra","adjusting_legwear","adjusting_necktie","adjusting_shorts","adjusting_shoe","adjusting_swimsuit","after_fellatio","after_vaginal","aftersex","against_table","against_wall","age_difference","ahoge","aliasing","all_fours","alternate_breast_size","alternate_costume","alternate_hair_color","amulet",
                "anal","anal_beads","anal_fingering","anal_hair","anal_object_insertion","anal_tail","angel_wings","anilingus","animal","animal_ears","animal_hands","animal_penis","ankle_boots","anthropomorphism","anus","angry","annoyed","apron","aqua_dress","aqua_bikini","aqua_eyes","aqua_hair","aqua_shirt",
                "areola","areolae","arm_garter","arm_grab","arm_guards","arm_support","armlet","armor","armpits","arms_at_sides","arms_behind_back","arms_behind_head","arms_up","artist_name","artist_request","ass","ass_focus","ass_grab","asymmetrical_bangs","asymmetrical_docking","asymmetrical_gloves","asymmetrical_wings",
                "back-print_panties","backboob","backless_outfit","bad_feet","bad_id","bad_pixiv_id","badge","bag","bald","bandage","bandaid","bandaids_on_nipples","bangs","bar_censor","bare_legs","bare_shoulders","barefoot","baseball_cap","bat","bathing","bathroom","bdsm","beach","bead_necklace","bear_panties","bed","bed_sheet","beer_can","bell","belly_chain","belt","bent_over",
                "big_hair","bike_shorts","bikini","bikini_lift","bikini_top","bird","bisexual","black_bikini","black_bow","black_bra","black_choker","black_collar","black_dress","black_eyes","black_footwear","black_gloves","black_hair","black_hairband","black_headwear","black_jacket","black_legwear","black_leotard","black_panties","black_pants","black_ribbon","black_skirt","blank_eyes","blazer","blindfold","blonde_hair","blood","bloomers","blouse",
                "blue_background","blue_bikini","blue_bow","blue_dress","blue_eyes","blue_gloves","blue_hair","blue_headwear","blue_jacket","blue_legwear","blue_nails","blue_panties","blue_shirt","blue_swimsuit","blunt_bangs","blur_censor","blurry","blurry_background","blush","blush_stickers","bodysuit","bondage","boots","border","bored","bottomless","bound","bound_arms","bow","bow_bra","bowtie",
                "bra","bra_lift","bra_pull","bra_removed","bracelet","bracer","braid","braided_ponytail","braids","breast_grab","breast_hold","breast_press","breast_squeeze","breasts","breasts_apart","breasts_outside","breath","bridal_gauntlets","brown_eyes","brown_hair","buckle","bunny_ears","bustier","butt_crack","butterfly","buttjob","buttons",
                "c:","cameltoe","camera","camisole","cape","capelet","car","carrot","cat","cat_cutout","cat_ears","cat_girl","cat_smile","cat_tail","catgirl","censored","chain","chains","chair","cherry","chestnut_mouth","chibi","child_on_child","chocolate","choker","cleavage","cleft_of_venus","clitoris",
                "cloak","closed_eyes","closed_mouth","clothed_female_nude_male","clothed_sex","clothes","clothes_grab","clothes_lift","clothes_pull","close","clothing_aside","clouds",
                "coat","collar","collarbone","collared_dress","collared_shirt","comic","commentary","commentary_request","commission","completely_nude","computer_mouse","condom","condom_belt","contemporary","copyright_name","coughing","covered_erect_nipples","covered_navel","covering",
                "cow_ears","cowboy_shot","cowgirl_position","crazy","crazy_smile","cream","crinoline","crop_top","cropped","cross","crossed_arms","crown","crying","cuffs","cum","cum_in_pussy","cum_on_body","cum_on_breasts","cum_on_fingers","cum_on_hands","cum_on_mouth","cum_on_pussy","cum_on_upper_body","cumdrip","cup","curtains",
                "d:","dark_skin","dark-skinned_female","dark-skinned_male","day","demon","demon_girl","depressed","detached_sleeves","desk","despair","digital_version","dildo","disdain","disgust","dissapointed","dog","doggystyle","doyagao","dress","dress_shirt","drolling","drunk","dutch_angle",
                "ear_biting","ear_grab","ear_pull","earrings","egyptian_clothes","ejaculation","elbow_gloves","embarassed","empty_eyes","english_commentary","envy","erect_nipples","erection","evil","evil_smile","expressionless","eyebrows_visible_through_hair","eyelashes","eyepatch","eyes_closed",
                "facepalm","facial","facial_mark","fang","fangs","fat","feather_hair_ornament","feet","fellatio","female_focus","female_pubic_hair","ferret_ears","fingering","fingerless_gloves","fingernails","fingersmile","fingers_to_cheeks","fire","flame","floating_hair","floor","flower","flowers","flustered",
                "food","foot_tease","fox_ears","foxgirl","frilled_skirt","frilled_sleeves","frills","frogtie","fruit","frustrated","from_above","from_behind","from_below","full-package_futanari","furrowed_brow","futanari",
                "g-string","gag","garter","garter_belt","girl_on_top","glasses","glitch","glitch_censor","gloom_(expression)","gloves","gluteal_fold","goggles","gothic","gradient","gradient_background","grass","gray_hair","green_dress","green_eyes","green_hair","grey_background","grey_dress","grey_eyes","grey_hair","grin","groin","groping","group","gun","gym_uniform",
                "hair_between_eyes","hair_bow","hair_ornament","hair_over_one_eye","hair_ribbon","hair_through_headwear","hair_tubes","hairband","hairclip","hand_on_another&#039;s_leg","handjob","hands_on_ground","happy","hat","headband","headphones","heart","heavy_breathing","heels","hetero",
                "high_heels","high_ponytail","highlights","highres","hip_focus","holding","hood","hoop_earrings","horns","horrified","horse_ears","hug","huge_ass","huge_breasts",
                "in_heat","indoors","interlocked_fingers",
                "jacket","japanese_clothes","jewelry","jpeg_artifacts",
                "kiss","kneehighs","kneeling","knotted_penis",
                "lactation","large_breasts","lavender_eyes","lavender_hair","leaning_back","leaning_forward","legs","legs_apart","leotard","lifted_by_self","light_brown_hair","lingerie","logo","loli","lolita_hairband","lonely","long_hair","long_sleeves","looking_at_viewer","looking_away","looking_back","looking_down","lying",
                "maid","makeup","male","mask","male_masturbation","mask_on_head","medium_breasts","megane","mole","mole_on_breast","mole_under_eye","monochrome","mosaic_censoring","mouth_hold","multicolored_hair","multiple_boys","multiple_girls","muscular","muscular_female",
                "navel","naked","neck_bell","necklace","nekomimi","nervous","nipples","no_bra","no_panties","nopan","nude",
                "o_o","o3o","obi","on_back","one_eye_closed","one_knee","open_mouth","open_shirt",
                "paizuri","panties","pants","pants_pull","pantsu","panty_pull","pantyhose","penis","penis_grab","phone","pink_bikini","pink_dress","pink_eyes","pink_hair","pink_shirt","pointed_ears","pointy_ears","ponytail","pout","pov_hands","precum","purple_dress","purple_eyes","purple_hair","purple_panties","pussy","pussy_juice",
                "quaver",
                "rabbit_ears","raccoon_ears","rape","rain","rainbow_hair","raw_scan","red_bikini","red_dress","red_eyes","red_hair","remote_control_vibrator","ribbon","ribbons","ribs",
                "sagging_testicles","scan","see_through","seifuku","selfie","sex","sex_from_behind","sex_toy","school_uniform","shiny","shiny_skin","shirt","shirt_lift","shoes","short_hair","shorts","side_bun","side_ponytail","sideboob","sidelocks","signed","silver_hair","simple_background","sitting",
                "skintight","skirt","skirt_lift","sky","sleeping","small_breasts","smartphone","smelling_feet","smile","solo","solo_focus","speed_lines","spread_legs","spread_pussy","stockings","striped_panties","sweat","sweatdrop","sweater","swimsuit","swimsuit_pull","swimsuit_under_clothes","swimsuits",
                "tagme","tail","tan_lines","tears","tentacles","thigh_gap","thighhighs","thighs","thong","thong_bikini","thong_leotard","tongue","tongue_out","topless","torn_bodysuit","torn_clothes","torn_dress","torn_panties","torn_pants","torn_shirt","torn_swimsuit","translated","trembling","triangle_mouth","twintails","twitter_username","two-tone_hair",
                "uncensored","underboob","underwear","undressing","untied_bikini","upper_body","upset","used_condom","uwu",
                "vaginal","very_long_hair","very_short_hair","vibrator",
                "water","watermark","wavy_mouth","weapon","wet","wet_clothes","wet_hair","wet_shirt","wet_shorts","white_background","white_bikini","white_dress","white_gloves","white_hair","white_legwear","white_shirt","wide_sleeves","window","wings","wink","wolf_ears","wolf_tail","wristwear",
                "xd",
                "yellow_dress","yellow_eyes",
                "zettai_ryouiki","zoom_layer"
            ],
            res = booruTags.filter(item => !filteredTags.includes(item));
            res = res.slice(0,4).map(chars => capitalize(chars));
            
            if (res.indexOf("Animated") > -1) {
                if (isWished) {
                    try {
                        message.react('🌟');
                    } catch (err) {
                        console.log(`No puedo reaccionar: ${err}`);
                    };
                }
                return message.reply(posts[0].fileUrl);
            };

            if (posts[0].rating === 'e') {
                booruEmbed.setColor('#670D08');
            } else if (posts[0].rating === 'q') {
                booruEmbed.setColor('#FF9C2C');
            } else if (posts[0].rating === 's') {
                booruEmbed.setColor('#14C234');
            } else {
                booruEmbed.setColor('#34D3EB');
            };
            booruEmbed.setImage(posts[0].fileUrl)
            .setTitle(posts[0].id)
            .setURL(posts[0].postView)
            //.setAuthor(posts[0].tags.slice(0,1).join())
            .setDescription(res.join('\n')+`\n**${posts[0].score}**<:KakeraR:877979665132818463>`)
            .setTimestamp(posts[0].createdAt)
            .setFooter(boorus[0]);

            try {
                if (isWished === true) {
                    return message.channel.send({ content: `Deseado por <@${message.author.id}>`, embeds: [booruEmbed] });
                } else {
                    return message.channel.send({ embeds: [booruEmbed] });
                }
            } catch(err) {
                console.log("Error al enviar embed: "+err);
                return message.reply("estoy hecho mierda weon 😔");
            }
        }

        function capitalize(msg) {//&#039;
            msg = msg.replace(/&#039;+/gi, `'`);
            var separateWord = msg.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().split('_');
            for (var i = 0; i < separateWord.length; i++) {
                if ((separateWord[i].charAt(0) === '(')&&(separateWord[i].length > 2)) {
                    if ((separateWord[i].charAt(2)===')')||(separateWord[i].charAt(3)===')')||(separateWord[i].charAt(4)===')')||((!separateWord[i].charAt(2)==='A')&&(!separateWord[i].charAt(4)==='E')&&(separateWord[i].charAt(5)===')'))) {
                        separateWord[i] = separateWord[i].toUpperCase();//caps whole word inside parentheses
                    } else {
                        separateWord[i] = '(' + separateWord[i].charAt(1).toUpperCase() +
                        separateWord[i].substring(2);//caps first char of something in parentheses
                    }
                } else if (!Number.isNaN(parseInt(separateWord[i].charAt(0)))&&(separateWord[i].length > 1)) {
                    separateWord[i] = separateWord[i].charAt(0) + separateWord[i].charAt(1).toUpperCase() +
                    separateWord[i].substring(2);
                } else {
                    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1);
                };
            }
            return separateWord.join(' ');
        }
        
		// Interacciones con reacciones.
		async function emojiMessage(message, validReactions) {
            for (const reaction of validReactions) await message.react(reaction);
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && (!user.bot)

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

    },
};
