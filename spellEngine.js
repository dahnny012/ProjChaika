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
	if(queue.length == 1){
		queue.pop();
	}
	else{
		queue.splice(0,1);
	}
	
	if (spellLayer !== 0)
	{
		var spell =  this.buildSpell(spellLayer,player,spellLayer.spec);
		if(spell === 0)
			return undefined;
			
		if(spell.type == 'Weapon'){
			//player.history.push(spell);
			//player.updateWeaponQueue();
			player.addInventory(spell);
			console.log("Made weapon");
		}
		/// TODO pass player to build so i can move this.
		else if(spell.type == 'Cast'){
			console.log("Spellcasting");
			console.log(player);
			var weapon = player.useWeapon(spell);
			
			/* New 1/10
			if(player.xSearch(spell.base) !== undefined){
				console.log("Found in inventory");
				var inven  = player.useWeapon(spell);
				if(inven === undefined)
				{
					console.log("error with useWeapon");
				}
				
			}
			else{
				console.log("No matches in inventory");
			}*/
			//
			if(weapon !== 0 && weapon !== undefined)
		 {
				var base = 1;
				var combo = base + spell.power/10;
				spell.power += (combo *  weapon.power);
			}
			else{
				if(spell.base !== undefined){
					var base = 1;
				 var combo = base + spell.power/10;
			 	spell.power += (combo *  spell.base.length);
				}
			}
			return spell;
		}
		else
		{
			console.log("Failed to make a token");
		}
	}
	return 0;
};

