const fs = require("fs")
const Discord = require('discord.js');
const bot = new Discord.Client({ 
ws: { intents: [
	'GUILDS',
	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS'] }
});
module.exports = {
	name: 'frases',
	aliases: ['quotes','frase funa','funas','ff'],
	description: 'Gregorio te una galería de frases funables.',
	args: true,
	usage: 'Número de página',
	execute(message, args) {
  // Require json file.
  const frases = require('./frases.json');
  console.log(frases.length);

  // Define our function.
  async function list(listMsg, page, increment) {
    const entries = Object.entries(frases);
		const random = Math.floor(Math.random() * (entries.length - 1) + 1);
/*
    if ((args[0] === 'random')||(args[0] === 'any')||(args[0] === 'azar')||(args[0] === 'cualquiera')) {
      page = random;
    }
    else if ((args[0] === 'undefined')||(isNaN(args[0]))||(args[0] > entries.length)||(args[0] < 1)) {
      page = 1;
    }
    else {
      page = args[0]
    }*/

    var fraseField = ""
    var stringField = ""

    for (let [frase, string] of entries.slice(page - 1, page)) {
      fraseField = fraseField+frase;
      stringField = stringField+string;
    }

    // Set up base embed.
    var embed = new Discord.MessageEmbed()
      .setColor(1056085)
      .setTitle(`Frase **${page}** de ${entries.length}`)
      .setAuthor('Frases Funa', 'https://i.imgur.com/ZmtGJgz.png')
      .setThumbnail("https://www.arcade-fighter.com/images/guilty-gear-xx-accent-core-plus/ggxx-ac-arcade-slayer.jpg")
      .setDescription(`*${stringField}*`)
      .setFooter(`- ${fraseField}`);

    // Edit/send embed.
    if (listMsg) await listMsg.edit(embed);
    else listMsg = await message.channel.send(embed);

    // Set up page reactions.
    const lFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
    const lCollector = listMsg.createReactionCollector(lFilter, { max: 1 });

    lCollector.on('collect', async () => {
      rCollector.stop();
      await listMsg.reactions.removeAll();;
      if (page == 1) {
        list(listMsg, entries.length, increment);
      }
      else {
        list(listMsg, page - 1, increment);
      }
      
    });

    const rFilter = (reaction, user) => reaction.emoji.name === '▶' && user.id === message.author.id;
    const rCollector = listMsg.createReactionCollector(rFilter, { max: 1 });

    rCollector.on('collect', async () => {
      lCollector.stop();
      await listMsg.reactions.removeAll();;
      if (page == entries.length) {
        list(listMsg, 1, increment);
      }
      else {
        list(listMsg, page + 1, increment);
      }
    });

    await listMsg.react('◀');
    await listMsg.react('▶');
  }

/*  const removeReaction = async (m, msg, emoji) => {
    try { m.reactions.find(r => r.emoji.name == emoji).users.remove(msg.author.id); }
    catch(err) {console.log("chucha: "+err)}
  }*/

  // Send the list; page 1, and 5 shown on each page.
  list(undefined, 1, 1)
    .catch(console.error);
    },
};