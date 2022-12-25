const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`setavt`)
        .setDescription(`Quien sabe que hace esto...`)
        .addStringOption(option => option.setName('avatar').setRequired(true).setDescription(`Avatar URL`)),
    async execute(interaction) {
        const value = interaction.options.getString('avatar');
        if(interaction.user.id == `360892991499665408`) {
            if(value.includes("https://") || value.includes("http://")) {
                if(value.includes(".png") || value.includes(".jpg")) {
                    try {
                        interaction.client.user.setAvatar(value)
                        return interaction.reply(`Avatar cambiado.`);
                    } catch {
                        return interaction.reply(`¿Quota superada? Intente más tarde.`);
                    }
                } else {
                    return interaction.reply(`Formato inválido.`);
                }
            } else {
                return interaction.reply(`Ingresar una URL valida.`);
            }
        } else {
            return interaction.reply(`No tienes los permisos necesarios.`);
        }
    },
};