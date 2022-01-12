const { MessageEmbed } = require('discord.js');


const DEBUG_MODE = false;

const customEmojiMap = {
	'20d20' : '618243626887282708',
	'19d20' : '618245455481929749',
	'18d20' : '618245470581555200',
	'17d20' : '618245481843392542',
	'16d20' : '618245495785127946',
	'15d20' : '618245512977711137',
	'14d20' : '618245526671851530',
	'13d20' : '618245542048432128',
	'12d20' : '618245559420977168',
	'11d20' : '618245559337353276',
	'10d20' : '618245559286759444',
	'9d20' : '618245559085563906',
	'8d20' : '618245559282827275',
	'7d20' : '618245559270113281',
	'6d20' : '618245559270244423',
	'5d20' : '618245559261593620',
	'4d20' : '618245559320313856',
	'3d20' : '618245559299604480',
	'2d20' : '618245559249272832',
	'1d20' : '618245559240884244'
 };


function getHelpText1()
{
    var helpText = "Usage: _*/roll XdY([+|-]#) (adv|advantage|dis|disadvantage) (label)*_";
    helpText += "\nX is the number of dice, and Y is the number of sides.";
    helpText += "\nOnly the first paramter, e.g. XdY, is required.";
    helpText += "\nDice roller will recognize a critical hit (natural 20) and miss (natural 1) when rolling a 1d20.";
    helpText += "\nYou can string together as many dice rolls as you want (see example below).";
    helpText += "\n\n_*Examples:*_";
    helpText += "\n`/roll 3d6+2`    (Rolls three six-sided dice and adds two to the result)";
    helpText += "\n`/roll 4d100-7 adv`    (Rolls four hundred-sided dice twice and takes the higher result, then substracts seven)";
    helpText += "\n`/roll 1d4 dis`    (Rolls a single four-sided die twice and takes the lower result.)";
    helpText += "\n`/roll 1d20+1 to hit with sword 2d8 slashing damage`    (Rolls a single d20, adds 1 to the result, and returns the outcome. Then roll two eight-side dice and return the result. The labels will be attached to each result.)";
    helpText += "\n\n";
    return helpText;		
}

function getHelpText2()
{    
    var helpText = "\n_*Mulitple Rolls*_";
    helpText += "\nYou may add (in any order) a parameter of the form `#x` (or `x#`), which will run # multiples of whatever the command is:";
    helpText += "\n`/roll 10x 1d20+1 to hit 1d6 damage`    (Rolls a 1d20+1 and a 1d6 couplet, 10 times in a row)";
    helpText += "\n`/roll x2 1d20-1 to hit 1d12+1 damage`    (Rolls a 1d20-1 and a 1d12+1 couplet, twice in a row)";
    helpText += "\n\n";
    return helpText;
}

function logger(message)
{
	console.log(message);
}

function getHelpText1()
{
	var helpText = "Usage: _*/roll XdY([+|-]#) (adv|advantage|dis|disadvantage) (label)*_";
	helpText += "\nX is the number of dice, and Y is the number of sides.";
	helpText += "\nOnly the first paramter, e.g. XdY, is required.";
	helpText += "\nDice roller will recognize a critical hit (natural 20) and miss (natural 1) when rolling a 1d20.";
	helpText += "\nYou can string together as many dice rolls as you want (see example below).";
	helpText += "\n\n_*Examples:*_";
	helpText += "\n`/roll 3d6+2`    (Rolls three six-sided dice and adds two to the result)";
	helpText += "\n`/roll 4d100-7 adv`    (Rolls four hundred-sided dice twice and takes the higher result, then substracts seven)";
	helpText += "\n`/roll 1d4 dis`    (Rolls a single four-sided die twice and takes the lower result.)";
	helpText += "\n`/roll 1d20+1 to hit with sword 2d8 slashing damage`    (Rolls a single d20, adds 1 to the result, and returns the outcome. Then roll two eight-side dice and return the result. The labels will be attached to each result.)";
	helpText += "\n\n";		
	return helpText;
}

