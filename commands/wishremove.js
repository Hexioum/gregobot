const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('quick.db');
const client = new Discord.Client();
module.exports = {
	name: 'wishremove',
	aliases: ['wr','remover'],
	description: 'Revisa tu lista de deseados',
	args: true,
	usage: '$wr <remover>',
	execute(message, args) {
        var prefix = message.content.slice(prefix).trim().split(" ");
        prefix = prefix[0].length;
        if (message.content.length > prefix) {
            var member = message.author;
            args = message.content.slice(prefix).trim().split(/ \$ | \$|\$ |\$/);
            var wishlist = db.get(`wishlists.${member.id}`);
            console.log(`Wishlist: ${wishlist}\nRemoviendo: ${args}`);
            if (wishlist == null) {
                var length = 0;
                wishlist = ["undefined"];
                console.log("Lista de deseos vacía.");
                try {
                    return message.react('❌');
                } catch (err) {
                    return console.log(`No puedo reaccionar: ${err}`);
                };
            } else {
                wishlist = wishlist.join();
                wishlist = wishlist.toLowerCase().split(',');
                //console.log(wishlist);
                var length = (wishlist.length);
                console.log(`Largo de array: `+length);
                var index = wishlist.indexOf(args[0].toLowerCase());
                if (index > -1) {
                    wishlist.splice(index, 1);
                    console.log(`Ahora es: ${wishlist}`);
                    if (length > 0) {
                        var charAdded = db.set(`wishlists.${member.id}`,wishlist);
                        try {
                            return message.react('✅');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    } else {
                        try {
                            return message.react('❌');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    }
                } else {
                    try {
                        console.log(`No cambió nada.`);
                        return message.react('❔');
                    } catch (err) {
                        return console.log(`No puedo reaccionar: ${err}`);
                    };
                };
            }
        } else {
            try {
                return message.react('❌');
            } catch (err) {
                return console.log(`No puedo reaccionar: ${err}`);
            };
        };
    }
}