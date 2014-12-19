/*

Data incoming in the form:
 ["[["test","v,n"],["spell","n,"]]"]
 Array of tokens
	[    ] Queue layer
		[    ] Spell layer
			[     ] Token layer
				Word, Pos

*/

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
	var i =0;
	var length = spell.length;
	while(spell.length > 0)
	{
		console.log(spell.length);
		console.log("Spell1");
			console.log(spell);
		if (token == undefined)
		{
			try{
			debug = spell;
			var splice = spell.splice(0,1).pop();
			token = new SpellToken(splice,spell[0]); // Token layer
			console.log("Spell length = "+ spell.length);
			length--;
			console.log("Token");
			console.log(token);
			console.log("Spell2");
			console.log(spell);
			}
			catch(err){
				console.log("spell is null");
				console.log(spell[0]);
			}
		}
				console.log(spell.length);
		var msg = token.parse();
		switch(msg)
		{
			case 'build':
				return this.build(token,spell[0]);
			case 'enforce':
				this.enforce(token,spell[0]);
				break;
			case 'reset':
				token = undefined;
				break;
		}
		i++;
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
			var length = token.seq.length - 1;
			for (var i=0; i<length; i++)
			{
			  token.power += token.seq[i].length;
			}
			if(finisher != undefined){
				token.power += finisher[0].length; //later ^ 1.5
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
	this.word = block[0];
	this.pos = block[1].split(",");
	this.next = spell;
	this.type = '';
	this.seq = [];
	this.power =0;
	this.base = '';
	return this;
}

function buffToken(block)
{
	if(block == undefined | block == null)
	{
		return "";
	}
	this.word = block[0];
	this.pos = block[1].split(",");
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
				this.base = this.next.word;
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



