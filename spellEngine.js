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
		var spell =  this.buildSpell(spellLayer,player,spellLayer.spec);
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
				spell.power = spell.base.length;
			}
			else
			{
				var base = 1;
				var combo = base + spell.power/10;
				
				spell.power = combo *  weapon.power;
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
SpellEngine.prototype.buildSpell = function(spell,player,spec){
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
			token = new SpellToken(splice,nextTok,spec); // Token layer
			switch(spec)
			{
				case 'Weapon':
				case 'Cast':
					this.addSpecQueue(token,spell);
					break;
				default:
			}
				
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

SpellEngine.prototype.addSpecQueue = function(token,spellLayer)
{
	token.specQueue = spellLayer;
}

SpellEngine.prototype.enforce = function(token,enforce)
{
	token.seq.push(enforce);
};




function SpellToken(block,spell,spec)
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
	this.spec = spec;
	this.seq = [];
	this.power = 0;
	this.base = '';
	this.specQueue = [];
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
		var message = 'reset';
		var length = this.pos.length;
		if(buff !=  "")
		{
			var jLength = buff.pos.length ;
			for (var i=0;i<length;i++)
			{
					for(var j=0; j<jLength; j++)
					{
						message = this.match(this.pos[i],buff.pos[j]);
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
	
	
	
		// Two cases where this happens:
		// 	- We cant find any pair matches so we find singles.
		//  - Person entered a single.
		if(message === 'reset'){
			console.log("Couldnt find any Enforced Weapons or Casted Weapons")
			this.next = undefined;
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
			this.base = this.next[WORD];
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
	if(next == undefined)
	{
		if (current == 'n')
		{
			message = 'build';
			this.type= 'Weapon';
			this.base = this.word;
		}
		if(current == 'v')
		{
			message = 'build';
			this.type = 'Cast';
			
			this.base = this.word;
		}
	}
	
	return message;
};


SpellToken.prototype.matchV = function(current,next)
{
	var message = 'reset';
	if(current != 'v')
		return 'reset';
	
	message = this.matchCast(current,next);
	if(message !== 'reset')
	{
		return message
	}
	message = this.matchCastWeapon(current,next);
	return message;
}

SpellToken.prototype.matchCast = function(current,next){
	if(next !== 0)
		return 'reset';
	
	this.type = 'Cast';
	this.base = this.word;
	return 'build';
}

SpellToken.prototype.matchCastWeapon = function(current,next){
	if(next !== "n")
		return 'reset';
	
	this.type = 'Cast';
	this.base = this.next[WORD];
	return 'build';
}

SpellToken.prototype.matchAdj = function(current,next)
{
	if (current =! 'adj')
		return 'reset'
	message = this.matchEnforce(current,next);
	
	if(message != 'reset')
		return message;
	
	message = this.matchBuildWeapon(current,next);
	return message;
}

SpellToken.prototype.matchEnforce = function(current,next)
{
	if(next != 'adj')
		return 'reset';
	return 'enforce';
}

SpellToken.prototype.matchBuildWeapon = function(current,next)
{
	
	if(next != 'n')
		return 'reset';
	this.type = 'Weapon';
	this.base = this.next[WORD];
	return 'build';
}

SpellToken.prototype.matchN = function(current,next)
{
	if(current =! 'n')
		return 'reset';
	return this.matchWeapon(current,next);
}

SpellToken.prototype.matchWeapon = function(current,next)
{
	if(next !== 0)
		return 'reset'
	this.type= 'Weapon';
	this.base = this.word;
	return 'build';
}

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




