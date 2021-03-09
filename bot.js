// Node's native file system module.
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
const { token, gregorid } = require('./config.json');

// Quick.db is an easy-to-use database manager built with better-sqlite3.
const db = require('quick.db');

const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({
  connectionString,
})
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
const client = new Client({
  connectionString,
})
client.connect()
client.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  client.end()
})

// create a new Discord client
const bot = new Discord.Client({ 
ws: { intents: [
	'GUILDS',
	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS'] }
});
// a class that extend JS's native Map class and include more extensive functionality.
bot.commands = new Discord.Collection();
// will return an array of all the file names in that directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const triggers = fs.readFileSync('./preguntas.txt').toString().split("\n");
const activitiesList = [
    "League of Legends",
    "League of Legends",
    "Warframe",
    "Warframe",
	"Warframe",
	"Old School RuneScape",
	"Old School RuneScape",
    "Counter-Strike: Global Offensive",
    "Counter-Strike: Kinda Offensive",
    "Tom Clancy's Rainbow Six Siege",
    "Mortal Kombat 11",
	"DRAGON BALL FighterZ",
	"Borderlands 2",
    "Super Mario 64",
	"Where's Waldo?",
    "Girls' Frontline",
	"RAID: Shadow Legends",
	"Diablo® Immortal™",
	"Kung Fu Panda: Showdown of Legendary Legends",
	"Disc Jam",
	"Multi Theft Auto",
	"Grand Theft Auto: San Andreas",
	"Desert Bus",
	"el 6 y el 7",
	"estar hecho mierda",
    "Spacewar",
    "Hentai Furry"
    ]; // creates an arraylist containing phrases you want your bot to switch through.
const topicList = [
    "Guilty Gear XX Λ Core Plus R",
    "GUILTY GEAR™ -STRIVE-",
	"Pro Jumper! Guilty Gear Tangent!?",
    "Killer Instinct",
    "Garou: Mark of the Wolves",
	"Pocket Rumble",
	"Tobal 2",
	"Tomba! 2: The Evil Swine Return",
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
	"framedata",
	"juegos de mesa",
	"rollback netcode",
	"GGPO",
    "Mudae"
    ];
const reactList = [
	"🔩",
	"🔩",
	"🙏",
    "🍴"
    ];
const ignoreList = [
	'565330655915933696',
	'439205512425504771'
	]; // banned from image reactions.
const bannedWords = [
    "m4",
    "sopmod",
    "sopm0d",
    "s0pmod",
    "s0pm0d",
    "sØpmØd",
    "søpmød",
    "søpmod",
    "sopmød",
	"sºpmod",
	"sºpmºd",
	"sopmºd",
	"s°pm°d",
	"sopm°d",
	"s°pmod",
	"sºpmºd",
	"sºpmod",
	"sopmºd",
	"s°pmºd",
	"sºpm°d",
    "søpmºd",
    "sºpmød",
	"sоpmоd",
    "$opmod",
    "$oppo",
    "$pmd",
    "soppo",
	"soppu",
	"spmd",
	"spmod",
	"sopmd",
	"sodmop",
	"dompos",
	"posmod",
	"sompod",
	"dompos",
	"zompod",
	"zopmod",
	"hup tao",
	"sop tao",
	"hu mod",
    "ambercita",
    "amber",
    "4mber",
    "amb3r",
    "4mb3r",
	"zandmod",
    "jillmod",
	"stingray",
    "jill"
    ]; // Don't ever say them out loud.
const responseObject = {
	"ta el grego?": "no XD",
	"mamala grego": "tonto weon ese ni siquiera es el comando",
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
	bot.users.fetch(gregorid).then(myUser => {
    bot.user.setAvatar(myUser.avatarURL())})
	.then(() => console.log(myUser))
	.catch(() => console.log(`Cambié el avatar hace muy poco...`));
	// Setting the ammount of nuts.
	if (db.has('gregoBot') == 0) {
	db.set('gregoBot', { nuts: 0 });
	console.log(`Se ha creado una nueva partida.`);
	}
});
bot.on('ready', function () {
//	console.log(User); // Some user object.
	console.log(`${bot.user.tag} has logged in.`);
	setInterval(() => {
		const topic = Math.floor(Math.random() * (topicList.length - 1) + 1);
		bot.channels.cache.get('438741858018000897').setTopic(`Aquí se habla de ${topicList[topic]}.`)
		.then(updated => console.log(`Channel's new topic is "${topicList[topic]}".`))
		.catch(console.error);
    }, 12240000); // Runs this every 3.4 hours.
	setInterval(() => {
        const index = Math.floor(Math.random() * (activitiesList.length - 1) + 1); // generates a random number between 1 and the length of the activities array list.
        bot.user.setActivity(activitiesList[index], { type: 'PLAYING' }) // sets bot's activities to one of the phrases in the arraylist.
		.then(presence => console.log(`Ahora jugando a ${presence.activities[0].name}`))
		.catch(console.error);

    }, 300000); // Runs this every 300 seconds.
});
//	async member*
bot.on('guildMemberAdd', member => {
	let channel = member.guild.channels.cache.find(ch => ch.name === 'principal');
	if (!channel) return;
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
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
            // An error happened
            // This is generally due to the bot not being able to kick the member,
            // either due to missing permissions or role hierarchy
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
// If user joins, get Principal and send a message.
});
bot.on('guildMemberUpdate', function(oldMember, newMember){
	if (oldMember.nickname === newMember.nickname) return;
	console.log(`Nickname antes: ${oldMember.nickname}`);
	console.log(`Nickname ahora: ${newMember.nickname}`);
	if (oldMember.id == '565330655915933696') {
		console.log('Usuario coincide.');
		//Add a wait function, since it doesn't seem to execute this chunk of code.
		setTimeout(function(){
		if( bannedWords.some(word => newMember.nickname.toLowerCase().includes(word)) ) {
				console.log('Intentando renombrar usuario...');
				oldMember.setNickname('Don Comedia', ['Bad words.'])
					.then(() => console.log('Se ha renombrado a Don Comedia'))
					.catch(console.error);
		};
		}, 250);
	}
	else return console.log(`Usuario no coincide.`);	// for Debugging
});
bot.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
bot.on('message', message => {
	if (message.author.bot) return;
// If the message starts was sent by a bot, exit early.
	if (message.attachments.size > 0) {
		for (let i = 0; i < ignoreList.length; i++) {
			if (message.author.id === ignoreList[i]) return console.log('Alguien fue ignorado.');
		};
		if (message.attachments.every(attachIsImage)){
			if (message.channel.id != 441386860300730378) return console.log('Ví la imágen pero no en el canal adecuado.');
			if (message.content.toLowerCase().startsWith(`unknown`)) return console.log('Ví la imágen pero parece ser una captura');
			let random = Math.floor(Math.random() * 20);
			let randReaction = Math.floor(Math.random() * (reactList.length - 1) + 1);
//		Connected to database
			const parse = require("pg-connection-string");
			const { Pool } = require ('pg');
			const pool = new Pool({
				connectionString: process.env.DATABASE_URL.parse,
				port: 5432,
				host: process.env.DATABASE_HOST,
				database: process.env.DATABASE,
				user: process.env.DATABASE_USER,
				password: process.env.DATABASE_PASSWORD,
				ssl: false,
			});

			message.react('750502194108956682')
				.then(() => message.react(`${reactList[randReaction]}`))
				.catch(() => console.error('No se ha podido apretar el botón de nuez.'));
			// Add 1 to the nut counter.
			db.add('gregoBot.nuts', 1);
			console.log(`Ha aumentado la cantidad de nueces.`);
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
				message.channel.send({files: ['./memes/god_of_war_iii_hercules.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
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
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 8){
				message.channel.send({files: ['./memes/68747470733a2f2f73332.gif']})
				.catch(() => console.error('Que onda?? No puedo mandar el gif'));
			} else if (random === 9){
				message.channel.startTyping();
				setTimeout(function(){
					message.channel.send('ta wena igual')
					.then(() => message.channel.send('le paso el pico por los rollos'))
					.then(() => message.channel.send({files: ['./memes/;Grausar;.png']}))
					.catch(() => console.error('Que onda?? No pude responder.'));
					return message.channel.stopTyping(true);
				}, 500);
			}
			else console.log(`Me aguanté mandar algo porque random es ${random}`);
			}, 500);
		}
	}

//	const mensaje = message.content.toLowerCase();

	if(responseObject[message.content]) {
		message.channel.send(responseObject[message.content]);
	} else if (message.content.toLowerCase().startsWith(`ta el grgr`)) {
		message.channel.send('no XD');
	} else if (message.content.toLowerCase().startsWith(`ah ta el gr`)) {
		message.channel.send('se wn');
	} else if (message.content.toLowerCase().startsWith(`ah esta el gr`)) {
		message.channel.send('se wn');
	} else if (message.content.toLowerCase().startsWith(`ah está el gr`)) {
		message.channel.send('se wn');
	} else if (message.content.toLowerCase().startsWith(`buena grego`)) {
		message.channel.send('wena');
	} else if (message.content.toLowerCase().startsWith(`hola grego`)) {
		message.channel.send('wena');
	} else if (message.content.toLowerCase().startsWith(`wena grego`)) {
		message.channel.send('wena wena')
			.then(() => message.channel.send('quien su lol?'))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.startsWith(`XD`)) {
		message.channel.send({files: ['./memes/;momopatas;.png']});
	} else if (message.content.toLowerCase().startsWith(`mañana `)) {
		message.channel.send('no te creo nada')
			.then(() => message.channel.send('mentiroso qlo'))
			.then(() => message.channel.send({files: ['./memes/;momopatas;.png']}))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.toLowerCase().startsWith(`weon ese `)) {
		message.channel.send('Si.');
	} else if (message.content.toLowerCase().startsWith(`cierto grego`)) {
		let replies = ["<:grOhshit:718343364721901638>:droplet:", "<:perroHm:739735108314988554>", "<:Grego:750502194108956682>", "<:Grego:750502194108956682>:interrobang:", "Si."];
		let random = Math.floor(Math.random() * 5);
		message.channel.send(replies[random]);
	} else if (message.content.toLowerCase().includes(`fue el grego`)) {
		let replies = ["fue el esteban", "fue el nacho", "fue el luxo", "fue el mati"];
		let random = Math.floor(Math.random() * 4);
		message.channel.send('loco yo no fui')
			.then(() => message.channel.send(replies[random]))
			.catch(() => console.error('Que onda?? No pude responder.'));
	} else if (message.content.toLowerCase().startsWith(`fue el `)) {
		message.channel.send('no tomemos concluciones apresuradas');
	} else if (message.content.toLowerCase().includes(`lucho`)) {
		let random = Math.floor(Math.random() * 3);
		if (random == 0) {
			message.channel.startTyping();
			setTimeout(function(){
			message.channel.send(`cual lucho?`);
			return message.channel.stopTyping(true);
		}, 240);
		}
	} else if (message.content.toLowerCase().includes(`genshin`)) {
		let random = Math.floor(Math.random() * 2);
		if (random == 0) {
			message.channel.startTyping();
			setTimeout(function(){
			message.channel.send(`mas razones por odiar esa wea de juego`);
			return message.channel.stopTyping(true);
		}, 360);
		}
	}else if (message.content.toLowerCase().startsWith(`tu hermana`)) {
		message.channel.send({files: ['./memes/;momopatas;.png']});
	} else if (message.content.startsWith(`grego decide `)) {
		message.channel.send(`na que ver wn, es: \`grego decide, una wea, otra wea\``);
	} else if (message.content.startsWith(`grego elige `)) {
		message.channel.send(`na que ver wn, es: \`grego elige, una wea, otra wea\``);
	}
	
	const prefixes = ['Grego ', 'grego ', 'gr '];
	const prefix = prefixes.find(p => message.content.startsWith(p));
//	if (!prefix) return;
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	var args = message.content.slice(prefix.length).trim().split(/, o | o |, /);
	//.split(/ +/g) will cut any ammount of spaces in between.
	const commandName = args.shift().toLowerCase();
	
	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('basta wn, por privado no');
	}


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
		message.reply('estoy hecho mierda weon!');
	}
});
// login to Discord with your app's token
bot.login(process.env.BOT_TOKEN);//(token)/(process.env.BOT_TOKEN)