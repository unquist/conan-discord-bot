const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        reply_msg = { content: 'Pong!', ephemeral: true };
		await interaction.reply(reply_msg);
        reply_msg = { content: 'Pong again!', ephemeral: true };
        await interaction.followUp(reply_msg);
	},
};