var WORD = 0;
var POS = 1;
var FPS30 = 33.33;
var FPS60 = 16.66;
var wQLength = 3; 
function Mage()
{
	return this;
}

Mage.prototype.health = 100;
Mage.prototype.healthWidth;
Mage.prototype.healthStartWidth;
// All mages must implement this
Mage.prototype.init = function(){};
//
Mage.prototype.reduceHealth = function(damage)
{
	this.health -= damage;
	this.health = this.health.toFixed(2);
	this.healthUpdate();
}

Mage.prototype.healthUpdate = function()
{
	console.log("updating");
	$(this.healthId).html(this.health);
}

function AI(name,health,castTimer)
{
	this.name = name;
	this.health = health;
	this.health = this.health.toFixed(2);
	this.startHealth = health;
	this.castQueue = [];
}


AI.prototype = new Mage();
AI.prototype.constructor = AI;
AI.prototype.healthUpdate = function(){
	Mage.prototype.healthUpdate.call(this);
	this.healthBarUpdate();
}
AI.prototype.init = function(){

	this.healthUpdate();
	this.nameUpdate();
	this.timerWidth = getWidth(this.castBarId);
	this.timerStartWidth = 0;
	this.timerUpdate(0);
}

AI.prototype.healthBarUpdate = function(){
	if(this.healthStartWidth === undefined){
		this.healthStartWidth = $(this.healthId).css("width");
	}
	this.healthStartWidth = $(this.healthId).css("width");
	var percent = (this.health/this.startHealth);
	var amount = pxToNum(this.healthStartWidth);
	this.healthWidth = percent * amount;
	$(this.healthBarId).css("width",this.healthWidth);
}

// Predef vars

//TODO Cache these
AI.prototype.healthBarId="#bossHealthBar";
AI.prototype.healthId = "#bossHealth";
AI.prototype.castBarId= "#bossCastBar";
AI.prototype.castBar = $(this.castBarId);
AI.prototype.castIndex = 0;
AI.prototype.cast = function(boss,player){
	if(boss.health <= 0 || player.health <= 0){
		return;
	}
	boss.castIndex = boss.castIndex % boss.castQueue.length;
	boss.currentSpell = boss.castQueue[boss.castIndex];
	var spell = boss.currentSpell;
	boss.castTimer = spell.castTimer; //ms
	boss.startTimer=  spell.castTimer;
	boss.spellUpdate(spell);
	boss.startCast(boss,player);
	boss.castIndex++;
}
AI.prototype.startCast = function(boss,player){
	boss.timerUpdate(boss.castTimer);
	if(boss.castTimer <= 0) {
		boss.execute(boss,player);
		boss.cast(boss,player);
	}
	else{
		boss.castTimer -= FPS30;
		setTimeout(boss.startCast,FPS30,boss,player);
	}
}
AI.prototype.execute = function(boss,player){
	// Do damage to player
	console.log("Dealing dmg to player");
	var dmg = boss.currentSpell.power;
	player.reduceHealth(dmg);
	battleLog(boss.currentSpell,"bossLog",boss);
}
AI.prototype.spellUpdate = function(spell)
{
	var dmg = dmgBracket(spell.power)
	$("#bossSpell").html(spell.full+dmg);
}
AI.prototype.timerUpdate = function(num){
	console.log("Timer update");
	var percent = (this.startTimer - num)/this.startTimer;
	var amount = percent * pxToNum(this.timerWidth);
	this.timerStartWidth = amount * percent;
	if(this.timerStartWidth >= pxToNum(this.timerWidth))
		this.timerStartWidth = this.timerWidth;
	$(this.castBarId).css("width",this.timerStartWidth);
}

AI.prototype.nameUpdate = function(){
	$("#bossName").html(this.name);
}
AI.prototype.addSpell = function(spell){
	this.castQueue.push(spell);
}

/// Humans
function Human(name,health)
{
	this.name = name;
	this.health = health;
	this.startHealth = health;
	this.health.toFixed(2);
	this.weaponSlot = 0;
	return this;
}

Human.prototype = new Mage();
Human.prototype.gui = new guiUtils;
Human.prototype.healthUpdate = function(){
	Mage.prototype.healthUpdate.call(this);
	this.healthBarUpdate();
}

