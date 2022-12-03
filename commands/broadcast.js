const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'broadcast',
	aliases: ['bc','di'],
	description: 'Gregorio tiene un anuncio importante que hacer.',
	args: true,
	usage: 'grego #canal mensaje',
	execute(message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.channel.send("no");
        if (typeof args!=='undefined') {
            let pollChannel = message.mentions.channels.first();
            args = args.join(', ').replace(/<.*>/, '');
			let random = Math.floor(Math.random()*10);
            var typeTime = (args.length+random)*60;
            //console.log(args);
            try {
                pollChannel.sendTyping();
                setTimeout(function(){
                    pollChannel.send(args);
                }, typeTime);
            } catch (error) {
                message.reply("y el canal?");
            };
        } else {
            message.reply("faltan argumentos");
        }
    }
}