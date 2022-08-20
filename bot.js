// Node's native file system module.
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
const { token, gregorid } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
//const Booru = require('booru');
/*const { createWorker } = require('tesseract.js');
const worker = createWorker({
	logger: m => console.log(m)
});*/
var CronJob = require('cron').CronJob;
// Quick.db is an easy-to-use database manager built with better-sqlite3.
const db = require('quick.db');
// PostgreSQL is a hard-to-use database manager.
//const dbp = require('./models/index.js');

// create a new Discord client
const bot = new Discord.Client({ 
intents: ['GUILDS','GUILD_PRESENCES','GUILD_MEMBERS','GUILD_MESSAGES','GUILD_MESSAGE_REACTIONS'] }
);
// a class that extend JS's native Map class and include more extensive functionality.
bot.commands = new Discord.Collection();
// will return an array of all the file names in that directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//const triggers = fs.readFileSync('./preguntas.txt').toString().split("\n");

const devMode = false; // >>ATTENTION<<

const wiki = require('wikijs').default;
//var parseInfo = require("infobox-parser");

const activitiesList = [
    "League of Legends",
    "League of Legends",
    "Warframe",
    "Warframe",
	"Spacewar",
	"Cube Racer",
    "OpenOSRS",
	"Old School RuneScape",
	"World of Warcraft Classic",
    "Counter-Strike: Global Offensive",
    "Counter-Strike: Kinda Offensive",
    "Tom Clancy's Rainbow Six Siege",
	"Paladins",
    "Fortnite",
	"GUILTY GEAR -STRIVE-",
    "Mortal Kombat 11",
	"DRAGON BALL FighterZ",
	"Borderlands 2",
    "Super Mario 64",
	"Where's Waldo?",
    "Blue Archive",
    "Folio Azul",
    "Girls' Frontline",
	"RAID: Shadow Legends",
	"Diablo® Immortal™",
	"Kung Fu Panda: Showdown of Legendary Legends",
	"Disc Jam",
	"Multi Theft Auto",
	"Grand Theft Auto: San Andreas",
	"Desert Bus",
	"bailar a lo GTA",
	"el 6 y el 7",
	"estar hecho mierda",
	"dar vueltas alrededor de Dust2 con PP-Bison",
    "Hentai Furry",
	"Orc Massage"
    ];
const topicList = [
    "Guilty Gear XX Λ Core Plus R",
    "GUILTY GEAR™ -STRIVE-",
	"Pro Jumper! Guilty Gear Tangent!?",
    "Killer Instinct",
    "Garou: Mark of the Wolves",
    "Garou: La Marca de los Lobos",
	"Pocket Rumble",
	"Tobal 2",
	"Dengeki Bunko: Fighting Climax IGNITION",
	"Brawlhalla",
	"Def Jam: Fight for NY",
	"Duke Nukem Forever",
	"Diablo® III",
	"BlazBlue Alternative: Dark War",
	"Boktai: The Sun is in Your Hand",
	"Commander Keen",
	"VA-11 Hall-A: Cyberpunk Bartender Action",
	"Kung Fu Panda: Showdown of Legendary Legends",
	"Disc Jam",
	"Summoners War",
	"Shrek Super Slam",
	"Shin Megami Tensei IV: Apocalypse",
    "EA SPORTS™ FIFA 21",
	"speedruns de Super Mario 64",
	"que Nagato es la Linne",
	"frame data",
	"juegos de mesa",
	"rollback netcode",
	"GGPO",
	"los juegos de pelea",
	"la paranoia y la venganza",
	"ricas recetas de cocina",
	"su nosgoth",
    "estrategias para el Mudae"
    ];
const react1List = [
	"750502194108956682",
	"749880374213083227",
	"804617300824948756"
    ];
const reactList = [
	"🔩","🍴","🥄","🙏","👌","🥛","🧻","🥃","🔩"
    ];
const ignoreList = [
	'565330655915933696',
	'164473940532527104'
	]; // banned from image reactions.
