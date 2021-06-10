module.exports = {
	name: 'reclamar',
	aliases: ['$tu'],
	description: 'Gregorio te da información sobre tus rolls.',
	execute(message) {
        const { channel } = message
        let random = Math.floor(Math.random() * 4);
        let capital = Math.floor(Math.random() * 100000);
        const date = new Date(); // for reference, PST is UTC-8
        var minutos = date.getMinutes();
        /*
        var horas = date.getHours();
        var countDownDate = new Date(`Jul 25, 2021 16:04:00`).getTime();
        var now = new Date().getTime();
        var timeleft = countDownDate - now;
            
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)+3600000);
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

        ¡Puedes reaccionar a kakera en este momento!
        Poder: 110%
        Cada reacción de kakera consume 36% de su poder de reacción.
        Tus personajes con 10+ llaves, consumen la mitad del poder (18%)
        Capital: 50972:kakera:

        ¡$rt está disponible!
        Siguiente reinicio de $dk en 8h 48 min.
        Puedes votar nuevamente en 7h 09 min.
        => $tuarrange */

        if (message.member.hasPermission('ATTACH_FILES')) {
            try {
                message.channel.send(`**${message.author.username}**, __puedes__ reclamar ahora mismo. El siguiente reclamo será en **${1+random}** min.\nTienes **0** rolls restantes.\nEl siguiente reinicio será en **${1+random}** min.\nSiguiente reinicio de $daily en **20h ${59-minutos}** min.\n\n¡Puedes reaccionar a kakera en este momento!\nPoder: **110%**\nCada reacción de kakera consume 96% de su poder de reacción.\nTus personajes con 10+ llaves, consumen la mitad del poder (48%)\nCapital: **${capital}**💎\n\n¡$rt está disponible!\nSiguiente reinicio de $dk en **8h ${59-minutos}** min.\nPuedes votar nuevamente en **5h ${59-minutos}** min.\n**=>** $tuarrange`);
                return console.log("Alguien comprobó sus kakas.");
            } catch(err) {
                return console.log("No puedo: "+err);
            };
        } else {
            return console.log('Comando de Mudae ejecutado por alguien sin permisos.');
        };
	},
};
