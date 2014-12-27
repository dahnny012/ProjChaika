/*

Data incoming in the form:
 ["[["test","v,n"],["spell","n,"]]"]
 Array of tokens
	[    ] Queue layer
		[    ] Spell layer
			[     ] Token layer
				Word, Pos
*/
var WORD = 0;
var POS = 1;
function SpellEngine()
{
	return this;
}
SpellEngine.prototype.evaluate = function (queue,player){

	if(queue.length > 0)
	{
		console.log("Queue:");
		dumpQ(queue);
	}
	var spellLayer = queue[0];
	console.log("Spell layer");
	console.log(spellLayer);
	/// Protect the loop
	if(queue.length == 1)
	{
		queue.pop();
	}
	else
	{
		queue.splice(0,1);
	}
	
	if (spellLayer != undefined)
	{
		var spell =  this.buildSpell(spellLayer,player);
		if(spell == undefined)
		{
			return undefined
		}
		if(spell.type == 'Weapon')
		{
			player.history.push(spell);
			player.updateWeaponQueue();
			console.log("Made weapon");
		}
		else if(spell.type == 'Cast')
		{
			console.log("Spellcasting");
			console.log(player);
			var weapon = player.search(spell.base);
			if(weapon == undefined)
			{
				spell.power = base;
			}
			else
			{
				spell.power += weapon.power;
			}
			return spell.power;
		}
		else
		{
			console.log("Failed to make a token");
		}
	}
	return 0;
};



 /*
 [[["test","v,n"],["spell","n,"]]]
 Array of tokens
	[ X ] Queue layer
		[  O  ] Spell layer
*/

var debug;
SpellEngine.prototype.buildSpell = function(spell,player){
	var token = undefined;
	
	// while spell has tokens
	var length = spell.length;
	for(var i=0; i<length; i++)
	{
		if (token == undefined)
		{
			try{
			debug = spell;
			console.log("Splice");
			var splice = spell.splice(0,1).pop();
			var nextTok;
			console.log(splice);
			console.log("spell length " +  spell.length);
			if(spell.length != 0)
			{
				nextTok = spell.splice(0,1).pop();
			}
			token = new SpellToken(splice,nextTok); // Token layer
			}
			catch(err){
				console.log(err);
				console.log("spell is null");
				console.log(nextTok);
				return;
			}
		}
				console.log(spell.length);
		var msg = token.parse();
		switch(msg)
		{
			case 'build':
				return this.build(token,nextTok);
			case 'enforce':
				this.enforce(token,nextTok);
				token.next = spell.splice(0,1).pop();
				nextTok = token.next;
				if(token.next === 0)
				{
					console.log("Unable to finish enforce");
					return;
				}
				break;
			case 'reset':
				console.log("Couldnt find any valid tokens");
				token = undefined;
				break;
		}
	}
	
	if(token == undefined)
	{
		
		return new SpellToken(null,null);
	}
		
	
};




SpellEngine.prototype.build = function(token,finisher){
	token.power += token.word.length; // head of stack
	console.log("Build Step");
	switch(token.type)
	{
		case 'Weapon':
			var length = token.seq.length;
			for(var i=0; i<length; i++)
			{
			  var base = 1;
			  var combo = base + (i+1)/10;
			  token.full += " " + token.seq[i][WORD];
			  token.power += (combo * token.seq[i].length);
			}
			if(finisher != undefined){
				token.full += " " + finisher[WORD];
				token.power *= finisher[WORD].length; //later ^ 1.5
				token.base = finisher;
			}
			return token;
		case 'Cast':
			return token;
		default:
			dump(token);
	
	}
};

SpellEngine.prototype.enforce = function(token,enforce)
{
	token.seq.push(enforce);
};




function SpellToken(block,spell)
{
	if(block == undefined || block == null)
	{
		this.type = '';
		console.log("Null block");
		return this;
	}
	console.log("making block");
	console.log(block);
	this.word = block[WORD];
	this.pos = block[POS].split(",");
	this.next = spell;
	this.type = '';
	this.seq = [];
	this.power = 0;
	this.base = '';
	this.full = this.word;
	return this;
}

function buffToken(block)
{
	if(block == undefined | block == null)
	{
		return "";
	}
	this.word = block[WORD];
	this.pos = block[POS].split(",");
	return this;
}



/*
TODO: Add all matches so player can choose what wants.

*/
SpellToken.prototype.parse = function()
{

		var buff = buffToken(this.next);
		var length = this.pos.length;
		if(buff !=  "")
		{
			var jLength = buff.pos.length ;
			for (var i=0;i<length;i++)
			{
					for(var j=0; j<jLength; j++)
					{
						var message = this.match(this.pos[i],buff.pos[j]);
						if(message != 'reset')
						{
							return message;
						}
						else if(message == 'Cast')
						{
							this.base = buff.word;
						}
					}
			}
		}
	
		// Singular case.
		else
		{
			for(var k=0; k<length; k++)
			{
				var message = this.match(this.pos[k],undefined);	
				if(message != 'reset')
				{
					return message;
				}
			}
			
		}
};


/// TODO pass tokens
SpellToken.prototype.match = function (current,next)
{
	var message = 'reset';
	if(current== 'v')
	{
		if (next == 'n'){
			message = 'build';
			this.type = 'Cast';
			return message;
		}
	}
	else if (current == 'adj')
	{
			if(next == 'adj')
			{
				message = 'enforce';
				return message;
			}
			
			else if (next == 'n')
			{
				message = 'build';
				this.type = 'Weapon';
				this.base = this.next[WORD];
				return message;
			}
	}
	
	// Singlulars
	else if(next == undefined)
	{
		if (current == 'n')
		{
			message = 'build';
			this.type= 'Weapon';
			this.base = this.word;
		}
		if(current == 'v')
		{
			message = 'cast';
			this.base(this.word);
		}
	}
	
	return message;
};

function dump(token)
{
	console.log("Something wrong occurred");
	console.log(token.word);
	console.log(token.pos);
	console.log(token.next);
	console.log(token.type);
}

function dumpQ(queue)
{
	console.log(JSON.stringify(queue));

}




