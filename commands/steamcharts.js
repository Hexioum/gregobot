const axios = require("axios");
const Discord = require('discord.js');

var steamEmbed = new Discord.MessageEmbed()
    .setColor('#231F20')
    .setTitle('Steamcharts')
    .setURL('https://vimeo.com/434895153')
    .setDescription('Resultado')
    .setFooter({text:'gregobot® 2021'});

module.exports = {
	name: 'steamcharts',
	aliases: ['charts','sc','steam'],
	description: 'Gregorio revisa steamcharts por tí.',
	args: true,
	usage: '<Nombre del juego> (opcional)',
	execute(message, args) {
        if (typeof args[0]==='undefined') {
            appId = '1372280'
            const options = {
                method: 'GET',
                url: `https://steamcharts.p.rapidapi.com/api/v1/games/${appId}`,
                headers: {
                  'X-RapidAPI-Key': 'a117d92c8amsh32a6b6b7f9d6aacp1f1c89jsn0bdc8ef96639',
                  'X-RapidAPI-Host': 'steamcharts.p.rapidapi.com'
                }
            };
            console.log('sup');
        } else {
            game = args
            const options = {
                method: 'GET',
                url: `https://steamcharts.p.rapidapi.com/api/v1/games/search/${game}`,
                headers: {
                    'X-RapidAPI-Key': 'a117d92c8amsh32a6b6b7f9d6aacp1f1c89jsn0bdc8ef96639',
                    'X-RapidAPI-Host': 'steamcharts.p.rapidapi.com'
                }
            };
              
            axios.request(options).then(function (response) {
                console.log(response.data[0]);
                steamEmbed.setImage(`https://cdn.cloudflare.steamstatic.com/steam/apps/${response.data[0].id}/header.jpg`)
                .setTitle(`${response.data[0].name}`)
                .setURL(`https://steamdb.info/app/${response.data[0].id}/`)
                .setAuthor({ name: 'Steamcharts', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/240px-Steam_icon_logo.svg.png', url: `https://steamcharts.com/app/${response.data[0].id}` })
                .setDescription(`Gente jugando ahora: **${response.data[0].currentPlayers}**`)
                .addFields(
                    { name: 'Promedio mensual', value: `${response.data[0].thirtyDayGainAverage}`, inline: true },
                    { name: 'Variación mensual', value: `${response.data[0].thirtyDayGain}`, inline: true },
                    { name: 'Variación en porcentaje', value: `${response.data[0].thirtyDayGainPercent}%`, inline: true },
                )
                return message.channel.send({ embeds: [steamEmbed] });
            }).catch(function (error) {
                console.error(error);
            });
        }
    }
}