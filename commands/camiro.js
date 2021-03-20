let replies = ["un minuto de silencio", "un minuto de silencio porfavor", "QUE GRANDE ESTE WEON", "grande el pibe"];

module.exports = {
	name: 'camiro',
	aliases: ['felipito'],
	description: 'Gregorio fuerza un minuto de silencio.',
	execute(message) {
    const { channel } = message
    let random = Math.floor(Math.random() * 4);
		message.channel.send(replies[random]);
        if (message.member.hasPermission('ATTACH_FILES')) {
            try {
                channel.setRateLimitPerUser(60);
                setTimeout(function(){
                    try {
                        channel.setRateLimitPerUser(0);
                        return console.log("Ha pasado un minuto.")
                    } catch(err) {
                        return console.log("No puedo: "+err);
                    };
                }, 60000);
            } catch(err) {
                return console.log("No puedo: "+err);
            };
        } else 
        return console.log('Comando de Slowmode ejecutado por alguien sin permisos.');
	},
};
