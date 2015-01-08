var WORD = 0;
var POS = 1;

function Mage()
{
	return this;
}

Mage.prototype.health = 100;

// All mages must implement this
Mage.prototype.init = function(){};
Mage.prototype.reduceHealth = function(damage)
{
	this.health -= damage;
	this.health = this.health.toFixed(2);
}

Mage.prototype.healthUpdate = function()
{
	console.log("updating");
	console.log(this.healthId);
	$(this.healthId).html(this.health);
}

function AI(name,health,castTimer)
{
	this.name = name;
	this.health = health;
	this.startHealth = health;
	this.init();
	this.castTimer = castTimer; //ms
}


AI.prototype = new Mage();
AI.prototype.constructor = AI;
AI.prototype.init = function(){
	this.healthUpdate();
	this.nameUpdate();
	this.timerWidth = getWidth(this.castBarId);
	this.timerStartWidth = 0;
	this.healthWidth = getWidth(this.healthId);
	this.healthStartWidth =this.healthWidth;
}

// Predef vars
AI.prototype.healthId = "#bossHealth";
AI.prototype.castBarId= "#bossCastBar";
AI.prototype.castBar = $(this.castBarId);

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
	/***** TODO *////////////////
	0/timerWidth = numTotal/Total
}

AI.prototype.nameUpdate = function(){
	$("#bossName").html(this.name);
}



/// Humans
function Human(name,health)
{
	this.name = name;
	this.health = health;
	this.startHealth = health;
	this.health.toFixed(2);
	this.init();
	this.queueIndex = 0;
	return this;
}




Human.prototype = new Mage;
Human.prototype.init = function(){
	this.healthUpdate();
	this.healthWidth = getWidth(this.healthId);
	this.healthStartWidth = this.healthWidth;
}
Human.prototype.healthId = "#playerHealth";
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

Human.prototype.updateWeaponQueue = function(){
		var slot = this.queueIndex % 3;
		if(this.history !== undefined){
			var length = this.history.length - 1;
			var current = this.history[length];
			$("#WeaponQueue").append('<div class="weapon '+ slot + '"> &#60;The '+current.full + "&#62; <br>" +current.power+' dmg </div>');
			this.queueIndex += 1;
		}
}


// in a refactor this will be neater. No time for that tho.
function cssBar(id,val)
{
	var width = $(id).css("width")
	this.startWidth = width;
	this.width = width;
	this.startVal = val;
	this.val = val;
}



// Css helping functions
function getWidth(query){
	return $(query).css("width");
}
function numToPx(num)
{
	return num + "px";
}
function pxToNum(px){
	px.substr(0,px.search("px"))
}










