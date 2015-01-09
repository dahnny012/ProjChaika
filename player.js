var WORD = 0;
var POS = 1;
var FPS30 = 33.33;
var FPS60 = 16.66;
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
	this.healthUpdate();
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
	this.castTimer = castTimer; //ms
	this.startTimer=  castTimer;
	this.init();

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
	this.timerUpdate(0);
}

// Predef vars
AI.prototype.healthId = "#bossHealth";
AI.prototype.castBarId= "#bossCastBar";
AI.prototype.castBar = $(this.castBarId);

AI.prototype.cast = function(spell,boss,player){
	boss.currentSpell = spell;
	boss.spellUpdate(spell);
	return boss.startCast(boss,player);
}
AI.prototype.startCast = function(boss,player){
	boss.timerUpdate(boss.castTimer);
	if(boss.castTimer <= 0) {
		boss.execute(boss,10,player);
		boss.castTimer = boss.startTimer;
		//boss.castQueue.push([boss.currentSpell,dmg]);
	}
	else{
		boss.castTimer -= FPS30;
		setTimeout(boss.startCast,FPS30,boss,player);
	}
}
AI.prototype.execute = function(boss,dmg,player){
	// Do damage to player
	console.log("Dealing dmg to player");
	player.reduceHealth(dmg);
	var spell = {};
	spell.full = boss.currentSpell;
	spell.dmg = dmg;
	battleLog(spell,"bossLog",boss);
}
AI.prototype.spellUpdate = function(string)
{
	$("#bossSpell").html(string);
}
AI.prototype.timerUpdate = function(num){
	var percent = (this.startTimer - num)/this.startTimer;
	var amount = percent * pxToNum(this.timerWidth);
	//console.log(pxToNum(this.timerWidth));
	this.timerStartWidth = amount * percent;
	if(this.timerStartWidth >= pxToNum(this.timerWidth))
		this.timerStartWidth = this.timerWidth;
	$(this.castBarId).css("width",this.timerStartWidth);
}

AI.prototype.nameUpdate = function(){
	$("#bossName").html(this.name);
}

AI.prototype.castQueue = [];

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
	return parseFloat(px.substr(0,px.search("px")));
}