function getHelpText2()
{
	var helpText = "\n_*Mulitple Rolls*_";
	helpText += "\nYou may add (in any order) a parameter of the form `#x` (or `x#`), which will run # multiples of whatever the command is:";
	helpText += "\n`/roll 10x 1d20+1 to hit 1d6 damage`    (Rolls a 1d20+1 and a 1d6 couplet, 10 times in a row)";
	helpText += "\n`/roll x2 1d20-1 to hit 1d12+1 damage`    (Rolls a 1d20-1 and a 1d12+1 couplet, twice in a row)";
    helpText += "\n\n";
	return helpText;
}

function getHelpText3()
{
	var helpText = "\n_*Macros*_";
	helpText += "\n Per user macros allow you to set a long command once, associate it with a short command phrase, and then reuse the command phrase whenever necessary.";
	helpText += "\n`/roll setmacro $[MACRO-NAME] [full dice command]` - Setup a new macro. `$` is required to identify the macro name at creation.";
	helpText += "\n`/roll getmacro $[MACRO-NAME]` - Return the dice command for a particular macro. `$` is optional.";
	helpText += "\n`/roll getmacro` - Return all currently set macros.";
	helpText += "\n`/roll $[MACRO-NAME]` - Run the named macro. `$` is optional.";
	helpText += "\n`/roll deletemacro $[MACRO-NAME]` - Delete the named macro.";
	helpText += "\n`/roll deleteallmymacros` - Delete all macros currently associated with your username.";
	helpText += "\nYou can set a dice macro with the `setmacro` command. Macro names must be prefixed with `$` at creation, and use alphanumeric characters (no spaces). Whatever follows the macro name will be the command set to that macro:";
	helpText += "\n`/roll setmacro $fists-of-fury 2x 1d20+5 to hit with fists of fury to hit 1d6 damage`";
	helpText += "\n`/roll fists-of-fury`";
	helpText += "\n\n";
	return helpText;
}

function randint(sides) {
	if(DEBUG_MODE && sides == 20)
	{
		return 1;
	}
	return Math.round(Math.random() * (sides - 1)) + 1;
}

function rolldice(sides, num) 
{
	var results = [];
	for (var j = 1; j <= num; j++) {
		results.push(randint(sides));
	}
	return results;
}

function getRollResults(sides, num) {
	var result = {
		rolls: rolldice(sides, num),
		rollsTotal: 0
	}
	for( var i = 0; i < result.rolls.length ; i++) {
		result.rollsTotal += result.rolls[i];
	}
	return result;
}

function diceBot(name,num,sides,bonusType,bonus,advantage,label) {
	var results = [];
	var isCrit = false;
	var isFail = false;
	var firstResults = getRollResults(sides,num);
	results.push(firstResults);
	var finalResults = firstResults;

	if(advantage.indexOf("dis") != -1) 
	{
		var secondResults = getRollResults(sides,num);
		results.push(secondResults);
		if(firstResults.rollsTotal > secondResults.rollsTotal) {
			finalResults = secondResults;
		} else {
			finalResults = firstResults;
		}
	} 
	else if(advantage.indexOf("adv") != -1) 
	{
		var secondResults = getRollResults(sides,num);
		results.push(secondResults);
		if(firstResults.rollsTotal > secondResults.rollsTotal) {
			finalResults = firstResults;
		} else {
			finalResults = secondResults;
		}
	}

	if(sides == 20 && num == 1) {
		if(finalResults.rollsTotal == 20) {
			isCrit = true;
		} else if(finalResults.rollsTotal == 1) {
			isFail = true;
		}
	}
	// add bonus
	var finalTotal = finalResults.rollsTotal;
	var bonusString = "N/A";
	if(bonusType && (bonusType == "+" || bonusType == "-")) {
		finalTotal = finalTotal + Number(bonusType+bonus);
		bonusString = bonusType+bonus;
	}
	
	//build result data structure
	
	var msgData = {
		"name" : name,
		"finalTotal" : finalTotal,
		"advantage" : false,
		"disadvantage" : false,
		"label" : null,
		"num" : num,
		"sides" : sides,
		"bonusString" : bonusString,
		"results" : results,
	  	"critical" : false,
		"fail": false
	};
	
	if(advantage) 
	{
		if(advantage.indexOf("dis") != -1) 
		{
			msgData.disadvantage = true;
		} 
		else if (advantage.indexOf("adv") != -1) 
		{
			msgData.advantage = true;
		}
	}

	if(label) {
		msgData.label = label;
	}

	if(isCrit) {
		msgData.critical = true;
	} else if(isFail) {
		msgData.fail = true;
	}
	
	return msgData;
}