/*
Human.prototype.reduceHealth = function(dmg){
	Mage.prototype.reduceHealth.call(this,dmg);
	this.gui.flashScreen();
}*/
Human.prototype.healthBarUpdate = function(){
	if(this.healthStartWidth === undefined){
		this.healthStartWidth = $(this.healthId).css("width");
	}
	var percent = (this.health/this.startHealth);
	var amount = pxToNum(this.healthStartWidth);
	this.healthWidth = percent * amount;
	$(this.healthBarId).css("width",this.healthWidth);
}



Human.prototype.init = function(){
	$(this.healthBarId).css(this.defaultHealthWidth);
	this.healthUpdate();
	this.healthWidth = getWidth(this.healthId);
	this.healthStartWidth = this.healthWidth;
}
Human.prototype.healthBarId = "#playerHealthBar";
Human.prototype.healthId = "#playerHealth";
Human.prototype.defaultHealthWidth ="195px";
Human.prototype.history = Array();
Human.prototype.inventory = Array(3);
Human.prototype.addInventory = function(spell){
	spell.power = spell.power.toFixed(2);
	var index = this.findOpenSlot();
	this.inventory[index] = spell;
	this.xUpdateWeaponQueue(index,spell);
}

Human.prototype.useWeapon = function(weapon)
{
	var match = this.xSearch(weapon.base);
	if(match !== undefined){
	this.removeWeapon(match.index);
	this.xUpdateWeaponQueue(match.index);
	}
	return match;
}

Human.prototype.removeWeapon = function(index){
	this.inventory[index] = undefined;
	this.findOpenSlot();
}

Human.prototype.xSearch = function(base){
	
	for(var i=0; i<wQLength; i++){
		if(this.inventory[i] !== undefined && this.inventory[i].base[WORD] == base){
			this.inventory[i].index = i;
			return this.inventory[i];
		}
	}
}

Human.prototype.search = function(base){
	var length = this.history.length;
	for (var i=0;i < length;i++)
	{
	  if(this.history[i].base[WORD] == base)
	  {
	  	// TODO This could be this.history[i];
		return this.history.splice(i,1).pop();
	  }
	}
	return undefined;
}


Human.prototype.xUpdateWeaponQueue = function(slot,weapon)
{
	if(slot > 2)
		slot = slot%3;
	if(weapon !== undefined)
		$("#weapon"+slot).html('&#60;The '+weapon.full + "&#62; <br>" +weapon.power+' dmg');
	else{
		$("#weapon"+slot).html("");
	}
}


Human.prototype.updateWeaponQueue = function(){
		var slot = this.findOpenSlot();
		if(this.history !== undefined){
			var length = this.history.length - 1;
			var current = this.history[length];
			$("#weapon"+slot).html('&#60;The '+current.full + "&#62; <br>" +current.power+' dmg');
		}
}

Human.prototype.findOpenSlot = function(){
	for(var i=0; i<wQLength; i++){
		if(this.inventory[i] === undefined){
			this.weaponSlot = i;
			return i;
		}
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





//AI Manager
function BossManager(){
	this.init();
}


BossManager.prototype.bossList = [];
BossManager.prototype.index = 0;
BossManager.prototype.getNextBoss=function(){
	var boss = this.bossList[this.index];
	this.index++;
	return boss;
}
BossManager.prototype.currentBoss= function(){
	return this.bossList[this.index];
}

// TODO in the future.
// Should move this to the node. Dunno how to work that shit yet.
BossManager.prototype.init = function(){
	var tutBoss = new AI("Tutorial Boss",100,2000);
	tutBoss.addSpell(new bossSpell("Use rookie mistake",10000,10));
	tutBoss.addSpell(new bossSpell("Hello World",10000,20));
	this.bossList.push(tutBoss);
	
	
	var Lvl1Boss =new AI("Lvl 1 Boss",150);
	Lvl1Boss.addSpell(new bossSpell("Teach lesson",1000,10));
	Lvl1Boss.addSpell(new bossSpell("Throw textbook",900,20));
	Lvl1Boss.addSpell(new bossSpell("Give homework",5000,30));
	this.bossList.push(Lvl1Boss);
	
	// For later	
//	var Lvl2Boss = new AI("Lvl 2 Boss",200);
	// Push some spells.
//	this.bossList.push(Lvl2Boss);
}

// Boss currently cheats the spell engine.
function bossSpell(word,castTimer,dmg){
    this.full = word;
    this.castTimer = castTimer;
    this.power = dmg;
}
//End AI Manager
















