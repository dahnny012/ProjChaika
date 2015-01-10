	
	/* Retiring
	function printSpell() {
		var spell = $("#controller").val();
		$("#spellDisplay").html(spell);
	}*/
	/*
	function checkResults(promise,spell)
	{
		setTimeout(checkPromise(promise,spell),100);
	}*/
	/*
	function checkPromise(promise,spell)
	{
		promise.success(function(data){
		if(data !== undefined)
		{
			console.log(data);
			if(data !== "")
			{
				data = JSON.parse(data);
			}
			//console.log(data);
			spellQueue.push(data);
		}
		else
		{
			checkResults(promise,spell);
		}
		});
	}*/
	
	
	SpellToken.prototype.parse = function(tokesLeft){

		var buff = buffToken(this.next);
		var message = 'reset';
		var length = this.pos.length;
		if(buff !== "")
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
			console.log("Couldnt find any Enforced Weapons or Casted Weapons");
			this.next = undefined;
			for(var k=0; k<length; k++)
			{
				message = this.match(this.pos[k],undefined);	
				if(message != 'reset')
				{
					return message;
				}
			}
		}
			
		
};


SpellToken.prototype.match = function(current,next)
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
	if(next === 0)
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