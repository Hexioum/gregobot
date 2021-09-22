const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('quick.db');
const client = new Discord.Client();
module.exports = {
	name: 'wish',
	aliases: ['w','wishea'],
	description: 'Agrega algo a tu lista de deseados',
	args: true,
	usage: '$wish <personaje>',
	execute(message, args) {
        var prefix = message.content.slice(prefix).trim().split(" ");
        prefix = prefix[0].length;
        if (message.content.length > prefix) {
            var member = message.author;
            var msg = capitalize(message.content);
            var args = msg.slice(prefix).trim().split(/ \$ | \$|\$ |\$/).filter(Boolean); //slices the prefix, trims spaces, splits the message with $, removes empty elements.
            var wishlist = db.get(`wishlists.${member.id}`);
            if ((typeof args!=='undefined')&&(args.length > 0)) {
                if (wishlist == null) {
                    console.log("Creando lista de deseados para "+member.username);
                    if (args.length < 16) {
                        var wishlist = db.set(`wishlists.${member.id}`, args);
                        try {
                            return message.react('✅');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    } else {
                        console.log(`Lista de deseados excede el máximo permitido.`);
                        message.channel.send(`15 deseos máximos para no premium. Sintaxis: para eliminar un deseo: **$wishremove** <personaje> (o **$wishremoveall**)\nPara varios nombres, sepárelos con un $`);
                        try {
                            return message.react('❌');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    };
                } else {
                    if (wishlist.length < 15) {
                        console.log(`Wishlist: ${wishlist}\n${member.username} Added: ${args}`);
                        var charAdded = db.push(`wishlists.${member.id}`, args);
                        try {
                            return message.react('✅');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    } else {
                        console.log(`Lista de deseados excede el máximo permitido.`);
                        message.channel.send(`15 deseos máximos para no premium. Sintaxis: para eliminar un deseo: **$wishremove** <personaje> (o **$wishremoveall**)\nPara varios nombres, sepárelos con un $`);
                        try {
                            return message.react('❌');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    };
                };
            } else {
                console.log(`Pocos argumentos?: ${args}`);
                try {
                return message.react('⁉');
                } catch (err) {
                    return console.log(`No puedo reaccionar: ${err}`);
                };
            };
        } else {
            return message.channel.send("⁉");
        };

        function capitalize(msg) {
            console.log(`Capitalizar: ${msg}`);
            var separateWord = msg.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().split(' ');
            for (var i = 0; i < separateWord.length; i++) {
                if ((separateWord[i].charAt(0) === "(")&&(separateWord[i].length > 6)) { //caps first char of something in parentheses
                    separateWord[i] = "(" + separateWord[i].charAt(1).toUpperCase() +
                    separateWord[i].substring(2);
                } else if ((separateWord[i].charAt(0) === "(")&&(separateWord[i].length > 2)) { //caps whole word inside parentheses
                    separateWord[i] = separateWord[i].toUpperCase()
                } else {
                    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1);
                };
            }
            return separateWord.join(' ');
        }
    }
}