function doRoll(realName,text) 
{
	//logger("doRoll: text is ["+text+"]");
	var match = text.match(/(\d+)(d)(\d+)(\+|-){0,1}(\d+){0,1}\s{0,1}(disadvantage|advantage|adv\b|dis\b){0,1}\s{0,1}([\s\S]+)?/i);
	//logger("doRoll: match is ["+match+"]");
	if(match != null)
	{
		//logger("doRoll: match was not null");
		var num = match[1] || 1;
		var sides = match[3] || 6;
		var bonusType = match[4] || "";
		var bonus = match[5] || 0;
		var advantage = match[6] || "";
		var label = match[7] || "";
		return diceBot(realName,num,sides,bonusType,bonus,advantage,label);
	}
	//logger("doRoll: match was null");
	return null;
}

function processDiceCommandString(realName, diceCommandString)
{
	var text = diceCommandString; //create a copy since we will be modifying this
	var match = text.match(/(\d+)(d)(\d+)/ig);

	if(!match) {
		//logger("failed match!");
		return '*No valid dice roll recognized in ['+diceCommandString+']!*\nUse _/roll help_ to get usage.';
	}

	//first, check to see if there's a multiplier anywhere in the string
	var multiplierMatch = text.match(/\s{0,1}(\d+)[x|X]\s/i);
	var multiplier = 1;
	if(multiplierMatch != null)
	{
		//logger("Found a multipler match: " +multiplierMatch);
		multiplier = Number(multiplierMatch[1]);
		var indexOfMultipler = text.indexOf(multiplierMatch[1]);
		//logger("Found a multipler match; text before: " +text);
		text = text.replace(/(\d+)[x|X]/,"");
		//logger("Found a multipler match; text after: " +text);
	}
	else
	{

        multiplierMatch = text.match(/\s{0,1}[x|X](\d+)\s/i);
		multiplier = 1;
		if(multiplierMatch != null)
		{
			//logger("Found a multipler match: " +multiplierMatch);
			multiplier = Number(multiplierMatch[1]);
			var indexOfMultipler = text.indexOf(multiplierMatch[1]);
			//logger("Found a multipler match; text before: " +text);
			text = text.replace(/(\d+)[x|X]/,"");
			//logger("Found a multipler match; text after: " +text);
		}
		else
		{
          	//logger("No multiplier request. Proceed as normal");
        }
	}

	args = [];
	var match = text.match(/(\d+)(d)(\d+)/ig);
	for (var i = match.length-1 ; i >= 0; i--) 
	{
		var idx = text.lastIndexOf(match[i]);
		arg = text.slice(idx);
		args.push(arg);
		text = text.slice(0,idx);
		//logger("arg: "+arg);
		//logger("remaining: "+text);
	}

	//logger("Building resultsArray");		
	var resultsArray = [];
	for(var k = 0; k < multiplier; k++)
	{
		for (var i = args.length-1; i >= 0; i--) 
		{
			//logger("Rolling: "+args[i]);
			var nextRollResult = doRoll(realName,args[i]);
			if(nextRollResult != null) 
			{
			  	resultsArray.push(nextRollResult);
			} 
			else 
			{
				var errorMsgData = {
					"results": '*No valid dice roll recognized in ['+diceCommandString+']!*\nUse _/roll help_ to get usage.',
	  				"critical" : false,
					"fail": false
				};
				resultsArray.push(errorMsgData);
				return resultsArray;
			}
		}
	}

	return resultsArray; 
}