var debug;
SpellEngine.prototype.buildSpell = function(spell,player,spec){
	var token;
	
	// while spell has tokens
	var length = spell.length;
	for(var i=0; i<length; i++)
	{
		if(token === undefined)
		{
			try{
			debug = spell;
			console.log("Splice");
			var splice = spell.splice(0,1).pop();
			var nextTok;
			console.log(splice);
			console.log("spell length " +  spell.length);
			if(spell.length !== 0)
			{
				nextTok = spell.splice(0,1).pop();
			}
			token = new SpellToken(splice,nextTok,spec); // Token layer
			switch(spec){
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
		var msg = token.xParse(spell.length);
		switch(msg)
		{
			case 'build':
				return this.build(token,nextTok);
			case 'enforce':
				this.enforce(token,nextTok);
				token.next = spell.splice(0,1).pop();
				nextTok = token.next;
				if(token.next === undefined)
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
	
	if(token === 0)
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
			if(finisher !== undefined && finisher !== 0){
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
};

SpellEngine.prototype.enforce = function(token,enforce)
{
	token.seq.push(enforce);
};




function SpellToken(block,spell,spec)
{
	if(block === 0)
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
	if(block === 0 || block === undefined)
	{
		return 0;
	}
	this.word = block[WORD];
	this.pos = block[POS].split(",");
	return this;
}



// TODO write prototype xParse(with enforcing)

SpellToken.prototype.xParse = function(tokesLeft){
	
	var buff = buffToken(this.next);
	var message = 'reset';
	var numTokes;
	numTokes = this.pos.length;
 var current;
	var next;
	switch(this.spec)
	{
		case 'Weapon':
			if(tokesLeft < 1){
				if(buff !== 0)
					next = 1;
				current = this.pos[this.pos.indexOf("n")];
				message = this.matchN(current,next);
				if(message != 'reset')
					return message;
				current = this.pos[this.pos.indexOf("adj")];
				if(buff !== 0)
					next = buff.pos[getBuffPos(buff,"n")];
			 message = this.matchAdj(current,next);
			 if(message != 'reset')
			  return message;
			}
			else
			{
				current = this.pos[this.pos.indexOf("adj")];
				if(buff !== 0)
					next = buff.pos[getBuffPos(buff,"adj")];
				message = this.matchAdj(current,next);
				if(message != 'reset')
				 return message;
			}
		case 'Cast':
		 if(tokesLeft === 0){
		   current = this.pos[this.pos.indexOf("v")];
		   if(buff !== 0)
		   	next = buff.pos[getBuffPos(buff,"n")];
		   message = this.matchV(current,next);
		   if(message != 'reset')
		    return message;
		 }
		case 'Default':
			for(var i in this.pos){
				var current = this.pos[i];
			 	if(buff !== 0 && buff.pos !== 0)
			 	{
			 		for(var j in buff.pos){
			 			message = this.xMatch(current,buff.pos[j]);
			 			if(message !== 'reset'){
			 				return message;
			 			}
							else if(message == 'Cast'){
							 this.base = buff.word;
			 	  }
			 	 }
			  }
			  else{
			 		message = this.xMatch(current,0);
			 		if(message != 'reset'){
								return message;
						}
			 	}
		 }
		 return message;
 }
};
	 	



SpellToken.prototype.xMatch = function(current,next){
	var message = 'reset';
	console.log("Current: " + current + " " + "Next: " + next);
	message = this.matchV(current,next);
	if(message != 'reset')
		return message;
	
	message = this.matchAdj(current,next);
	if(message != 'reset')
		return message;
	
	message = this.matchN(current,next);
	return message;
};





SpellToken.prototype.matchV = function(current,next) {
	var message = 'reset';
	if(current != 'v')
		return 'reset';
	
	message = this.matchCast(current,next);
	if(message !== 'reset')
	{
		return message;
	}
	message = this.matchCastWeapon(current,next);
	return message;
};

SpellToken.prototype.matchCast = function(current,next){
	if(next !== 0 && next !== undefined)
		return 'reset';
	
	this.type = 'Cast';
	return 'build';
};

SpellToken.prototype.matchCastWeapon = function(current,next){
	if(next !== "n")
		return 'reset';
	
	this.type = 'Cast';
	this.base = this.next[WORD];
	return 'build';
};

SpellToken.prototype.matchAdj = function(current,next) {
	if (current != 'adj')
		return 'reset';
	var message = this.matchEnforce(current,next);
	
	if(message != 'reset')
		return message;
	
	message = this.matchBuildWeapon(current,next);
	return message;
};

SpellToken.prototype.matchEnforce = function(current,next) {
	if(next != 'adj')
		return 'reset';
	return 'enforce';
};

SpellToken.prototype.matchBuildWeapon = function(current,next) {
	if(next != 'n')
		return 'reset';
	this.type = 'Weapon';
	this.base = this.next[WORD];
	return 'build';
};

SpellToken.prototype.matchN = function(current,next) {
	if(current != 'n')
		return 'reset';
	return this.matchWeapon(current,next);
};

SpellToken.prototype.matchWeapon = function(current,next) {
	if(next !== 0 && next !== undefined)
		return 'reset';
	this.type= 'Weapon';
	this.base = [this.word];
	return 'build';
};


function getBuffPos(buff,targetPos)
{
	if(buff === 0 || buff === undefined)
		return 0;
	return buff.pos.indexOf(targetPos);
}


//####### Debug and Testing functions
function dump(token){
	console.log("Something wrong occurred");
	console.log(token.word);
	console.log(token.pos);
	console.log(token.next);
	console.log(token.type);
}

function dumpQ(queue){
	console.log(JSON.stringify(queue));

}


// Returns a spelltoken
function dummyToken(){
	var block = ["test","n,v,adj"];
	var next = buffToken(["orange","n,v,adj"]);
	var dummy = new SpellToken(block,next,"Default");
	return dummy;
}

function dummyTokenNull(){
	var block = ["test","n,v,adj"];
	var next = null;
	var dummy = new SpellToken(block,next,"Default");
}


// pos1 and pos2 is for tests. Their function will be useful in enforce though.
// Might want to add it.
SpellToken.prototype.pos1 = function(testPos){
	switch(testPos) {
		case 'v':
			return this.pos[1];
		case 'n':
			return this.pos[0];
		case 'adj':
			return this.pos[2];
		default:
			console.log("Error");
			return null;
	}
};

SpellToken.prototype.pos2 = function(testPos){
	switch(testPos) {
		case 'v':
			return this.next.pos[1];
		case 'n':
			return this.next.pos[0];
		case 'adj':
			return this.next.pos[2];
		default:
			console.log("Error");
			return null;
	}
};

function xMatchTests(){
	// Basic tests
	// n , n ---> Reset
	var nn = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("n"),dummy.pos2("n"));
		if(message !== "reset")
			throw("nn failed " + message);
		dummy = new dummyToken();
		
		// test single n match
		message = dummy.xMatch(dummy.pos1("n"),0);
		if(message !== "build" || dummy.type != "Weapon")
			throw("n0 failed " + message);
		if(dummy.base !== dummy.word)
		 throw("single n failed verfification");
	}();

	
	// n , v --->  Reset
	var nv = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("n"),dummy.pos2("v"));
		if(message !== "reset")
			throw("nv failed " + message);
	}();
	
	
	// n , adj ----> Reset
	var na = function() {
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("n"), dummy.pos2("adj"));
		if (message !== "reset")
			throw("na failed " + message);
	}();
	
	
	// adj , n -----> Enforced build
	var an = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("adj"),dummy.pos2("n"));
		if(message !== "build")
			throw("an failed " + message);
		if(dummy.type !== 'Weapon' || dummy.base !== dummy.next[WORD])
		 throw("an failed verification");
	}();

	
	/// adj , adj ----> enforce 
	var aa = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("adj"),dummy.pos2("adj"));
		if(message !== "enforce")
			throw("aa failed " + message);
	}();

	
	/// adj , v ---->  Reset
	var av = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("adj"),dummy.pos2("v"));
		if(message !== "reset")
			throw("av failed " + message);
	}();
	
	
	/// v , n ---->  build , type cast
	var vn = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("v"),dummy.pos2("n"));
		if(message !== "build" || dummy.type !== "Cast")
			throw("vn failed: " + message);
		if(dummy.base !== dummy.next[WORD])
		 throw("vn failed verification");
	}();
	
	/// v , a ---->  Reset
	var va = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("v"),dummy.pos2("adj"));
		if(message !== "reset")
			throw("vn failed " + message);
	}();

	/// v , v ---->  Reset
	var vv = function(){
		var dummy = new dummyToken();
		var message = dummy.xMatch(dummy.pos1("v"),dummy.pos2("v"));
		if(message !== "reset")
			throw("vn failed " + message);
			
			
	/// test single v match
		dummy = new dummyToken();
		message = dummy.xMatch(dummy.pos1("v"),0);
		if(message !== "build" && dummy.type != "Cast")
			throw("v0 failed " + message);
		if(dummy.base !== dummy.word)
		 throw("single v failed verification")
	}();


}