const bannedNames = [
    "m4",
	"sopmod", "sopñod",	"sipmid", "simpid",	"spmid", "sipmd", "sopm", "sópm", "s0pm0d", "søpmød", "s°pm°d",	"sºpmºd", "søpmºd", "sºpmød",
    "opmod", "ompod", "dompo", "oppo", "pmd", "soppo", "soppu",	"spand", "mdand", "spnd", "ndmd", "spmd", "smpd", "zpmd", "zmpd", "zpmód",
	"spmod", "sopmd", "sodmop", "dompos", "posmod", "sompod", "splec", "zplec", "splch", "lechemod", "pleched", "dleches", "zompod", "zopmod",
	"dompoz", "hup", "spm", "mod", "mbercita", "amber", "4mber", "amb3r", "4mb3r", "zandmod", "zandmd", "jeell", "stingray", "stngray",
	"stngry", "stingry", "shadowm", "sh4dowm", "sh4d0wm", "shadwm", "shdowm", "hadowm", "shdwm", "j1ll", "jll", "jill"
    ]; // Don't ever say them out loud.
const bannedWords = [
    "dmps", "dpms", "psmd", "opmod", "spmd", "smpd", "smdp", "sopmd", "spmod"
    ]; // Shorter version
const bannedSymbols = [
    "sᴏᴘᴍᴏᴅ", "ⓢⓞⓟⓜⓞⓓ", "🅢🅞🅟🅜🅞🅓", "⒮⒪⒫⒨⒪⒟", "s⃝o⃝p⃝m⃝o⃝d⃝", "ˢᵒᵖᵐᵒᵈ", "𝔖𝔬𝔭𝔪𝔬𝔡", "𝕾𝖔𝖕𝖒𝖔𝖉", "𝔰𝔬𝔭𝔪𝔬𝔡", "𝔖𝔒𝔓𝔐𝔒𝔇", "𝕾𝕺𝕻𝕸𝕺𝕯", "丂口尸从口刀"
    ]; // Shorter version
