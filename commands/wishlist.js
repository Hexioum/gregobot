const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('quick.db');
const client = new Discord.Client();
module.exports = {
	name: 'wishlist',
	aliases: ['wl','lista'],
	description: 'Revisa tu lista de deseados',
	args: true,
	usage: '$wishlist',
	execute(message, args) {
        const member = message.mentions.users.first() || message.author;
        //const member = message.author;
        var wishlist = db.get(`wishlists.${member.id}`);
        if (wishlist == null) {
            wishlist = [`(No hay resultados)`];
            var length = 0;
        } else {
            wishlist = wishlist.join().split(',').map(chars => capitalize(chars));
            var length = (wishlist.length);
        }
        console.log(`Mostrando lista de deseados de ${member.username}`);
        console.log(wishlist);
        var page = Math.floor(length%15);
        if (length > -1) {
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#095527')
                .setAuthor(`${member.username}'s wishlist (${length}/15)`,"https://cdn.discordapp.com/avatars/"+member.id+"/"+member.avatar+".jpeg")
                .setDescription(`${wishlist.join("\n")}`)
                .setFooter(`Page 1/1`);//${page}
                return message.channel.send(helpEmbed);
        }
        
        function capitalize(msg) {
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