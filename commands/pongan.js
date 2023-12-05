const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	name: 'wishremove',
	aliases: ['wr','remover'],
	description: 'Revisa tu lista de deseados',
	args: true,
	usage: 'pongan <búsqueda>',
	execute(message, args) {
        var prefix = message.content.slice(prefix).trim().split(" ");
        
        prefix = prefix[0].length;
        if (message.content.length > prefix) {
            //var member = message.author;
            var args = message.content.toLowerCase().slice(prefix).trim();

            console.log(`Buscando "${args}"`)
        } 
    }
}