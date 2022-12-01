const sharp = require('sharp');
const wrapText = require('wrap-text');

module.exports = {
	name: 'sonicdice',
	aliases: ['sd','sonicdice','sonicsays','ss'],
	description: 'Genera un mensaje inspiracional.',
	args: true,
	usage: 'Debe especificar mensaje.',
	execute(message, args) {
        let member = message.author;
        if ((typeof args!=='undefined')&&(args.length > 0)) {
            args = args.join(', ');

            if (args.length > 255) {
                message.reply('XD');
            } else {
                //wrap(args[0])
                var arr = wrapText(args, 24);
                var topOffset = 0;
                arr = wrap(arr, topOffset);
                drawImage(arr, topOffset);
            }
			//args = args.charAt(0).toUpperCase() + args.substring(1);
		    } else {
            return message.reply("⁉");
        };

        function wrap(arr, topOffset) {
            arr = arr.split('\n');
            var size = (14/Math.sqrt(args.length))+1;
            var font = "Arial";
            var offset = (arr.length-1)*3;
            for (var i = 0; i < arr.length; i++) {
              // Fixes the first line offset
              arr[i] = `
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.04em" dy="${topOffset+.29}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.035em" dy="${topOffset+.285}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.03em" dy="${topOffset+.28}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.025em" dy="${topOffset+.275}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.02em" dy="${topOffset+.27}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.015em" dy="${topOffset+.265}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.01em" dy="${topOffset+.26}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dx="0.005em" dy="${topOffset+.255}em" fill="#000" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              <text x="81%" y="${50-offset}%" text-anchor="middle" dy="${topOffset+.25}em" fill="#fff" font-family="${font}" font-size="${size}em">${arr[i]}</text>
              `
              if (i == 0) {
                topOffset = 0;
              }
              topOffset = topOffset+(size*0.5);
            }
            return arr;
          }

        function drawImage(arr, topOffset) {
          console.log(`Generando imagen con texto: ${args}`);
          // y=ab^x
          const width = 622;
          const height = 334;

          const svg = `
          <svg width="${width}" height="${height}" viewBox="0 0 ${height} ${height + 2}">
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
          const image = sharp(`./memes/SonicSays.png`)
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