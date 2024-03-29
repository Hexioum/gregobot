const dotenv = require('dotenv');
dotenv.config();
const { QuickDB } = require('quick.db');
const db = new QuickDB();
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
            var args = message.content.toLowerCase().slice(prefix).trim().split(/ \$ | \$|\$ |\$/).filter(Boolean);
            
            (async () => {
                const wishlist = await db.get(`wishlists.${member.id}`);
                doCommand(wishlist, args)
                })();
                
                async function doCommand(wishlist, args) {
                    console.log(`Wishlist: ${wishlist}\nRemoviendo: ${args}`);
                    if (wishlist == null) {
                        wishlist = ["undefined"];
                        console.log("Lista de deseos vacía.");
                        try {
                            return message.react('❌');
                        } catch (err) {
                            return console.log(`No puedo reaccionar: ${err}`);
                        };
                    } else {
                        var backup = wishlist.join().toLowerCase().split(',');
                        var wishlist = backup.filter( ( excl ) => !args.includes( excl ) );
                        console.log(`Largo de array: `+wishlist.length);
                        if (backup.length >= args.length) {
                            console.log(`Antes: ${backup}\nAhora: ${wishlist}`);
                            //console.log(`Ahora es: ${wishlist}`);
                            if (backup.toString() === wishlist.toString()) {
                                try {
                                    return message.react('❔');
                                } catch (err) {
                                    return console.log(`No puedo reaccionar: ${err}`);
                                };
                            } else {
                                db.set(`wishlists.${member.id}`,wishlist);
                                try {
                                    return message.react('✅');
                                } catch (err) {
                                    return console.log(`No puedo reaccionar: ${err}`);
                                };
                            }
                        } else {
                            try {
                                console.log(`No cambió nada.`);
                                return message.react('❌');
                            } catch (err) {
                                return console.log(`No puedo reaccionar: ${err}`);
                            };
                        };
                    }
                } 
            } else {
                try {
                    return message.react('⁉');
                } catch (err) {
                    return console.log(`No puedo reaccionar: ${err}`);
                };
        } 
    }
}