const ytsearch = require("youtube-search-api");
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
            var args = message.content.toLowerCase().slice(prefix).trim();
            args = args.replace(/\.*$/gm, '');//Remueve los puntos al final del mensaje.
            if (args.startsWith("crossplay") || args.startsWith("gameplay") || args.startsWith("walkthrough") || args.startsWith("la foto") || args.startsWith("el meme")|| args.startsWith("el gif") || args.startsWith("esa wea") || args.startsWith("esta wea") || args.endsWith(" al menos") || args.endsWith(" aunque sea") || args.endsWith(" en la wea") || args.endsWith(" qwq") || args.endsWith(" u.u")) {
                return console.log("Saliendo sin buscar nada en YouTube.")
            }
            args = args.replace(/á'/gi, "a");
            args = args.replace(/é'/gi, "e");
            args = args.replace(/í'/gi, "i");
            args = args.replace(/ó/gi, "o");
            args = args.replace(/ú/gi, "u");
            args = args.replace(/ con /gi, " ");
            args = args.replace(/ asalto al /gi, " mission ");
            args = args.replace(/ cuando/gi, " when");
            args = args.replace(/ el weon/gi, "");
            args = args.replace(/ la weona/gi, "");
            args = args.replace(/ matan/gi, " dies");
            args = args.replace(/ se muere/gi, " dies");
            args = args.replace(/el tema de la /gi, "theme ");
            args = args.replace(/el tema del /gi, "theme ");
            args = args.replace(/el tema de /gi, "theme ");
            args = args.replace(/la musica del /gi, "music from ");
            args = args.replace(/musica del /gi, "music from ");
            args = args.replace(/mision /gi, "mission ");
            args = args.replace(/muerte /gi, "death ");
            args = args.replace(/matador de /gi, "killer ");
            args = args.replace(/mata guaguas/gi, "childish killer");
            args = args.replace(/guaguas/gi, "childish");
            args = args.replace(/guagua/gi, "child");
            args = args.replace(/pantalla de carga/gi, "loading screen");
            args = args.replace(/intro de /gi, "intro ");
            args = args.replace(/opening de /gi, "opening ");
            args = args.replace(/ending de /gi, "ending ");
            args = args.replace(/snuff/gi, "snusk");
            args = args.replace(/porno/gi, "music");

            if (args.length<3) {
                return console.log("Busqueda muy corta, no se intentará.")
            }
            let searchThese = ["music", "música", "ost", "soundtrack", "theme"];
            let found = false;
            for (let i = 0; i < searchThese.length; i++) {
                let word = searchThese[i];
                if (args.toLowerCase().includes(word)) {
                    found = true;
                    break;//stop checking if found
                }
            }
            if (!found) {
                args = args+" music"
            }
            console.log(`Buscando "${args}" para poner en YouTube.`)

            searchThis(args);
            async function searchThis(args) {
                let search = await ytsearch.GetListByKeyword(args,false,1,[{type:'video'}])
                var id = search.items[0].id;
                if (typeof id!= undefined) {
                    return message.reply("https://youtu.be/"+id)
                } else {
                    return console.log("No se encontró nada al buscar en YouTube.")
                };
            };
        }
    }
}