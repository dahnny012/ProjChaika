var WORD = 0;
var POS = 1;

function Mage()
{
	return this;
}

Mage.prototype.health = 100;
Mage.prototype.reduceHealth = function(damage)
{
	this.health -= damage;
	this.health = this.health.toFixed(2);
}


Mage.prototype.update = function()
{
	console.log("updating");
	console.log(this.id);
	$(this.id).html(this.health);
}

function AI(ID)
{
	this.id = ID;
	this.update();
	this.castTimer = 3000; //ms
	//this.cast("SomeSpell");
}

AI.prototype = new Mage();
AI.prototype.constructor = AI;
AI.prototype.health = 200;
AI.prototype.cast = function(spell,boss){
	boss.currentSpell = spell;
	boss.spellUpdate(spell);
	return boss.startCast(boss);
}

AI.prototype.startCast = function(boss,player){
	boss.timerUpdate(boss.castTimer);
	if(boss.castTimer <= 0) {
		boss.execute();
		boss.castTimer = 3000;
		return 10;
	}
	else{
		boss.castTimer -= 100;
		setTimeout(boss.startCast,100,boss,player);
	}
}

AI.prototype.execute = function(){
	// Do damage to player
	console.log("Dealing dmg to player");
}

AI.prototype.spellUpdate = function(string)
{
	$("#bossSpell").html(string);
}
AI.prototype.timerUpdate = function(num){
	$("#bossSpellTimer").html(num/1000);
}





/// Humans
function Human()
{
	this.health.toFixed(2);
	this.update();
	return this;
}




Human.prototype = new Mage;
Human.prototype.id = "#playerHealth";
Human.prototype.history = Array();
Human.prototype.search = function(base){
	var length = this.history.length;
	for (var i=0;i < length;i++)
	{
	  if(this.history[i].base[WORD] == base)
	  {
		return this.history.splice(i,1).pop();
	  }
	}
	return undefined;
}

Human.prototype.updateWeaponQueue = function()
{
		if(this.history != undefined){
			var length = this.history.length - 1;
			var current = this.history[length];
			$("#WeaponQueue").append('<div> The '+current.full + " : " +current.power+' damage </div>');
		}
}














