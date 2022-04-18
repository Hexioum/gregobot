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
  if ((typeof args[0] === 'undefined')||(args[0] === 'random')||(args[0] === 'any')||(args[0] === 'al azar')||(args[0] === 'azar')||(args[0] === 'cualquiera')||(args[0] === 'al achunte')||(args[0] === 'a la chuña')||(args[0] === 'me siento con suerte')||(args[0] === 'feeling lucky')||(args[0] === `I'm feeling lucky`)||(args[0] === `i'm feeling lucky`)) {
    page = random;
  }
  else if ((args[0] === 'que no sepas')||(args[0] === 'tener amigas')||(args[0] === 'amigas')||(args[0] === 'caliente')||(args[0] === 'caliente de mierda')||(args[0] === 'cosa tuya')) {
    page = 2;
  }
  else if ((args[0] === 'cabrita chica')||(args[0] === 'cabrita')||(args[0] === 'chica')||(args[0] === 'hombres')||(args[0] === 'si somos hombres')||(args[0] === 'admitirlo')||(args[0] === 'hay que admitirlo')) {
    page = 3;
  }
  else if ((args[0] === 'lado furry')||(args[0] === 'furry')||(args[0] === 'gustan')||(args[0].toLowerCase() === 'jill')||(args[0] === 'me sigue gustan')||(args[0] === 'igual me pasaría')) {
    page = 4;
  }
  else if ((args[0] === 'dios')||(args[0] === 'planeta')||(args[0] === 'viviendo')||(args[0] === 'mierda')||(args[0].toLowerCase() === 'porque dios')||(args[0] === 'me pregunto')||(args[0] === 'planeta de mierda')) {
    page = 5;
  }
  else if ((args[0].toLowerCase() === 'lucho')||(args[0] === 'depre')||(args[0] === 'grausar')||(args[0] === 'krausar')||(args[0].toLowerCase() === 'mugen')||(args[0] === 'voice en off')||(args[0] === 'voz en off')) {
    page = 6;
  }
  else if ((args[0].toLowerCase() === 'esteban')||(args[0] === 'dakimakura')||(args[0] === 'semen y lagrimas')||(args[0] === 'lagrimas y semen')||(args[0] === 'lágrimas')||(args[0] === 'semen')||(args[0] === 'cesar')||(args[0].toLowerCase() === 'césar')) {
    page = 7;
  }
  else if ((args[0] === 'dominatrix')||(args[0] === 'mayor de edad')||(args[0] === 'mina de 13')||(args[0] === 'crimen')||(args[0] === 'guerra')||(args[0] === 'crimen de guerra')) {
    page = 8;
  }
  else if ((args[0] === 'si no fuera')||(args[0] === 'negra')||(args[0] === 'perfecta')) {
    page = 9;
  }
  else if ((args[0] === 'ira')||(args[0] === 'paranoia')||(args[0] === 'venganza')||(args[0] === 'mejores mentores')||(args[0] === 'mentores')) {
    page = 10;
  }
  else if ((args[0] === 'las minas')||(args[0] === 'fomes')||(args[0] === 'enpelotan')||(args[0] === 'empelotan')) {
    page = 11;
  }
  else if ((args[0] === 'lgtb')||(args[0] === 'picklez')||(args[0] === 'donando')||(args[0] === 'cura')) {
    page = 12;
  }
  else if ((args[0] === 'homosexualidad')||(args[0] === 'magia')||(args[0] === 'hechizo')||(args[0] === 'lahomosexualidad')) {
    page = 13;
  }
  else if ((args[0] === 'tranqui')||(args[0] === 'server')||(args[0] === 'tratamos')||(args[0] === 'objetos')) {
    page = 14;
  }
  else if ((args[0].toLowerCase() === 'me acuerdo')||(args[0].toLowerCase() === 'joteaba')||(args[0] === '6to')||(args[0] === '7mo')) {
    page = 15;
  }
  else if ((args[0] === 'undefined')||(isNaN(args[0]))||(args[0] > entries.length)||(args[0] < 1)) {
    page = 1;
  }
  else {
    page = args[0]
  }

  // Define our function.
  async function list(listMsg, page, increment) {
    console.log(`Mostrando la página ${page} de Frases Funa`);

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
      .setAuthor({name:'Frases Funa',iconURL:'https://i.imgur.com/ZmtGJgz.png'})
      .setThumbnail("https://i.imgur.com/OtQSmow.png")
      .setDescription(`*${stringField}*`)
      .setFooter({text:`- ${fraseField}`});

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

  // Send the list; page 1, and 1 shown on each page.
  list(undefined, page, 1)
    .catch(console.error);
    }
};