function formatResultForDiscord(result,interaction,data)
{

	var titleText = result.name + " rolled *`" + result.finalTotal + "`*";

	if(result.disadvantage) {
		titleText += " with disadvantage";
	} else if (result.advantage) {
		titleText += " with advantage";
	}
	

	if(result.label) {
		titleText += " for _'"+result.label+"'_";
	}

	if(result.critical) {
		titleText += " _`CRITICAL!`_";
	} else if(result.fail) {
		titleText += " `FAIL!`";
	}
	
	var description = "";

	var formatResult = function(num, sides, bonusString, singleRollResult) {
		
		var spacerCharacter = " . . . ";
		
		var m = "_" + num + "d" + sides;
		

		if(bonusString != "N/A")
		{
			m += bonusString + "_ " + spacerCharacter;
		}
		else
		{
			m += "_ " + spacerCharacter;
		}
		

		if(singleRollResult.rolls.length > 1) 
		{
			m += "**Results**";
			for(var i = 0; i < singleRollResult.rolls.length; i++) 
			{
				if(sides == 20)
				{
					var emojiMapKey = singleRollResult.rolls[i] + 'd' + sides;
					var emojiIdString = customEmojiMap[emojiMapKey];
					var emoji = interaction.guild.emojis.cache.get(emojiIdString);
					m += ' ' + emoji.toString() + ' ';
					
				}
				else
				{
					m += " ` "+singleRollResult.rolls[i]+" ` ";
				}
			}
			if(bonusString != "N/A")
			{
				m += " "+spacerCharacter+" **Modifier**: _" + bonusString + "_ " + spacerCharacter;
			}
			else
			{
				m += " " + spacerCharacter;
			}
		} 
		else 
		{
			if(sides == 20)
			{
				var emojiMapKey = singleRollResult.rollsTotal + 'd' + sides;
				var emojiIdString = customEmojiMap[emojiMapKey];
				var emoji = interaction.guild.emojis.cache.get(emojiIdString);
				m += ' ' + emoji.toString() + ' ';
			}
			else
			{
				m += "**Result** ` " + singleRollResult.rollsTotal + " ` ";
			}
			
			if(bonusString != "N/A")
			{
				m += " "+spacerCharacter+" **Modifier**: _" + bonusString+"_ "+spacerCharacter;
			}
			else
			{
				m += " "+spacerCharacter;
			}
		}
		
		var total = singleRollResult.rollsTotal;
		if(bonusString != "N/A")
		{
			total += Number(bonusString);
		}
		
		m += "  **Total**: _*" + total + "*_ \n"

		return m;
	};

	for(var i = 0; i < result.results.length; i++) {
		description += formatResult(result.num,result.sides,result.bonusString,result.results[i]);
	}

	const finalEmbed = new MessageEmbed()
        .setColor(8311585)
        .setTitle(titleText)
        .setDescription(description);
	
	if(result.critical) {
	
		finalEmbed.setImage = {url: 'https://i.pinimg.com/originals/35/92/cd/3592cdd5f4b99b7a6c6ead64f6d9b6e4.gif'};
	}
	else if(result.fail) {
		finalEmbed.setImage = {url: 'https://i.gifer.com/origin/50/5031a9414e32b3b435d619bee5b6e65b_w200.gif'};
	}
    else{
        finalEmbed.setImage = { url: 'https://64.media.tumblr.com/1458225a6051e572f34b931011630d71/tumblr_ol1es3Lg4a1tevcm3o1_400.gifv'};
    }
	
	logger("formatResultForDiscord: content is ["+titleText+"]");
	logger("formatResultForDiscord: embed.description is ["+finalEmbed.description+"]");
	
	/*var formattedResult = {
		embeds : [finalEmbed]
	};
    */
	return finalEmbed;
}

//message reception code
function rollDice(name,data,interaction)
{

	var diceMatch = data.match(/(\d+)(d)(\d+)/ig);
	if(diceMatch != null)
	{

		var msgDataArray = processDiceCommandString(name,data);
        var formattedMessages = [];
		
        for(var i = 0; i < msgDataArray.length; i++)
		{    
			//logger(msgDataArray[i]);
			var formattedDiscordMessage = formatResultForDiscord(msgDataArray[i],interaction,data);
			formattedMessages.push(formattedDiscordMessage);	
		}
        
        var finalFormattedResult = {
            embeds : formattedMessages
        };
        
		return finalFormattedResult;
	}
	else
	{
		return "No valid dice roll or macro command. Use _/roll help_ to see command options.";
	}
}

module.exports = {rollDice,getHelpText1,getHelpText2};