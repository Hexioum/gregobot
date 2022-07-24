const fs = require("fs")
const readline = require('readline');
const stream = require('stream');
const sharp = require('sharp');

module.exports = {
	name: 'bingo',
	aliases: ['binguito','gb','genbingo','generar bingo'],
	description: 'Genera una tabla para jugar bingo.',
	args: true,
	usage: 'Puede especificar usuario.',
	execute(message, args) {
		let member = message.author;
    var instream = fs.createReadStream('commands/bingo.txt');
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);
    
    var arr = [];
    
    rl.on('line', function(line) {
      // process line here
      arr.push(line);
    });
    
    rl.on('close', function() {
      // do something on finish here
      shuffle(arr);
      console.log('Lista:', arr);

      if (arr.length < 25) {
        message.reply('Faltan casillas para generar tabla.')
      } else {
        wrap(arr)
        drawTable(arr)
      }
    });

    function shuffle(array) {
      let currentIndex = array.length,randomIndex;
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
    
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random()*currentIndex);
        currentIndex--;
    
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
      }
      return array;
    }

    function wrap(arr, width) {
      var tempArr = []
      for (var i = 0; i < 25; i++) {
        var xPos = (10+(i%5)*20)
        var yPos = (10+Math.floor(i/5)*20)
        var dxPos = (-4+(i%5)*2)
        var dyPos = (7+Math.floor(i/5))
        var tempStr = ""
        tempArr = arr[i].split(' ');
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
              tempStr = tempStr+`<tspan x="${xPos+dxPos*0.2}%" dy="1em">${tempArr[j]}</tspan>
              `
            }
            // Auto ajuste para lineas multiples.
            dyPos = dyPos-20+j*3;
          }
          arr[i] = tempStr;
        }
        arr[i] = `<text x="`+xPos+`%" y="`+yPos+`%" text-anchor="middle" dx="`+dxPos+`px" dy="`+dyPos+`px" `+`fill="#fff" font-family="Oswald" font-size="24px">
        ${arr[i]}
        </text>
        `
      }
    }

    function drawTable(arr) {
      console.log('Generando imagen.');
      const width = 592;//112
      const height = 592;
      const label = "Sample Text";
      //arr[12] = "FREE";

      const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${height} ${height + 2}">
        ${arr[0]}
        ${arr[1]}
        ${arr[2]}
        ${arr[3]}
        ${arr[4]}
      
        ${arr[5]}
        ${arr[6]}
        ${arr[7]}
        ${arr[8]}
        ${arr[9]}
      
        ${arr[10]}
        ${arr[11]}
   <!-- ${arr[12]} -->
        ${arr[13]}
        ${arr[14]}
      
        ${arr[15]}
        ${arr[16]}
        ${arr[17]}
        ${arr[18]}
        ${arr[19]}
      
        ${arr[20]}
        ${arr[21]}
        ${arr[22]}
        ${arr[23]}
        ${arr[24]}
      </svg>
      `;

      const svg_buffer = Buffer.from(svg);
      const image = sharp(`./memes/Bingo.png`)
      .composite([{
        input: svg_buffer,
        top: 24,
        left: 24,
      }])
      .png()
      .toBuffer()
      .then(function(outputBuffer) {
        message.reply({ content:`**BINGO BAILABLE** ~~DE~~**GENERADO**`, files:[outputBuffer] })
      }).catch(err => {
        message.channel.send(`estoy hecho mierda <@${member.id}>`)
        console.error(err)
      })
    }
  }
}