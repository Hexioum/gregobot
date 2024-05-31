// Node's native file system module.
const fs = require('node:fs');
const path = require('node:path');
// require the discord.js module
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { gregorId } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
//const Booru = require('booru');
/*const { createWorker } = require('tesseract.js');
const worker = createWorker({
	logger: m => console.log(m)
});*/
var CronJob = require('cron').CronJob;
// Quick.db is an easy-to-use database manager built with better-sqlite3.
const { QuickDB } = require('quick.db');
const db = new QuickDB();
// PostgreSQL is a hard-to-use database manager.
//const dbp = require('./models/index.js');

// create a new Discord client
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent
		]
	}
);
// a class that extend JS's native Map class and include more extensive functionality.
client.commands = new Collection();

// will return an array of all the file names in that directory
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const slashPath = path.join(__dirname, 'commslash');
const slashFiles = fs.readdirSync(slashPath).filter(file => file.endsWith('.js'));


//const triggers = fs.readFileSync('./preguntas.txt').toString().split("\n");

// Registering slash commands.
for (const file of slashFiles) {
	const filePath = path.join(slashPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		console.log(`[ATTENTION] "${file}" was registered as a slash command.`);
		client.commands.set(command.data.name, command);
	};
}

const devMode = false; // >>ATTENTION<<

//const wiki = require('wikijs').default;
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
    "Counter-Strike 2",
    "Counter-Strike: Kinda Offensive",
    "Tom Clancy's Rainbow Six Siege",
	"Overwatch 2",
	"Paladins",
    "Fortnite",
	"GUILTY GEAR -STRIVE-",
    "Mortal Kombat 1",
    "Mortal Kombat 1",
	"DRAGON BALL FighterZ",
	"Borderlands 2",
    "Super Mario 64",
	"Fall Guys",
	"Lethal Company",
    "Folio Azul",
    "Girls' Frontline",
	"Mafia City",
	"Diablo® Immortal™",
	"Kung Fu Panda: Showdown of Legendary Legends",
	"Disc Jam",
	"Multi Theft Auto",
	"Grand Theft Auto: San Andreas",
	"Grand Theft Auto VI",
	"Sex and the Furry Titty 2: Sins of the City",
	"Desert Bus",
	"bailar a lo GTA VI",
	"el 6 y el 7",
	"estar hecho mierda",
    "Pokémon Hentai",
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
	"Akatsuki",
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
    "arknights","pleche","wlech"
    ]; // Don't ever say them out loud.
const bannedWords = [
    "borra este mensaje","dompos","hupt","hup tao"
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
	client.commands.set(command.name, command);
}
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('REDIOOOOOOOOOOS!');
	// Setting the ammount of nuts.
	loadData();
	async function loadData() {
		if (await db.has('gregoBot') == 0) {
			db.set('gregoBot', { nuts: 0 });
			console.log(`Se ha creado una nueva partida.`);
		}
	}
});

