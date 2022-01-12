const { SlashCommandBuilder } = require('@discordjs/builders');
const diceroller = require("../lib/diceroller");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls dice! Use /roll help for options')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('"help" or dice command strinkg. Example: /roll x3 1d20+7 to hit 5d8+2 adv bashing damage')
                .setRequired(true)),
	async execute(interaction) {
        
        var input = interaction.options.getString('input');
        var username = interaction.user.username;
        
        if(input === 'help')
        {
            const reply_msg1 = { content: diceroller.getHelpText1(), ephemeral: true };
            await interaction.reply(reply_msg1);
            const reply_msg2 = { content: diceroller.getHelpText2(), ephemeral: true };
            await interaction.followUp(reply_msg2);
        }
        else
        {
            var message = diceroller.rollDice(username,input,interaction);
            await interaction.reply(message);
            /*
            for(var i = 0; i < messages.length; i++)
            {
                console.log("messages["+i+"] = " + messages[i]);
                if(i == 0)
                {
                    await interaction.reply(messages[i]);
                }
                else{
                    await interaction.followUp(messages[i]);
                }
            }   
            */            
            
        }
    },
};