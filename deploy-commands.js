const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.BOT_TOKEN;

const commands = [];

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Comandos registrados.'))
	.catch(console.error);