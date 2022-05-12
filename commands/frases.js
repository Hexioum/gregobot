const fs = require("fs")
const Discord = require('discord.js');
module.exports = {
	name: 'frases',
	aliases: ['quotes','frase funa','funas','ff'],
	description: 'La galería de frases funables.',
	args: true,
	usage: 'Número de página',
	execute(message, args) {
  // Require json file.
  const frases = require('./frases.json');
  const entries = Object.entries(frases);
  const random = Math.floor(Math.random() * (entries.length - 1) + 1);
  var page = 0;
  var frase = "";
  if ((typeof args[0] === 'undefined')||(args[0] === 'random')||(args[0] === 'any')||(args[0] === 'al azar')||(args[0] === 'azar')||(args[0] === 'cualquiera')||(args[0] === 'al achunte')||(args[0] === 'a la chuña')||(args[0] === 'me siento con suerte')||(args[0] === 'feeling lucky')||(args[0] === `I'm feeling lucky`)||(args[0] === `i'm feeling lucky`)) {
    page = random;
    list(undefined, page, 1).catch(console.error);
  }
  else if ((args[0].length < 3)&&(parseInt(args[0]) > 0)&&(parseInt(args[0]) <= entries.length)) {
    page = args[0];
    list(undefined, page, 1).catch(console.error);
  }
  else if ((args[0] === 'undefined')||(args[0] > entries.length)||(args[0] < 1)) {
    page = 1;
    list(undefined, page, 1).catch(console.error);
  }
  else {
    for (var i = 0; i < entries.length; i++){
      frase = entries[i].slice(1).toString();
      if (frase.toLowerCase().includes(args[0].toLowerCase())){
        const page = i+1;
        console.log(`Frase encontrada: #${page}.- "${frase}"`);
        return list(undefined, page, 1).catch(console.error);
      }
      else if (i == entries.length) {
        return message.reply('no hay niuna frase que diga esa wea');
      }
    }
  }

  // Define the function.
  async function list(listMsg, page, increment) {
    console.log(`Mostrando la página ${page} de Frases Funa`);

    var autorField = ""
    var fraseField = ""

    for (let [frase, string] of entries.slice(page - 1, page)) {
      autorField = autorField+frase;
      fraseField = fraseField+string;
    }

    // Set up base embed.
    var embed = new Discord.MessageEmbed()
      .setColor(1056085)
      .setTitle(`Frase **${page}** de ${entries.length}`)
      .setAuthor({name:'Frases Funa',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
      .setThumbnail("https://i.imgur.com/OtQSmow.png")
      .setDescription(`*${fraseField}*`)
      .setFooter({text:`- ${autorField}`});

    // Edit/send embed.
    if (listMsg) await listMsg.edit({ embeds: [embed] });
    else listMsg = await message.channel.send({ embeds: [embed] });

    // Set up page reactions.
/*  const lFilter = (reaction, user) => reaction.emoji.name === '◀' && user.id === message.author.id;
    const lCollector = listMsg.createReactionCollector({lFilter, max: 1 });

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
    const rCollector = listMsg.createReactionCollector({rFilter, max: 1 });

    rCollector.on('collect', async () => {
      lCollector.stop();
      await listMsg.reactions.removeAll();;
      if (page == entries.length) {
        list(listMsg, 1, increment);
      }
      else {
        list(listMsg, page + 1, increment);
      }
    });*/

/*  await listMsg.react('◀');
    await listMsg.react('▶');*/
  }

/*  const removeReaction = async (m, msg, emoji) => {
    try { m.reactions.find(r => r.emoji.name == emoji).users.remove(msg.author.id); }
    catch(err) {console.log("chucha: "+err)}
  }*/
    }
};