client.on('ready', function () {
//	console.log(User); // Some user object.
	console.log(`${client.user.tag} has logged in.`);
	const guildId = process.env.MAIN_GUILD;
	const myGuild = client.guilds.cache.get(guildId);
	
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
				client.channels.cache.get('438741858018000897').send(`${jobsFri[Number(randomComment)]}`);// Sends a message to #principal
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

	var avtSnatch = new CronJob(
		'0 0 0 * * *',//“Every day at 00:00 hours.”
		async function() {
			getAvatar().then(result => 
				client.user.setAvatar(`https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.png`))
				.catch(err => console.log("No puedo cambiar el avatar: "+err));
		},
		null,
		true,
		'America/Santiago'
	);

	var avtNormal1 = new CronJob(
		'0 0 0 1,2,7 0-5 *',//“At 00:00 on day 1, 2, and 7 in every month from January through June.”
		async function() {
			await myGuild.setIcon('./memes/avatars/nachogbr.jpg')
			.then(user => console.log(`Cambio de avatar.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtLaborday = new CronJob(
		'9 0 0 1 4 *',//“At 00:00:09 on May 1st.”
		async function() {
			await myGuild.setIcon('./memes/avatars/laborday.png')
			.then(user => console.log(`Cambio de avatar, Trabajador.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtKrausar = new CronJob(
		'0 0 0 6 5 *',//“At 00:00 on June 6th.”
		async function() {
			await myGuild.setIcon('./memes/avatars/aprilfools.png')
			.then(user => console.log(`Cambio de avatar, Krausar.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtNormal2 = new CronJob(
		'0 0 0 1 5-11 *',//“At 00:00 on day-of-month 1 from July through December.”
		async function() {
			await myGuild.setIcon('./memes/avatars/nachogck.png')
			.then(user => console.log(`Cambio de avatar.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);
	var avtXmas = new CronJob(
		'0 0 0 24 11 *',//“At 00:00 on December 24th.”
		async function() {
			await myGuild.setIcon('./memes/avatars/nachogpd.png')
			.then(user => console.log(`Cambio de avatar, Felices fiestas.`))
			.catch(console.error);
		},
		null,
		true,
		'America/Santiago'
	);

	setInterval(() => {
		const topic = Math.floor(Math.random() * (topicList.length - 1) + 1);
		client.channels.cache.get('438741858018000897').setTopic(`Aquí se habla de ${topicList[topic]}.`)
		console.log(`En principal ahora se habla de "${topicList[topic]}".`);
    }, 48960000); // Runs this every 6.8 hours.
	setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1);
        client.user.setPresence({ activities: [{ name: activitiesList[index] }], status: 'playing' }); // sets bot's activities to one of the phrases in the arraylist.
		//console.log(`Ahora jugando a ${activitiesList[index]}`);
    }, 480000); // Runs this every 480 seconds.
});

client.on('guildMemberAdd', async member => {
	let channel = member.guild.channels.cache.find(ch => ch.name === 'principal');
	if (!channel) return;
    // Assuming we mention someone in the message, this will return the user.
    if (gregorId) {
      // Now we get the member from the user
      let member = myGuild.members.resolve(gregorId);
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
	// This is not good.
    member.guild.channels.get('438741858018000897').send("que chucha..."); 
// If user joins, get #Principal and send a message.
});

client.on('guildMemberUpdate', function(oldMember, newMember){
	if (oldMember.nickname === newMember.nickname) return;
	console.log(`Nickname antes: ${oldMember.nickname}`);
	console.log(`Nickname ahora: ${newMember.nickname}`);
	if (oldMember.id == '565330655915933696') {
		console.log('Usuario Kan.');
		var last1 = ""
		var last2 = ""
		var last3 = ""
		var last4 = ""
		var newName = newMember.nickname
		if (newName.length > 3) {
			last4 = newMember.nickname.slice(-4);
			last4 = last4.toLowerCase()
		}
		if (newName.length > 2) {
			last3 = newMember.nickname.slice(-3);
		}
		if (newName.length > 1) {
			last2 = newMember.nickname.slice(-2);
		}
		if (newName.length > 0) {
			last1 = newMember.nickname.slice(-1);
		}
		if (last2 == "ca" || last2 == "ka" || last2 == "pa" || last2 == "aw" || last2 == "ow") {
			newName = newMember.nickname+"n"
		}
		else if (last1 == "c" || last1 == "f" || last1 == "k" || last1 == "p" || last1 == "v") {
			newName = newMember.nickname+"an"
		}
		else if (last4!= "khan" &&(last3!="can" && last3!="kan" && last3!="lan" && last3!="man" && last3!="san" && last3!="wea")) {
			newName = newMember.nickname+"kan"
		}
		if (newName.length<= 32) {
			oldMember.setNickname(newName, ["Justo y necesario."])
		}
	}
	else if (oldMember.id == '311225637966708736') {
		console.log('Usuario More Ira.');
		var newName1 = newMember.nickname+" (el moreira wn)"
		var newName2 = newMember.nickname+" (el moreira)"
		var newName3 = newMember.nickname+" (moreira)"
		var reason = "Más facil de identificar."
		if (newName1.length<= 32) {
			oldMember.setNickname(newName1, [reason])
		} else if (newName2.length<= 32) {
			oldMember.setNickname(newName2, [reason])
		} else if (newName3.length<= 32) {
			oldMember.setNickname(newName3, [reason])
		}
	}
	else return console.log(`Usuario no coincide.`);	// for Debugging
});

client.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('messageCreate', message => {
	// If the message starts was sent by a bot, exit early.
	if (message.author.bot) return;
	
	if ((devMode === true)&&(message.author.id != 360892991499665408)) return;

	// If message channel is #tech or #gallery
	if ((message.channel.id == 742579461714870353)||(message.channel.id == 743291444672069652)) {
		console.log('Se ha enviado un mensaje a #tech o #gallery');
		if ((message.attachments.size > 0)||((message.content.toLowerCase().includes(`http://`)||message.content.toLowerCase().includes(`https://`))&&(!message.content.toLowerCase().includes('tenor.'))&&(!message.content.toLowerCase().includes('/emojis/')))) {
			if ((message.attachments.size > 0)&&(message.attachments.first().height > 0)&&(message.attachments.first().height < 320)&&(message.attachments.first().width > 0)&&(message.attachments.first().width < 320)) {
				// Deletes Stickers or fake emotes.
				console.log("Borrando sticker o emote.")
				try {
					message.delete();
					return console.log(`Se ha borrado el mensaje: ${message}`);
				} catch(err) {
					return console.log(`No se ha borrado el mensaje: ${message}\nFaltan permisos?`);
				};
			}
			console.log('El contenido enviado corresponde.');
			var topic = makeTopic(message);
			message.startThread({
				name: `${topic} - ${message.createdTimestamp}`,
				autoArchiveDuration: 60,
				type: 'GUILD_PUBLIC_THREAD'
			});
		} else {
			console.log("Borrando mensaje.")
			//var lastMessage = message.channel.messages.fetch({limit: 1})
			if (message.reference!==null) {
				console.log(`Mensaje era una respuesta.`)
				//const reply = fetchMessage(message);
			}
			try {
				message.delete();
				return console.log(`Se ha borrado el mensaje: ${message}`);
			} catch(err) {
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
		} catch(err) {
			return console.log(`No se ha borrado el mensaje: ${message}\nFaltan permisos?`);
		};
    }

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
			client.commands.get('cai').execute(message)
		} catch (error) {
			console.error(error);
			console.log('No puedo responder.');
		}
	} else if (message.content.startsWith(`$tu`)) {
		try {
			client.commands.get('reclamar').execute(message)
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
			client.commands.get('wish').execute(message)
		} catch (error) {
			console.error(error);
			return message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
		}
	} else if (message.content.toLowerCase().startsWith(`$wishlist`)||message.content.toLowerCase().startsWith(`$wl`)) {
		try {
			client.commands.get('wishlist').execute(message)
		} catch (error) {
			console.error(error);
			return message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
		}
	} else if (message.content.toLowerCase().startsWith(`$wishremove `)||message.content.toLowerCase().startsWith(`$wr `)) {
		try {
			client.commands.get('wishremove').execute(message)
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
	} else if (message.content.toLowerCase().includes(`demaciado`)) {
		message.channel.send('DEMACIADO');
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
	} else if (message.content.toLowerCase().startsWith(`mañana voy `)) {
		message.channel.send('no te creo nada')
			.then(() => message.channel.send('mentiroso qlo'))
			.then(() => message.channel.send({files: ['./memes/;momopatas;.png']}))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.toLowerCase().startsWith(`pongan `)) {
		try {
			client.commands.get('play').execute(message)
		} catch (error) {
			console.log("Error al iniciar comando pongan: "+error);
		}
	} else if (message.content.toLowerCase().startsWith(`tu hermana`)) {
		message.channel.send({files: ['./memes/;momopatas;.png']});
	} else if (message.content.toLowerCase().startsWith(`weon ese `)) {
		message.channel.send('Si.');
	} else if (message.content.toLowerCase().startsWith(`wena grego`)) {
		message.channel.send('wena wena')
			.then(() => message.channel.send('quien su lol?'))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if ((message.content.length > 750)&&(message.content.toLowerCase().includes(`es cuando molestan`))) {
		message.channel.send(`increible`);
		return message.delete();
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
			} catch(err) {
				console.log(`Error en línea 771 de bot.js`);
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
	
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply({ content: 'por privado no wn', allowedMentions: { repliedUser: false }});
	}

	//added in order to verify that attachments are images and not videos
	function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    //True if the url is not a gif image.
    return url.indexOf("gif", url.length - "gif".length /*or 3*/) == -1;
	}

	try {
		command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		message.reply({ content: 'estoy hecho mierda weon!', allowedMentions: { repliedUser: false }});
	}

});

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

async function getAvatar() {
	const response = await fetch(`https://discord.com/api/v9/users/${gregorId}`, {
		headers: {
			'Authorization': 'Bot ' + (process.env.BOT_TOKEN)
		}
	})
	return await response.json()
}

async function fetchMessage(message) {
	const reply = await message.channel.messages.fetch(message.reference.messageId);
	return reply;
}

function makeTopic(message) {
	const EMBABLE_VIDEO = [".mov",".mp4",".webm"]
	var topic = "Post"
	if (EMBABLE_VIDEO.indexOf(message.content.toLowerCase()) > -1) {
		var topic = "Video"
	}
	return topic;
}

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN)