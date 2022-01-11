const { Client, Intents } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);
    
const TOKEN = config.botToken

// When the app is ready it will write out Ready using this
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content === '!Hello') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('hello to you too.');
	}
});

// Replace the value between the quotes with your token
client.login(TOKEN);