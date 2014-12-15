function Mage()
{
	
	return this;
}

Mage.prototype.health = 100;
Mage.prototype.reduceHealth = function(damage)
{
	this.health -= damage;
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
	console.log(this.id);
	this.update();
	this.reduceHealth(50);
	this.update();
}

AI.prototype = new Mage();
AI.prototype.constructor = AI;
AI.prototype.health = 200;


function Human()
{
	return this;
}




Human.prototype = new Mage;
Human.prototype.history = Array();
Human.prototype.search = function(base){
	var length = this.history.length -1;
	for (var i=0;i < length;i++)
	{
	  if(this.history[i].base == base)
	  {
		return this.history[i].splice(i,1);
	  }
	}
	return undefined;
}

Human.prototype.updateWeaponQueue = function()
{
		if(this.history != undefined){
			var length = this.history.length - 1;
			var current = this.history[length];
			$("#WeaponQueue").append('<div>'+current.base + " : " +current.power+'</div>');
		}
}