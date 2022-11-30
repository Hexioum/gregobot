const sharp = require('sharp');

module.exports = {
	name: 'sonicdice',
	aliases: ['sd','sonicsays','sonic dice','sonic says'],
	description: 'Genera un mensaje inspiracional.',
	args: true,
	usage: 'Puede especificar usuario.',
	execute(message, args) {
        let member = message.author;
        if ((typeof args!=='undefined')&&(args.length > 0)) {
            args.join(', ');

            if (args.length > 255) {
                message.reply('XD');
            } else {
                //wrap(args[0])
                drawImage(args[0]);
            }
			//args = args.charAt(0).toUpperCase() + args.substring(1);
		    } else {
            return message.reply("⁉");
        };

        function wrap(arr, width) {
            console.log(arr);
            var tempArr = []
            for (var i = 0; i < 25; i++) {
              var xPos = 418
              var yPos = 172
              var dxPos = (-4+(i%5)*2)
              var dyPos = (7+Math.floor(i/5))
              var tempStr = ""
              tempArr = arr.split(' ');
              if (arr[i].length > 12 && tempArr.length > 1) {
                for (var j = 0; j < tempArr.length; j++) {
                  if (tempArr[j].length > 0 && typeof tempArr[j+1]!= 'undefined') {
                    var check = tempArr[j]+` `+tempArr[j+1];
                    // Cuantos caracteres dejar de ancho.
                    if (check.length < 10) {
                      var grab = tempArr[j];
                      tempArr.splice(j, 1);
                      tempArr[j] = grab+` `+tempArr[j];
                    }
                  }
                  if (tempArr[j].length > 1) {
                    tempStr = tempStr+`<tspan x="${1+xPos+dxPos*0.22}%" dy="1em">${tempArr[j]}</tspan>
                    `
                  }
                  // Auto ajuste para lineas multiples.
                  dyPos = dyPos-20+j*3;
                }
                arr[i] = tempStr;
              }
              arr[i] = `<text x="`+xPos+`%" y="`+yPos+`%" text-anchor="middle" dx="`+dxPos+`px" dy="`+dyPos+`px" `+`fill="#fff" font-family="Ubuntu Condensed" font-size="20px">
              ${arr[i]}
              </text>
              `
            }
          }

        function drawImage(args) {
            console.log(`Generando imagen con texto: ${args}`);
            var size = (14/Math.sqrt(args.length))+1;
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
            <text x="81%" y="51%" text-anchor="middle" dx="0.03em" dy="0.28em" fill="#000" font-size="${size}em">${args}</text>
            <text x="81%" y="51%" text-anchor="middle" dx="0.025em" dy="0.275em" fill="#000" font-size="${size}em">${args}</text>
            <text x="81%" y="51%" text-anchor="middle" dx="0.02em" dy="0.27em" fill="#000" font-size="${size}em">${args}</text>
            <text x="81%" y="51%" text-anchor="middle" dx="0.015em" dy="0.265em" fill="#000" font-size="${size}em">${args}</text>
            <text x="81%" y="51%" text-anchor="middle" dx="0.01em" dy="0.26em" fill="#000" font-size="${size}em">${args}</text>
            <text x="81%" y="51%" text-anchor="middle" dy="0.25em" fill="url(#rainbow)" font-size="${size}em">${args}</text>
            </svg>
            `;
            const svg_buffer = Buffer.from(svg);
            const image = sharp(`./memes/SonicSays.png`)
            .composite([{
                input: svg_buffer,
                top: 0,
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