const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const dbEngine = process.env.DATABASE_ENV || "development";
//const db = require('../models/index.js');

module.exports = {
	name: 'wishlist',
	aliases: ['wl','lista','wlt'],
	description: 'Revisa tu lista de deseados',
	args: true,
	usage: '$wishlist',
	execute(message, args) {
        const member = message.mentions.users.first() || message.author;
        
        //const member = message.author;
    /*    db.User.findAll().then(users => {
            users.map(user_id => {
                return console.log(
                    user_id.get({plain: true})
                );
            });
        }); */
        //return;
        (async () => {
            const wishlist = await db.get(`wishlists.${member.id}`)
            check(wishlist)
            })();

        async function check(wishlist, length) {
            if ((wishlist == null)||(wishlist.toString() === '')) {
                wishlist = [`(No hay resultados)`];
                var length = 0;
            } else {
                try {
                    wishlist = wishlist.join().split(',').map(chars => capitalize(chars));
                    var length = (wishlist.length);
                } catch(err) {
                    console.log(`WISHLIST: ${wishlist}`)
                    message.react('❌');
                    return message.reply('aah rar')
                }
            }
            console.log(`Mostrando lista de deseados de ${member.username}`);
            console.log(wishlist);
            var page = Math.floor(length%15);
            if (length > -1) {
                const wishEmbed = new EmbedBuilder()
                    .setColor('#095527')
                    .setAuthor({name:`${member.username}'s wishlist (${length}/15)`,iconURL:"https://cdn.discordapp.com/avatars/"+member.id+"/"+member.avatar+".jpeg"})
                    .setDescription(`${wishlist.join("\n")}`)
                    .setFooter({text:`Page 1/1`});//${page}
                    return message.channel.send({ embeds: [wishEmbed] });
            } else {
                return console.log("Se intentó usar el comando wishlist.");
            }
        }
        
        function capitalize(msg) {
            var separateWord = msg.replace(/(\r\n|\n|\r)/gm, "").toLowerCase().split(' ');
            for (var i = 0; i < separateWord.length; i++) {
                if ((separateWord[i].charAt(0) === '(')&&(separateWord[i].length > 2)) {
                    if ((separateWord[i].charAt(2)===')')||(separateWord[i].charAt(3)===')')||(separateWord[i].charAt(4)===')')||(separateWord[i].charAt(5)===')')) {
                        separateWord[i] = separateWord[i].toUpperCase();//caps whole word inside parentheses
                    } else {
                        separateWord[i] = '(' + separateWord[i].charAt(1).toUpperCase() +
                        separateWord[i].substring(2);//caps first char of something in parentheses
                    }
                } else if (!Number.isNaN(parseInt(separateWord[i].charAt(0)))&&(separateWord[i].length > 1)) {
                    separateWord[i] = separateWord[i].charAt(0) + separateWord[i].charAt(1).toUpperCase() +
                    separateWord[i].substring(2);
                } else {
                    separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
                    separateWord[i].substring(1);
                };
            }
            return separateWord.join(' ');
        }
    }
}