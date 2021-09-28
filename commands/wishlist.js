const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('quick.db');
const client = new Discord.Client({ intents: ['GUILDS','GUILD_MEMBERS','GUILD_MESSAGES','GUILD_MESSAGE_REACTIONS'] });
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
        if ((wishlist == null)||(wishlist.toString() === '')) {
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
            const wishEmbed = new Discord.MessageEmbed()
                .setColor('#095527')
                .setAuthor(`${member.username}'s wishlist (${length}/15)`,"https://cdn.discordapp.com/avatars/"+member.id+"/"+member.avatar+".jpeg")
                .setDescription(`${wishlist.join("\n")}`)
                .setFooter(`Page 1/1`);//${page}
                return message.channel.send({ embeds: [wishEmbed] });
        } else {
            return console.log("Se intentó usar el comando wishlist.");
        }
        
        function capitalize(msg) {
            var separateWord = msg.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().split(' ');
            for (var i = 0; i < separateWord.length; i++) {
                if ((separateWord[i].charAt(0) === "(")&&(separateWord[i].length > 2)) {
                    if ((separateWord[i].charAt(2)===')')||(separateWord[i].charAt(3)===')')||(separateWord[i].charAt(4)===')')||(separateWord[i].charAt(5)===')')) {
                        separateWord[i] = separateWord[i].toUpperCase();//caps whole word inside parentheses
                    } else {
                        separateWord[i] = "(" + separateWord[i].charAt(1).toUpperCase() +
                        separateWord[i].substring(2);//caps first char of something in parentheses
                    }
                } else {
                    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1);
                };
            }
            return separateWord.join(' ');
        }
    }
}