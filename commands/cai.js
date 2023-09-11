const dotenv = require('dotenv');
dotenv.config();
const caiToken = process.env.CAI_TOKEN;
const CharacterAI = require('node_characterai');
const characterAI = new CharacterAI();

module.exports = {
	name: 'cai',
	aliases: ['cuentame','dime'],
	description: 'Gregorio te conversa',
	execute(message) {
        console.log("Ejecutando CAI.");
        (async() => {
            //await characterAI.authenticateAsGuest();
            await characterAI.authenticateWithToken(caiToken);
        
            const characterId = "zuvyyrCxbht0w_M74MnyIuLk0gNgyyk-33brE1lfpzg";
            const chat = await characterAI.createOrContinueChat(characterId);
            const response = await chat.sendAndAwaitResponse(message, true);
        
            console.log(response);
            // use response.text to use it in a string.
        })();
    }
}