function xParseToken(pos1,pos2,spec){
		var block = ["test",pos1];
		
		if(pos2 === 0 || pos2 === "" || pos2 === undefined){
			var next = 0;
		}
		else{
			next = ["orange",pos2];
		}
	 var dummy = new SpellToken(block,next,spec);
	 return dummy; 
}


function xParseTest_singles(){
	// n0
	var makeWeapon = function (pos,build,type,extra){
		
		var dummy = new xParseToken(pos,0,"Weapon");
	 var message = dummy.xParse(0);
		if(build === undefined)
		 build = "build";
		if(type === undefined)
			type = "Weapon";
		if(extra === undefined)
			extra = dummy.base[WORD] !== dummy.word;
	 if(message !== build || dummy.type !== type || extra)
			throw("makeWeapon failed " + message + " " + type + " " + dummy.base + " " + dummy.word);
	};
	
	var makeCast = function (pos,build,type,extra){
	 var dummy = new xParseToken(pos,0,"Cast");
	 var message = dummy.xParse(0);
	 if(build === undefined)
		 build = "build";
		if(type === undefined)
			type = "Cast";
	 if(extra === undefined)
			extra = dummy.base !== dummy.word;
	 
	 if(message !== build || dummy.type !== type || extra)
			throw("a0 failed " + message);
		console.log("pass");
	}; 
	
	var makeDefault = function  (pos,build,type,extra){
	 var dummy = new xParseToken(pos,0,"Default");
	 var message = dummy.xParse(0);
	 if(build === undefined)
		 build = "reset";
		if(type === undefined)
			type = "";
	 if(extra === undefined)
	 	return undefined;
	 if(message !== build || dummy.type != type || extra)
			throw("a0 failed " + message);
	};
	
	makeWeapon("n");
	makeWeapon("n,v");
	makeWeapon("v,n");
	makeCast("v");
	makeCast("v,n");
	makeCast("n,v");
	makeDefault("adj");
	makeDefault("adj,v","build","Cast");
	makeDefault("adj,v","build","Weapon");
}


function xParseTest_doubles(){
	var makeBuildWeapon = function (pos,pos2,build,type,extra,qSize,dummy){
		
		if(dummy === undefined){
			dummy = new xParseToken(pos,pos2,"Weapon");
		}
		else{
			console.log("no new token");
		}
		
		if(qSize === undefined)
			qSize = 0;
	 var message = dummy.xParse(qSize);
		if(build === undefined)
		 build = "build";
		if(type === undefined)
			type = "Weapon";
		if(extra === undefined)
			extra = dummy.base !== dummy.next[WORD];
	 if(message !== build || dummy.type !== type || extra)
			throw("makeBuildWeapon failed " + message + " " + type);
		return dummy;
	};
	
	
	var makeCastWeapon = function (pos,pos2,build,type,extra,qSize){
		var dummy = new xParseToken(pos,pos2,"Cast");
		if(qSize === undefined)
			qSize = 0;
	 var message = dummy.xParse(qSize);
		if(build === undefined)
		 build = "build";
		if(type === undefined)
			type = "Cast";
		if(extra === undefined)
			extra = dummy.base !== dummy.next[WORD];
			
	 if(message !== build || dummy.type !== type || extra){
	  console.log("Actual: " + dummy.type + " " + extra + " " + message);
			throw("makeBuildWeapon failed " + build + " " + type);
	 }
	};
	
	var makeEnforceBuildWeapon = function(){
		// need 2 dummys
		var enforce = makeBuildWeapon("n,v,adj","adj,n,v","enforce","",false,1);
		var nextTok = ["orange2","n,v,adj"];
		enforce.next = nextTok;
		makeBuildWeapon("n,v,adj","adj,n,v","build","Weapon",undefined,0,enforce);
	};
	
	
	// sunny side 
	makeBuildWeapon("n,v,adj","adj,n,v");
	makeCastWeapon("n,v,adj","adj,n,v");
	makeBuildWeapon("n,v,adj","adj,n,v","enforce","",false,1);
	makeEnforceBuildWeapon()
	
	console.log("In cloudy");
	//cloud side
	makeBuildWeapon("v","n,adj","build","Cast",undefined,0);
	makeCastWeapon("n,adj","v","reset","",false,0);
 makeBuildWeapon("v","","build","Cast",false,0);
	
}

























