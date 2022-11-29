const axios = require("axios");
const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_KEY);

const steamEmbed = new EmbedBuilder()
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
        async function steamappFetch (appId) {
            const options = {
                method: 'GET',
                url: `https://steamcharts.p.rapidapi.com/api/v1/games/${appId}`,
                headers: {
                  'X-RapidAPI-Key': 'a117d92c8amsh32a6b6b7f9d6aacp1f1c89jsn0bdc8ef96639',
                  'X-RapidAPI-Host': 'steamcharts.p.rapidapi.com'
                }
            };
            axios.request(options).then(function (response) {
                //console.log(response.data.name+' '+response.data.stats[0].averagePlayers);
                games.push(response.data);
                steamEmbed.addFields(
                    { name: `${response.data.name}`, value: `${response.data.twentyFourHourPeek} / ${response.data.stats[0].averagePlayers} / ${response.data.stats[0].gainInPercent}%`, inline: true }
                )
                itemsProcessed++;
                if(itemsProcessed === 3) {
                    //var sortedGames = games.sort(function(a, b) { return a - b; });
                    steamEmbed.setTitle(`Los juegos de pelea...`)
                    .setURL(`https://fgcharts.com`)
                    .setAuthor({ name: 'FG Charts', iconURL: 'https://i.imgur.com/ZmtGJgz.png', url: `https://fgcharts.com` })
                    .setDescription(`Juego: Peak Diario/Promedio Mensual/Variación en %`)
                    .setFooter({ text: 'Steamcharts', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/64px-Steam_icon_logo.svg.png' });
                    return message.reply({ embeds: [steamEmbed] });
                }
            }).catch(function (error) {
                console.error(error);
            });
        }
        if (typeof args[0]==='undefined') {
            const appIds = [
                '310950',   // SFVC
                '389730',   // TKN7
                '520440',   // XRD2
                '586140',   // BBCF
                '678950',   // DBFZ
                '702890',   // BTAG
                '801630',   // UNIB
                '1372280',  // MBTL
                '1384160'   // GGST
            ]
            var games = []
            var itemsProcessed = 0;
            appIds.forEach(function (appId, index) {
                try {
                    steamappFetch(appId);
                    steam.getGamePlayers(appId).then(result => {
                        games.push(result)
                        itemsProcessed++;
                        if(itemsProcessed === appIds.length) {
                            console.log(games);
                        }
                    })
                    //steam.getGameDetails(appId, false).then(result => {console.log(result)})
                } catch(err) {
                    return console.log(`Fetch failed: ${err}`);
                }
            })
        } else {
            if (args[0] == 'samsho') {
                args[0] = 'samurai shodown'
            } else if (args[0] == 'ki' || args[0] == 'killer') {
                args[0] = 'killer instinct'
            } else if (args[0] == 'uniclr' || args[0] == 'unist') {
                args[0] = 'under night in-birth'
            }
            const options = {
                method: 'GET',
                url: `https://steamcharts.p.rapidapi.com/api/v1/games/search/${args}`,
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
                .setAuthor({ name: 'Steam Search', iconURL: 'https://i.imgur.com/ZmtGJgz.png', url: `https://steamcharts.com/app/${response.data[0].id}` })
                .setDescription(`Gente jugando ahora: **${response.data[0].currentPlayers}**`)
                .setFields(
                    { name: 'Promedio mensual', value: `${response.data[0].thirtyDayGainAverage}`, inline: true },
                    { name: 'Variación mensual', value: `${response.data[0].thirtyDayGain}`, inline: true },
                    { name: 'Variación en porcentaje', value: `${response.data[0].thirtyDayGainPercent}%`, inline: true },
                )
                .setFooter({ text: 'Steamcharts', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/64px-Steam_icon_logo.svg.png' });
                return message.reply({ embeds: [steamEmbed] });
            }).catch(function (error) {
                console.error(error);
                return message.reply({content: `no`});
            });
        }
    }
}