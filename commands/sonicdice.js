const fs = require('fs');
const sharp = require('sharp');
const wrapText = require('wrap-text');

module.exports = {
	name: 'sonicdice',
	aliases: ['sd','sonicdice','sonicsays'],
	description: 'Genera un mensaje inspiracional.',
	args: true,
	usage: 'Debe especificar mensaje.',
	execute(message, args) {
    let member = message.author;
    message.channel.sendTyping();
    const template = fs.readdirSync(`./memes/sonicsays`);
    const tempRand = Math.floor(Math.random()*(template.length-1));

    if ((typeof args!=='undefined')&&(args.length > 0)) {
      args = args.join(', ');
      evaluate(args);
    //args = args.charAt(0).toUpperCase() + args.substring(1);
    } else if (message.reference!==null) {
      fetchMsg(message.reference.messageId);
    } else {
      return message.reply("⁉");
    };

    async function fetchMsg(msg) {
      const reply = await message.channel.messages.fetch(msg);
      console.log(`[Sonic] Copiando texto: ${reply}`);
      if (reply.content.startsWith('grego sd,')||reply.content.startsWith('grego sonicdice,')||reply.content.startsWith('grego sonicsays,')) {
        args = reply.content.split(',')[1];
      } else {
        args = reply.content;
      }
      if (args.length > 0) {
        evaluate(args);
      } else {
        return message.reply("⁉");
      }
    };

    async function evaluate(args) {
      var mentions = args.match(/<.*>/g);
      try {
        if (mentions!==null) {
          for (var i = 0; i < mentions.length; i++) {
            if (mentions[i].startsWith('<@&')) {
              mentions[i] = mentions[i].slice(3, 21);
              mentions[i] = await message.guild.roles.fetch(mentions[i]);
              mentions[i] = "@"+mentions[i].name;
            } else if (mentions[i].startsWith('<:')) {
              mentions[i] = mentions[i].match(/:.*:/g).toString();
            } else {
              mentions[i] = mentions[i].slice(2, 20);
              mentions[i] = await message.guild.members.fetch(mentions[i]);
              mentions[i] = "@"+mentions[i].nickname;
            }
            args = args.replace(/<.*>/, mentions[i]);
          }
        };
      } catch (error) {
        console.log(error);
      };
      args = args.replace(/<.*>/g, '');
      var argWidth = 12+(Math.floor(args.length*0.07));
      if (argWidth > 38) {
        argWidth = 38;
      }
      if (args.length > 435) {
          message.reply('XD');
      } else {
          var arr = wrapText(args, argWidth);
          var topOffset = 0;
          arr = wrap(arr, topOffset, argWidth);
          drawImage(arr, topOffset);
      };
    }

    function wrap(arr, topOffset, argWidth) {
      // Escape certain characters. Prevents crashes.
      arr = arr.charAt(0).toUpperCase() + arr.slice(1);
      arr = arr.replace(/\*{2}/gi, ``);//Only two *s.
      arr = arr.replace(/"+/gi, `&quot;`);
      arr = arr.replace(/<+/gi, `&lt;`);
      arr = arr.replace(/>+/gi, `&gt;`);
      arr = arr.replace(/\n\s*\n/g, '\n');//Multiple new lines.
      arr = arr.split('\n');
      for (var i = 0; i < arr.length; i++) {
        // Wraps very long words.
        // Problem: arr.length will change if line is added, but it will stop iterating.
        if (arr[i].length-1 > argWidth) {
          let slice = arr[i].slice(arr[i].length-1-argWidth, arr[i].length);
          arr[i] = arr[i].slice(0, argWidth);
          if (typeof arr[i+1] === 'undefined') {
            arr.push(slice);
          } else {
            arr.splice(i+1, 0, slice);
          }
        }
      };
      var size = (14/Math.sqrt(args.length))+1;
      var font = "Arial";
      if (arr.length == 1) {
        var offset = 13;
      } else if (arr.length == 2) {
        var offset = -14;
      } else if (arr.length == 3) {
        var offset = -36;
      } else if (arr.length == 4) {
        var offset = -60;
      } else if (arr.length == 5) {
        var offset = -66;
      } else if (arr.length == 6) {
        var offset = -80;
      } else if (arr.length == 7) {
        var offset = -86;
      } else if (arr.length > 11) {
        var offset = (arr.length-1)*-11;
      } else {
        var offset = (arr.length-1)*-12;
      }
      for (var i = 0; i < arr.length; i++) {
        arr[i] = `
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.045em" dy="${topOffset+.295}em" fill="#003B79" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.04em" dy="${topOffset+.29}em" fill="#001B36" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.035em" dy="${topOffset+.285}em" fill="#001224" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.03em" dy="${topOffset+.28}em" fill="#000912" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.025em" dy="${topOffset+.275}em" fill="#000304" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.02em" dy="${topOffset+.27}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.015em" dy="${topOffset+.265}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dx="0.01em" dy="${topOffset+.26}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        <text x="81%" y="50%" transform="translate(0, ${offset})" text-anchor="middle" dy="${topOffset+.25}em" fill="#fff" font-family="${font}" font-size="${size}em">${arr[i]}</text>
        `
        if (i == 0) {
          topOffset = 0;
        }
        if (arr.length > 8) {
          topOffset = topOffset+(size*0.7);
        } else if (arr.length > 5) {
          topOffset = topOffset+(size*0.5);
        } else if (arr.length > 4) {
          topOffset = topOffset+(size*0.425);
        } else {
          topOffset = topOffset+(size*arr.length*0.125);
        };
      }
      return arr;
    }

    function drawImage(arr, topOffset) {
      console.log(`Generando imagen con texto: ${args}`);
      const weight = 622;
      const height = 334;

      const svg = `
      <svg width="${weight}" height="${height}" viewBox="0 0 ${height} ${height + 2}">
      <defs>
          <linearGradient id="rainbow" x1="0" x2="80%" y1="10%" y2="90%" gradientUnits="userSpaceOnUse" >
          <stop stop-color="#4FCB6B" offset="0%"/>
          <stop stop-color="#51F7FE" offset="20%"/>
          <stop stop-color="#FF5B99" offset="40%"/>
          <stop stop-color="#FF5447" offset="60%"/>
          <stop stop-color="#FF7B21" offset="80%"/>
          <stop stop-color="#EAFC37" offset="100%"/>
          </linearGradient>
      </defs>
        ${arr.join()}
      </svg>
      `;
      const svg_buffer = Buffer.from(svg);
      const image = sharp(`./memes/sonicsays/${template[tempRand]}`)
      .composite([{
          input: svg_buffer,
          top: topOffset,
          left: 0,
      }])
      .png()
      .toBuffer()
      .then(function(outputBuffer) {
          message.reply({ content:`**SONIC DICE**`, files:[outputBuffer] })
      }).catch(err => {
          message.channel.send(`estoy hecho mierda <@${member.id}>`)
          console.error(err)
      })
    }
  }
};