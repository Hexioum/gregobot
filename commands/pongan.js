const dotenv = require('dotenv');
dotenv.config();
module.exports = {
	name: 'play',
	aliases: ['pon','pone','pongan'],
	description: 'Revisa tu lista de deseados',
	args: true,
	usage: 'pongan <búsqueda>',
	execute(message) {
        var prefix = message.content.slice(prefix).trim().split(" ");
        
        prefix = prefix[0].length;
        if (message.content.length > prefix) {
            //var member = message.author;
            var args = message.content.toLowerCase().slice(prefix).trim();
            args = args.replace(/el tema de/gi, "theme");
            args = args.replace(/cuando/gi, "when");
            args = args.replace(/ el weon/gi, "");
            args = args.replace(/ la weona/gi, "");
            args = args.replace(/ matan/gi, "dies");
            args = args.replace(/se muere/gi, "dies");

            console.log(`Buscando "${args}"`)
        }
    }
}