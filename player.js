var WORD = 0;
var POS = 1;
var FPS15 = 66.66;
var FPS30 = 33.33;
var FPS60 = 16.66;
var wQLength = 3; 
var interruptConst = 35;


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
	if(this.health < 0)
		this.health = 0;
	this.healthUpdate();
}

Mage.prototype.healthUpdate = function()
{
	console.log("updating");
	$(this.healthId).html(this.health);
}

function AI(name,health,ability)
{
	this.name = name;
	this.health = health;
	this.health = this.health.toFixed(2);
	this.startHealth = health;
	this.castQueue = [];
	this.ability = ability;
	if(this.ability !== undefined){
		if(this.ability.name == "Extreme Focus")
			this.focus = TRUE;
	}
}


AI.prototype = new Mage();
AI.prototype.constructor = AI;
AI.prototype.healthUpdate = function(){
	Mage.prototype.healthUpdate.call(this);
	this.healthBarUpdate();
}

AI.prototype.reduceHealth = function(dmg){
	Mage.prototype.reduceHealth.call(this,dmg);
	if(this.focus === undefined)
		this.interrupt(dmg);
}
AI.prototype.interrupt = function(dmg){
	if(dmg * interruptConst > this.castTimer){
		this.castTimer = this.startTimer
	}
	else{
		this.castTimer += dmg*interruptConst
	}
	this.timerUpdate(this.castTimer);
}
AI.prototype.init = function(){
	this.healthUpdate();
	this.nameUpdate();
	this.timerWidth = getWidth(this.castBarId);
	this.maxWidth = this.timerWidth;
	this.timerStartWidth = 0;
	this.timerUpdate(0);
	if(this.ability !== undefined)
		this.ability.init();
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
AI.prototype.container = "#bossWrapper";
AI.prototype.healthBarId="#bossHealthBar";
AI.prototype.healthId = "#bossHealth";
AI.prototype.castBarId= "#bossCastBar";
AI.prototype.castBar = $(this.castBarId);
AI.prototype.castIndex = 0;
AI.prototype.cast = function(boss,player,cb){
	if(boss.health <= 0 || player.health <= 0){
		if(player.health <= 0)
			cb(boss,player,cb);
		return;
	}
	boss.castIndex = boss.castIndex % boss.castQueue.length;
	boss.currentSpell = boss.castQueue[boss.castIndex];
	var spell = boss.currentSpell;
	boss.castTimer = spell.castTimer; //ms
	boss.startTimer=  spell.castTimer;
	boss.spellUpdate(spell);
	boss.startCast(boss,player,cb);
	boss.castIndex++;
}
AI.prototype.startCast = function(boss,player,cb){
	boss.timerUpdate(boss.castTimer);
	if(boss.health <= 0){
		return;
	}
	else if(boss.castTimer <= 0) {
		boss.execute(boss,player);
		boss.cast(boss,player,cb);
	}
	else{
		boss.castTimer -= FPS30;
		setTimeout(boss.startCast,FPS30,boss,player,cb);
	}
}
AI.prototype.execute = function(boss,player){
	// Do damage to player
	console.log("Dealing DMG to player");
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
AI.prototype.resetCast = function(){
	$(this.castBarId).css("width",this.maxWidth);
	this.castIndex = 0;
}
AI.prototype.resetHealth = function(){
	this.health = this.startHealth;
	this.healthUpdate();
}
AI.prototype.reset =function(){
	this.resetCast();
	this.resetHealth();
	if(this.ability !== undefined)
		this.ability.reset();
}
AI.prototype.unload = function(){
	this.container.slideToggle("100");
}

function DummyAI(){
	this.name = "Training Dummy";
	this.health = 1000;
	this.health = this.health.toFixed(2);
	this.startHealth = this.health;
	this.init();
}

DummyAI.prototype = new Mage();
DummyAI.prototype.constructor = DummyAI;
DummyAI.prototype.healthBarId="#dummyHealthBar";
DummyAI.prototype.healthId = "#dummyHealth";
DummyAI.prototype.nameUpdate = function(){
	$("#dummyName").html(this.name);
}
DummyAI.prototype.init=function(){
	this.healthUpdate();
	this.nameUpdate();
}

DummyAI.prototype.healthUpdate = function(){
	Mage.prototype.healthUpdate.call(this);
	this.healthBarUpdate();
}

DummyAI.prototype.healthBarUpdate = function(){
	if(this.healthStartWidth === undefined){
		this.healthStartWidth = $(this.healthId).css("width");
	}
	this.healthStartWidth = $(this.healthId).css("width");
	var percent = (this.health/this.startHealth);
	var amount = pxToNum(this.healthStartWidth);
	this.healthWidth = percent * amount;
	$(this.healthBarId).css("width",this.healthWidth);
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
Human.prototype.gui = new GuiUtils();
Human.prototype.healthUpdate = function(){
	Mage.prototype.healthUpdate.call(this);
	this.healthBarUpdate();
}



Human.prototype.healthBarUpdate = function(){
	if(this.healthStartWidth === undefined){
		this.healthStartWidth = $(this.healthId).css("width");
	}
	var percent = (this.health/this.startHealth);
	var amount = pxToNum(this.healthStartWidth);
	this.healthWidth = percent * amount;
	$(this.healthBarId).css("width",this.healthWidth);
}
Human.prototype.resetHealth = function(){
	this.health = this.startHealth;
	this.healthUpdate();
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
		$("#weapon"+slot).html('&#60;The '+weapon.full + "&#62; <br>" +weapon.power+' DMG');
	else{
		$("#weapon"+slot).html("");
	}
}


Human.prototype.updateWeaponQueue = function(){
		var slot = this.findOpenSlot();
		if(this.history !== undefined){
			var length = this.history.length - 1;
			var current = this.history[length];
			$("#weapon"+slot).html('&#60;The '+current.full + "&#62; <br>" +current.power+' DMG');
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

Human.prototype.reset = function(){
	this.resetHealth();
	this.inventory = [];
	for(var i=0; i<wQLength; i++)
		this.xUpdateWeaponQueue(i);
	$("#controller").val(null);
	$("#deathScreen").remove();
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
	var tutBoss = new AI("Potato,Boss of Potatoes",100,new VerbArmor(1));
	tutBoss.addSpell(new bossSpell("Throw potato",8000,5));
	tutBoss.addSpell(new bossSpell("Sling red potato",8000,5));
	tutBoss.addSpell(new bossSpell("Summon giant potato",10000,10));
	this.bossList.push(tutBoss);
	
	
	var Lvl1Boss =new AI("Spere,Boss of Literature",200,new VerbArmor(2));
	Lvl1Boss.addSpell(new bossSpell("Romeo oh Romeo",10000,10));
	Lvl1Boss.addSpell(new bossSpell("To be or not to be",9000,10));
	Lvl1Boss.addSpell(new bossSpell("The green-eyed monster",8000,10));
	this.bossList.push(Lvl1Boss);
	
	var Lvl2Boss =new AI("Zeno,Boss of Mathematics",200,new WordThreshold(5));
	Lvl2Boss.addSpell(new bossSpell("Make paradox",8000,10));
	Lvl2Boss.addSpell(new bossSpell("Summate to Infinity",8000,15));
	Lvl2Boss.addSpell(new bossSpell("Run Achilles run",5000,15));
	this.bossList.push(Lvl2Boss);
	
	var Lvl3Boss =new AI("Ein,Boss of Science",200,new BigWordShield(6));
	Lvl3Boss.addSpell(new bossSpell("Atomic bomb",6500,10));
	Lvl3Boss.addSpell(new bossSpell("Relative theory",6500,15));
	Lvl3Boss.addSpell(new bossSpell("Public paper",6500,15));
	this.bossList.push(Lvl3Boss);
	
	var Lvl4Boss =new AI("Merlin,Boss of Magic",250,new ExtremeFocus());
	Lvl4Boss.addSpell(new bossSpell("Knights of the Round",10000,20));
	Lvl4Boss.addSpell(new bossSpell("Summon Lancelot",10000,10));
	Lvl4Boss.addSpell(new bossSpell("Summon Arthur",10000,20));
	this.bossList.push(Lvl4Boss);
	
	// For later	
//	var Lvl2Boss = new AI("Lvl 2 Boss",200);
	// Push some spells.
//	this.bossList.push(Lvl2Boss);
}

BossManager.prototype.newBoss=function(boss,player,endGame){
	boss.resetCast();
	boss = this.getNextBoss();
	boss.init();
	boss.cast(boss,player,endGame);
}

// Boss currently cheats the spell engine.
function bossSpell(word,castTimer,dmg){
    this.full = word;
    this.castTimer = castTimer;
    this.power = dmg;
}
//End AI Manager




function Ability(){
}

Ability.prototype.name;
Ability.prototype.val;
Ability.prototype.container = $("#bossAbilities");
Ability.prototype.init = function(){
	if(this.val === undefined)
		this.val = "";
	this.container.html(this.name +
	" " + this.val + ":" + " ");
}
Ability.prototype.activate = function(spell){
		
}
Ability.prototype.passive = function(){
	
}

function VerbArmor(val){
	this.val = val;
	this.armorList = new Array();
}

VerbArmor.prototype = new Ability();
VerbArmor.prototype.constructor = VerbArmor;
VerbArmor.prototype.name ="Verb-Armor";
VerbArmor.prototype.init = function(){
	console.log("Ability presets init()")
	Ability.prototype.init.call(this);
	this.armorJQ = [];
	for(var i =0; i<this.val; i++){
		this.container.append(this.makeArmor(i)).animate({opacity:1},1000);
		this.armorJQ.push($("#armor" + i));
	}
}


VerbArmor.prototype.makeArmor = function(index){
	return "<div class='abilityArmor' id="+
	"'armor"+index+"'>[Verb]</div>";
}


VerbArmor.prototype.add = function(verb){
	if(this.armorList.length >= this.val)
		this.armorList.shift();
	this.armorList.push(verb);
	this.updateArmor();
}

VerbArmor.prototype.updateArmor = function(){
	for(var i=0; i<this.val; i++){
		if(this.armorList[i] !== undefined){
			if(this.armorJQ[i].html() !== ("["+this.armorList[i]+"]"))
				this.armorJQ[i].html("["+this.armorList[i]+"]");
		}
	}
}

VerbArmor.prototype.exists = function(verb){
	return this.armorList.indexOf(verb) != -1;
}

VerbArmor.prototype.activate = function(spell){
	if(spell === undefined)
		return
	if(spell.type != "Cast")
		return;
	if(this.exists(spell.word)){
		spell.modded = TRUE;
		spell.power *= .5;
	}
	else{
		this.add(spell.word);
	}
	
}

VerbArmor.prototype.reset = function(){
	this.armorList = new Array();
	this.armorJQ.forEach(function(query){
		query.html("[Verb]");
	});
}

function WordThreshold(val){
	this.val = val;
	this.armorList = new Array();
}

WordThreshold.prototype = new Ability();
WordThreshold.prototype.constructor = WordThreshold;
WordThreshold.prototype.name = "Word Threshold";
WordThreshold.prototype.activate = function(spell){
	var power = spell.power;
	var full = spell.full.replace("!","");
	var words= full.split(" ");
	var reduce =0;
	for(var i=0; i<words.length; i++){
		if(words[i].length < this.val){
			if(words[i].length > 0){
				console.log("reducing dmg from player");
				spell.power = spell.power / 2;
			}
		}
	}
	
	if(spell.power !== power)
		spell.modded = TRUE;
}
WordThreshold.prototype.init = function(){
	console.log("Ability presets init()")
	Ability.prototype.init.call(this);
	this.container.append("Be wary of length " + (this.val-1) + " or lower words");
}

WordThreshold.prototype.reset = function(){
	return ;
}



function BigWordShield(val){
	this.val = val
}
BigWordShield.prototype = new Ability();
BigWordShield.prototype.constructor = BigWordShield;
BigWordShield.prototype.name ="Big Word Shield";
BigWordShield.prototype.init = function(){
	console.log("Ability presets init()")
	Ability.prototype.init.call(this);
	this.container.append("Try words of length " + this.val + " or less.");
}
BigWordShield.prototype.activate = function(spell){
	var power = spell.power;
	var full = spell.full.replace("!","");
	var words= full.split(" ");
	var reduce =0;
	for(var i=0; i<words.length; i++){
		if(words[i].length > this.val){
			if(words[i].length > 0){
				console.log("reducing dmg from player");
				spell.power = spell.power / 3;
			}
		}else{
			spell.power *= 1.1
		}
	}
	
	if(spell.power !== power)
		spell.modded = TRUE;
}

BigWordShield.prototype.reset = function(){
	return;
}


function ExtremeFocus(){
	this.name ="Extreme Focus";
}
ExtremeFocus.prototype = new Ability();
ExtremeFocus.prototype.constructor = ExtremeFocus;
ExtremeFocus.prototype.name ="Exteme Focus";
ExtremeFocus.prototype.init= function(){
	Ability.prototype.init.call(this);
	this.container.append("This boss cannot be interrupted");
};
ExtremeFocus.prototype.activate = function(){};
ExtremeFocus.prototype.reset = function(){};