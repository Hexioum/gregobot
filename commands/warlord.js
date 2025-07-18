module.exports = {
	name: 'warlord',
	aliases: ['wlord','wld'],
	description: 'Cambia el Warlord de la semana.',
	args: false,
	usage: 'No aplicable.',
	execute(message) {
        const RoleID = "758547604555956224";
        var role = message.guild.roles.cache.get(RoleID);
        var memberToRemove = role.members.first();
        if (memberToRemove==undefined) {
            console.log("No se encontraron miembros con el rol.")
        };
        memberToRemove.roles.remove(role).catch(console.error);
        var user = message.guild.members.cache.random().user;
        user.roles.add(role).catch(console.error);
        console.log(`Se le dio Warlord a ${user.username}.`);
    },
}