const responseObject = {
	"$rtu": "¡$rt no está disponible!",
	"grego?": "que wea",
	"Grego?": "Que wea",
	"gregO?": "que weA",
	"gReGo?": "qUe wEa",
	"GrEgO?": "QuE WeA",
	"greGO?": "que wEA",
	"GRego?": "QUe wea",
	"grEgo?": "quE Wea",
	"GreGo?": "Que Wea",
	"gRegO?": "qUe weA",
	"GregO?": "Que weA",
	"GREgo?": "QUE Wea",
	"GrEgo?": "QuE Wea",
	"grEgO?": "quE WeA",
	"grEGO?": "quE WEA",
	"gREGO?": "qUE WEA",
	"GREGO?": "QUE WEA"
};

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	bot.commands.set(command.name, command);
}
// when the client is ready, run this code
// this event will only trigger one time after logging in
bot.once('ready', () => {
	console.log('REDIOOOOOOOOOOS!');
	// resolve(guildID) and get gregoID
/*	bot.users.fetch(gregorid).then(myUser => {
    bot.user.setAvatar(myUser.avatarURL())})
	.then(() => console.log(myUser))
	.catch((err) => console.log(`avatarURL:`+err));*/
	// Setting the ammount of nuts.
	if (db.has('gregoBot') == 0) {
	db.set('gregoBot', { nuts: 0 });
	console.log(`Se ha creado una nueva partida.`);
	}
});
bot.on('ready', function () {
//	console.log(User); // Some user object.
	console.log(`${bot.user.tag} has logged in.`);
	var day = 0;
	var lockComment = 1;//Start locked to prevent spamming if bot restarted

	var jobFri = new CronJob(
		'34 */6 21-23 * * 5',//“At every 6th minute past every hour from 22 through 23 on Friday.”
		function() {
			let randomChance = Math.floor(Math.random()*15);
			let randomComment = Math.floor(Math.random()*8);
			if ((lockComment === 0)&&(randomChance === 2)) {
				console.log('Este mensaje aparecerá entre las 22 a 23 horas los viernes.');
				lockComment = 1
				let jobsFri = [ `entonces nadie alguna wea?`,
								`weon un viernes y no hay niun weon?`,
								`quien un jugo?`,
								`quien un lol?`,
								`quien un nosgoth?`,
								`alguien un nosgoth?`,
								`ALGUIEN UN NOSGOTH?`,
								`quien apaña un nosgoth?`];
				day = 5;
				bot.channels.cache.get('438741858018000897').send(`${jobsFri[Number(randomComment)]}`);// Sends a message to #principal
			/*	try {
					imgoftheDay();
				} catch (error) {
					console.error("timerCronjob:"+error);
				};*/
			}
		},
		null,
		true,
		'America/Santiago'
	);
	
	var jobRestore = new CronJob(
		'0 0 0,21 * * 4,5',//“At minute 0 past hour 0 and 21 on Thursday and Friday.”
		function() {
			lockComment = 0;
		},
		null,
		true,
		'America/Santiago'
	);

	var resetCd = new CronJob(
		'0 0 */2 * * *',//“Every 2 hours.”
		function() {
			db.delete(`booru_cd`);
			console.log('Se ha reiniciado el cooldown.');
		},
		null,
		true,
		'America/Santiago'
	);

	var avtNormal1 = new CronJob(
		'0 0 0 1,2,7 0-5 *',//“At 00:00 on day 1, 2, and 7 in every month from January through June.”
		function() {
			client.user.setAvatar('./memes/avatars/nachogbr.jpg')
			.then(user => console.log(`Cambio de avatar.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtLaborday = new CronJob(
		'9 0 0 1 4 *',//“At 00:00:09 on May 1st.”
		function() {
			client.user.setAvatar('./memes/avatars/laborday.png')
			.then(user => console.log(`Cambio de avatar, Trabajador.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtKrausar = new CronJob(
		'0 0 0 6 5 *',//“At 00:00 on June 6th.”
		function() {
			client.user.setAvatar('./memes/avatars/aprilfools.png')
			.then(user => console.log(`Cambio de avatar, Krausar.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtNormal2 = new CronJob(
		'0 0 0 1 5-11 *',//“At 00:00 on day-of-month 1 from July through December.”
		function() {
			client.user.setAvatar('./memes/avatars/nachogck.png')
			.then(user => console.log(`Cambio de avatar.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtXmas = new CronJob(
		'0 0 0 24 11 *',//“At 00:00 on December 24th.”
		function() {
			client.user.setAvatar('./memes/avatars/nachogpd.png')
			.then(user => console.log(`Cambio de avatar, Felices fiestas.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);

	setInterval(() => {
		const topic = Math.floor(Math.random() * (topicList.length - 1) + 1);
		bot.channels.cache.get('438741858018000897').setTopic(`Aquí se habla de ${topicList[topic]}.`)
		console.log(`El principal ahora se habla de "${topicList[topic]}".`);
    }, 48960000); // Runs this every 6.8 hours.
	setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
        bot.user.setActivity(activitiesList[index], { type: 'PLAYING' }); // sets bot's activities to one of the phrases in the arraylist.
		console.log(`Ahora jugando a ${activitiesList[index]}`);
    }, 420000); // Runs this every 420 seconds.
});
bot.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;
	//console.log(interaction.commandName);
	if (interaction.customId === 'dustloop') {
		var results = ''
		var wikiApi = 'http://www.dustloop.com/wiki/api.php'
		let search = interaction.values;
		fetchPage(search, results)
		.then(console.log(results))
		.catch(err => {
			console.error(err);
		});
		async function fetchPage(msg, results) {
			msg = msg.toString();
            results = wiki({
                apiUrl: wikiApi,
                origin: null
            }).page(msg).then(console.log)
            return results;
        }
		try {
			const infoEmbed = new Discord.MessageEmbed()
			.setAuthor({name:'Tech Finder',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
			.setColor('#E85A5A')
			.setTitle(interaction.label)
			.setURL(results.fullurl)
			.setDescription('overview')
			.setFooter({text:'dustloop o mizuumi idk'});
			await interaction.update({ embeds: [infoEmbed], components: [] });
		} catch(err) {
			console.log(`Error en interacción de Dustloop: `+err);
		}
	/*	let message = interaction.message
		bot.commands.get('dustloop').execute(message, interaction.values);*/
	}
});
//	async member*
bot.on('guildMemberAdd', member => {
	let channel = member.guild.channels.cache.find(ch => ch.name === 'principal');
	if (!channel) return;
    // Assuming we mention someone in the message, this will return the user.
    if (gregorid) {
      // Now we get the member from the user
      let member = message.guild.members.resolve(gregorid);
      // If the member is in the guild
      if (member) {
        member
          .kick('Gregobot ha tomado acción.')
          .then(() => {
            console.log(`Successfully kicked ${user.tag}`);
		})
          .catch(err => {
            // An error happened either due to missing permissions or role hierarchy
            console.log('I was unable to kick the member!');
            // Log the error
            console.error(err);
		});
      } else {
        // The mentioned user isn't in this guild
        console.log("That user isn't in this guild!");
      }
      // Otherwise, if no user was mentioned
    } else {
      console.log("You didn't mention the user to kick!");
    }
    member.guild.channels.get('438741858018000897').send("que chucha..."); 
// If user joins, get #Principal and send a message.
});
bot.on('guildMemberUpdate', function(oldMember, newMember){
	if (oldMember.nickname === newMember.nickname) return;
	console.log(`Nickname antes: ${oldMember.nickname}`);
	console.log(`Nickname ahora: ${newMember.nickname}`);
	if (oldMember.id == '565330655915933696') {
		console.log('Usuario coincide.');
		//	Removes characters outside of A-z and À-ú.
		var cleanMember = newMember.nickname.toLowerCase().replace(/[^A-zÀ-ú\s]/gi, '')
		if (typeof cleanMember === "function") {
		//	Looks for repeated characters.
			var checkMember = cleanMember.replace(/[^\w\s]|(.)\1/gi, '');
		};
		//	Wait 250ms and then check if includes a bad word.
		setTimeout(function(){
		if (bannedNames.some(word => newMember.nickname.replace(/[^A-z\s]|(.)\1| +/gi, '').toLowerCase().includes(word))||bannedSymbols.some(word => newMember.nickname.toLowerCase().includes(word))||(newMember.nickname.toLowerCase().startsWith('sp'))) {
				console.log('Intentando renombrar usuario...');
				oldMember.setNickname('Furro', ['Bad words.'])
					.then(() => console.log('Se ha renombrado a alguien.'))
					.catch(console.error);
		};
		}, 250);
	}
	else return console.log(`Usuario no coincide.`);	// for Debugging
});
bot.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
bot.on('messageCreate', message => {
	// If the message starts was sent by a bot, exit early.
	if (message.author.bot) return;
	
	if ((devMode === true)&&(message.author.id != 360892991499665408)) return;

	// If message channel is #tech or #gallery
	if ((message.channel.id == 742579461714870353)||(message.channel.id == 743291444672069652)) {
		console.log('Se ha enviado un mensaje a #tech o #gallery');
		if ((message.attachments.size > 0)||((message.content.toLowerCase().startsWith(`http://`)||message.content.toLowerCase().startsWith(`https://`))&&(!message.content.toLowerCase().includes('tenor.')))) {
			console.log('El contenido enviado corresponde.');
		} else {
			//var lastMessage = message.channel.messages.fetch({limit: 1})
			try {
				message.delete();
				return console.log(`Se ha borrado el mensaje: ${message}`);
			} catch {
				return console.log(`No se ha borrado el mensaje: ${message}\nFaltan permisos?`);
			};
		};
	}

	// Forbidden word automod
	if (bannedWords.some(words => message.content.replace(/[^A-z\s]|(.)\1| +/gi, '').toLowerCase().includes(words))) {
		console.log('Borrando la palabra prohibida.');
		try {
			message.delete();
			return console.log(`Se ha borrado el mensaje: ${message}`);
		} catch {
			return console.log(`No se ha borrado el mensaje: ${message}\nFaltan permisos?`);
		};
    }

	var attachment = 'PIC1.PNG';
	// If message is an attachment
	if (message.attachments.size > 0) {
		if (message.channel.id != 441386860300730378) return console.log('Ví la imágen pero no en el canal adecuado.');
		for (let i = 0; i < ignoreList.length; i++) {
			if (message.author.id === ignoreList[i]) {
				console.log('Nacho hizo algo.');
				let random = Math.floor(Math.random() * 7);
				if (random === 0) {
					message.channel.send('andate a la mierda nacho');
					esperarRespuesta();
				} else if (random === 1) {
					message.channel.send('chancho qlo ojala te salga un tumor');
					esperarRespuesta();
				};
				if (message.content.toLowerCase().includes(`w_arknig`)) {
					try {
						return message.delete();
					} catch(err) {
						console.log("No pude borrar el mensaje.")
					}
				}
			}
		};
		if ((message.attachments.first().name.toLowerCase().startsWith(`screenshot`))||(message.attachments.first().name.toLowerCase().startsWith(`unknown`))) {
			return console.log('Ví la imágen pero parece ser una captura');
		/*	screenshot = message.attachments.first().url;
			try {
				readImage();
			} catch(err) {
				console.log(`Error en línea 379:\n`+err)
			} finally {
				return;
			}*/
		}
		if (message.attachments.first().size < 70000) {
			console.log(message.attachments.first().size);
			return console.log('Ví la imágen pero es muy ligera y probablemente es un meme.');
		}
		if ((message.attachments.first().height < 512)||(message.attachments.first().width < 512)) {
			console.log(message.attachments.first().size);
			return console.log('Ví la imágen pero tiene baja resolución.');
		}
		if (message.attachments.every(attachIsImage)){
			let random = Math.floor(Math.random() * 38);
			let rand1Reaction = Math.floor(Math.random() * (react1List.length - 1) + 1);
			let randReaction = Math.floor(Math.random() * (reactList.length - 1) + 1);

			message.react(`${react1List[rand1Reaction]}`)
				.then(() => message.react(`${reactList[randReaction]}`))
				.catch(() => console.error('No se ha podido apretar el botón de nuez.'));
			// Add 1 to the nut counter.
			db.add('gregoBot.nuts', 1);
			console.log(`Ha aumentado la cantidad de nueces.`);
			try {
				message.channel.setRateLimitPerUser(5);
			} catch(err) {
				console.log("No puedo reducir el slowmode "+err);
			};
			setTimeout(function(){
			if (random === 0){
				message.channel.send({files: ['./memes/;momopatas;;roll_of_paper;.png']})
				.catch(() => console.error('Que onda?? No puedo mandar mis emotes'));
			} else if (random === 1){
				message.channel.send({files: ['./memes/;asd;;grego;asd;.png']})
				.catch(() => console.error('Que onda?? No puedo mandar mis emotes'));
			} else if (random === 2){
				message.channel.send({files: ['./memes/combo.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 3){
				message.channel.send({files: ['./memes/;tiversn;;fork_and_knife;.png']})
				.catch(() => console.error('Que onda?? No puedo mandar mis emotes'));
			} else if (random === 4){
				message.channel.send({files: ['./memes/jaxqlo.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 5){
				message.channel.send({files: ['./memes/tekken.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 6){
				message.channel.send({files: ['./memes/tenor_2.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 7){
				message.channel.send({files: ['./memes/forgiveme.jpg']})
				.catch(() => console.error('Que onda?? No puedo mandar la imagen'));
			} else if (random === 8){
				message.channel.send({files: ['./memes/god_of_war_iii_hercules.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 9){
				message.channel.send({files: ['./memes/68747470733a2f2f73332.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 10){
				message.channel.send('👌')
				.catch(() => console.error('Que onda?? No puedo mandar mensajes'));
			} else if (random === 11){
				message.channel.sendTyping();
				setTimeout(function(){
					message.channel.send('ta wena igual')
					.then(() => message.channel.send('le paso el pico por los rollos'))
					.then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
					.catch(() => console.error('Que onda?? No pude responder.'));
				}, 520);
			} else if (random === 12){
				message.channel.sendTyping();
				setTimeout(function(){
					message.channel.reply('rica, la dejaria mas irreconocible que cuerpo abaleado por narcos de brasil')
					.catch(() => console.error('Que onda?? No pude responder.'));
				}, 700);
			} else if (random === 13){
				message.channel.sendTyping();
				setTimeout(function(){
					message.channel.reply('no esta mal')
					.catch(() => console.error('Que onda?? No pude responder.'));
				}, 520);
			}
			else console.log(`Me aguanté mandar algo porque random es ${random}`);
			}, 480);
		}
	}

	let randomKps = Math.floor(Math.random()*200);//Random keystrokes per second (added ms).

	if(responseObject[message.content]) {
		message.channel.send(responseObject[message.content]);
	} else if ((message.channel.id === 742472922093846588)&&(message.content.toLowerCase().includes(`gracias grego`))) {
		message.channel.send({files: ['./memes/;tinttulo;.png']})
		.catch(() => console.error('Que onda?? No pude mandar la imágen.'));
	} else if (message.content.startsWith(`<@749824051945537637>`)) {
		try {
			bot.commands.get('chat').execute(message)
		} catch (error) {
			console.error(error);
			console.log('No puedo responder.');
		}
	} else if (message.content.startsWith(`$tu`)) {
		try {
			bot.commands.get('reclamar').execute(message)
		} catch (error) {
			console.error(error);
			console.log('No puedo responder.');
		}
	} else if (message.content.startsWith(`$rolls`)||message.content.startsWith(`$rt`)) {
		try {
			message.react('✅');
		} catch (error) {
			console.error(error);
			console.log('No puedo reaccionar.');
		}
	} else if (message.content.toLowerCase().startsWith(`$wish `)||message.content.toLowerCase().startsWith(`$w `)) {
		try {
			bot.commands.get('wish').execute(message)
		} catch (error) {
			console.error(error);
			return message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
		}
	} else if (message.content.toLowerCase().startsWith(`$wishlist`)||message.content.toLowerCase().startsWith(`$wl`)) {
		try {
			bot.commands.get('wishlist').execute(message)
		} catch (error) {
			console.error(error);
			return message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
		}
	} else if (message.content.toLowerCase().startsWith(`$wishremove `)||message.content.toLowerCase().startsWith(`$wr `)) {
		try {
			bot.commands.get('wishremove').execute(message)
		} catch (error) {
			console.error(error);
			return message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
		}
	} else if (message.content.toLowerCase().startsWith(`$wishremoveall`)||message.content.toLowerCase().startsWith(`$wra`)) {
		try {
			db.delete(`wishlists.${message.author.id}`);
			try {
				return message.react('✅');
			} catch (err) {
				return console.log(`No puedo reaccionar: ${err}`);
			};
		} catch (error) {
			console.error(error);
			try {
				return message.react('❌');
			} catch (err) {
				return console.log(`No puedo reaccionar: ${err}`);
			};
		}
	} else if (message.content.toLowerCase().includes(`nosgoth`)) {
		let replies = ["kabaltroteligero.gif", "UtY9sT39.gif"];
		let random = Math.floor(Math.random() * 2);
		if (random == 0) {
			setTimeout(function(){
			message.channel.send({files: [`./memes/UtY9sT39.gif`]});
			}, Number(500));
		} else {
			message.channel.send('CTM go')
				.then(() => message.channel.send({files: [`./memes/kabaltroteligero.gif`]}))
				.catch(() => console.error('Que onda?? No pude responder.'));
		};
	} else if (message.content.toLowerCase().startsWith(`buena grego`) || message.content.toLowerCase().startsWith(`hola grego`)) {
		message.channel.send('wena');
	} else if (message.content.toLowerCase().startsWith(`cierto grego`)) {
		let replies = ["<:grOhshit:718343364721901638>:droplet:", "<:perroHm:739735108314988554>", "<:Grego2:852589102804107264>", "<:Grego2:852589102804107264>:interrobang:", "Si.", "se wn"];
		let random = Math.floor(Math.random() * 6);
		message.channel.sendTyping();
		setTimeout(function(){
			message.channel.send(replies[random]);
		}, Number(900+randomKps));
	} else if (message.content.toLowerCase().includes(`fue el grego`)) {
		let replies = ["fue el esteban", "fue el nacho", "fue el luxo", "fue el mati", "fue el octavio", "fue el moreira wn"];
		let random = Math.floor(Math.random() * 6);
		message.channel.send('loco yo no fui')
			.then(() => message.channel.send(replies[random]))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.toLowerCase().startsWith(`fue el `)) {
		message.channel.send('no tomemos concluciones apresuradas');
	} else if (message.content.toLowerCase().includes(` genshin`)) {
		let random = Math.floor(Math.random() * 6);
		if (random == 0) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`mas razones por odiar esa wea de juego`);
		}, Number(1900+randomKps));//tomando en cuenta los keystrokes por segundo promedio de gr que puede ser de 5.
		} else if (random == 1) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`juego qlo malo aguante el gears`);
		}, Number(1550+randomKps));
		} else if (random == 2) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`mala la wea`);
		}, Number(550+randomKps));
		} else if (random == 3) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`otra razon mas para no volver a la mierda`);
		}, Number(2000+randomKps));
		};
	} else if (message.content.startsWith(`grego decide `)) {
		message.channel.send(`na que ver wn, es: \`grego decide, una wea, otra wea\``);
	} else if (message.content.startsWith(`grego elige `)) {
		message.channel.send(`na que ver wn, es: \`grego elige, una wea, otra wea\``);
	} else if (message.content.toLowerCase().startsWith(`mañana voy`)) {
		message.channel.send('no te creo nada')
			.then(() => message.channel.send('mentiroso qlo'))
			.then(() => message.channel.send({files: ['./memes/;momopatas;.png']}))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.toLowerCase().startsWith(`tu hermana`)) {
		message.channel.send({files: ['./memes/;momopatas;.png']});
	} else if (message.content.toLowerCase().startsWith(`weon ese `)) {
		message.channel.send('Si.');
	} else if (message.content.toLowerCase().startsWith(`wena grego`)) {
		message.channel.send('wena wena')
			.then(() => message.channel.send('quien su lol?'))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.startsWith(`XD`)) {
		message.channel.send({files: ['./memes/;momopatas;.png']});
	} else if ((message.content.length > 800)&&(message.content.toLowerCase().includes(`es cuando molestan`))) {
		message.channel.send(`increible`);
		return message.delete();
    } else if ((message.content.toLowerCase().includes(`camiroaga`))||(message.content.toLowerCase().includes(`felipito`))) {
		try {
			bot.commands.get('camiro').execute(message)
		} catch (error) {
			console.error(error);
			message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
		}
	}
		
	// If message channel is #monaschinas
	if (message.channel.id == 441386860300730378) {
		console.log('Se ha enviado un mensaje a #monaschinas.');
		if ((message.attachments.size > 0)||(message.content.toLowerCase().startsWith(`http`))||(message.content.toLowerCase().startsWith(`$w`))) {
			try {
				db.delete(`booru.textCount`);
			} catch(err) {
				console.log("chucha:"+err+"\nError al borrar base de datos en bot.js");
			};
		} else {
			textCounter = db.get(`booru.textCount`);
			try {
				db.add(`booru.textCount`, 1);
			} catch {
				console.log(`Error en línea 580 de bot.js`);
			};
			if ((textCounter!== null)&&(textCounter == 20)) {
				console.log("Están hablando demasiado.");
				let random = Math.floor(Math.random() * 4);
				message.channel.sendTyping();
				if (random === 3){
					setTimeout(function(){
						message.channel.send('ya si si bacan')
						.catch(() => console.error('Que onda?? No pude responder.'));
						setTimeout(function(){
							message.channel.send('donde estan las wachas??')
							.catch(() => console.error('Que onda?? No pude responder.'));
						}, 1210);
					}, 660);
				} else if (random === 2){
					setTimeout(function(){
						message.channel.send('dejen de hablar mierda')
						.catch(() => console.error('Que onda?? No pude responder.'));
						setTimeout(function(){
							message.channel.send('manden minas')
							.catch(() => console.error('Que onda?? No pude responder.'));
						}, 1090);
					}, 790);
				} else if (random === 1){
					setTimeout(function(){
						message.channel.send('buena wn si')
						.catch(() => console.error('Que onda?? No pude responder.'));
						setTimeout(function(){
							message.channel.send('y las minas cuando?')
							.catch(() => console.error('Que onda?? No pude responder.'));
						}, 1180);
					}, 700);
				} else {
					setTimeout(function(){
						message.channel.send('hablan pura mierda wn')
						.catch(() => console.error('Que onda?? No pude responder.'));
						setTimeout(function(){
							message.channel.send('suban alguna wea')
							.catch(() => console.error('Que onda?? No pude responder.'));
						}, 1130);
					}, 740);
				};
				try {
					message.channel.setRateLimitPerUser(60);
				} catch(err) {
					return console.log("No puedo poner slowmode: "+err);
				};
			}
		};
	}
	
	const prefixes = ['Grego ', 'grego ', 'Gr ', 'gr ', 'GREGO '];
	const prefix = prefixes.find(p => message.content.startsWith(p));
//	if (!prefix) return;
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/, o | o |, /);
	//.split(/ +/g) will cut any ammount of spaces in between.
	const commandName = args.shift().toLowerCase();
	
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply({ content: 'por privado no wn', allowedMentions: { repliedUser: false }});
	}

	//Screenshot reading with TesseractOCR
	async function readImage() {
		await worker.load();
		await worker.loadLanguage('eng+spa');
		await worker.initialize('eng+spa');
		const { data: { text } } = await worker.recognize(attachment);
		console.log(text);
		if (text.toLowerCase().includes(`genshin`)) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`juego qlo malo aguante el gears`);
			}, Number(1550));
		} else if (text.toLowerCase().includes(`nekopara`)) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`la wea buena`);
			}, Number(600));
		} else if (text.toLowerCase().includes(`sopmod`)) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`la wea mala oh`);
			}, Number(660));
		} else if (text.toLowerCase().includes(`grego`)) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`<:Grego2:852589102804107264>⁉`);
			}, Number(360));
		} else if (text.toLowerCase().includes(`notebook`) || text.toLowerCase().includes(`laptop`)) {
			message.channel.sendTyping();
			setTimeout(function(){
			message.channel.send(`en las mierdas que te gastai la plata`);
			}, Number(720));
		};
		await worker.terminate();
	}

	async function esperarRespuesta() {
		let filter = m => m.author.id === message.author.id;
		message.channel.awaitMessages(filter, {
			max: 1,
			time: 22000, // Wait 22 seconds
			errors: ['time']
		})
		.then(message => {
			message = message.first()
			if (message.content.toLowerCase().includes(`mamala`) || message.content.toLowerCase().includes(`culear`) || message.content.toLowerCase().includes(`culeo`) || message.content.toLowerCase().includes(`hermano`)) {
				message.channel.send(`dare cuerpo y alma para que no vuelvas al mudae`)
			} else if (message.content.toLowerCase().includes(`puta`) || message.content.toLowerCase().includes(`rachel`) || message.content.toLowerCase().includes(`wea mala`) || message.content.toLowerCase().includes(`mamala`) || message.content.toLowerCase().includes(`inculto`) || message.content.toLowerCase().includes(`no cacha`)) {
				message.channel.send({files: ['./memes/chubis/triste.png']})
			} else if (message.content.toLowerCase().includes(`culiao`) || message.content.toLowerCase().includes(`qlo`) || message.content.toLowerCase().includes(`conchetumare`) || message.content.toLowerCase().includes(`ctm`) || message.content.toLowerCase().includes(`chupala`)) {
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

	//added in order to verify that attachments are images and not videos
	function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    //True if the url is not a gif image.
    return url.indexOf("gif", url.length - "gif".length /*or 3*/) == -1;
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
	}

});
// login to Discord with your app's token
bot.login(process.env.BOT_TOKEN);