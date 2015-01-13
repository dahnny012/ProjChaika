function mainController()
{
	//contains story controller
	//contains battle controller
	//controls when story and battle controller are active.
	
}



function storyController()
{
	//contains the diaglogue tree
	//has a persistent pointer to dialogue tree
}

var cDebug;
function BattleController()
{
	var spellBook = new Dictionary();
	var engine = new SpellEngine();
	var player = new Human("Name",100);
	var suggestions = new Suggestions();
	var tutorial;
	var boss;
	var bossManager = new BossManager();
	var spellQueue = new Array();
	var stopGame;

	function processSpell(event){
		if(event.which == ENTER)
		{	
			var spell = $("#controller").val();
			$("#controller").val(null);
			spell = spellBook.spellSearch(spell);
			if(spell.errors.length >0){
				console.log(spell.errors);
				console.log("Printing to error log");
				errorLog(spell.errors);
			}
			spellQueue.push(spell);
			if(event.data !== undefined){
				processQueue(event.data.boss);}
			else{
				processQueue(); }
				
		}
	}
	
	
	// In later refactor boss will be using spell engine as well.
	function processQueue(boss)
	{
		console.log("EVENT");
		console.log(boss);
		if(spellQueue.length !== 0){
			var spell = engine.evaluate(spellQueue,player);
			if(spell === undefined)
			{
				console.log("You done fked");
				// <No matches>
			}
			else if(spell.type == "Weapon"){
				weaponLog(spell,"playerLog",player);
			}
			else if(spell.power !== 0 && spell !== 0)
			{
				if(boss !== undefined)
					boss.reduceHealth(spell.power);
				if(spell.type == "Cast")
					battleLog(spell,"playerLog",player);
			}
		}
	}
	
	function battleStart(boss)
	{
		boss = bossManager.getNextBoss();
		boss.init();
		$(document).on("keydown","#controller",{boss:boss},processSpell);
		boss.cast(boss,player);
		suggestions.bar.countDown(suggestions.bar,suggestions,
		function(suggestions){
			suggestions.fillBank();
			suggestions.container.show()}
		);
	}
	//battleStart(boss);
	function tutorialStart(tutorial,suggestions){
		tutorial = new Tutorial();
		$(document).on("keydown","#controller",processSpell);
		suggestions.bar.countDown(suggestions.bar,suggestions,
		function(suggestions){
			suggestions.fillBank();
			suggestions.container.show();
			
		});
		
	}
	tutorialStart(tutorial,suggestions);
	function playerDump()
	{
		console.log(player);
	}
}


// Logging stuff
function battleLog(spell,type,mage)
{
	var div = "<div class='"+type+"'>";
	var log = "[" + mage.name + "]:" + " " + spell.full;
	if(spell.base !== undefined)
	{
		log += " " + spell.base;
	}
	var dmg = "&#60;"+spell.power.toFixed(2)+"&#62";
	var close ="</div>";
	var node = div + log + dmg + close;
	printLog(node);
}
function dmgBracket(dmg){
	return "&#60;"+dmg+"&#62";
}

function weaponLog(weapon,type,mage)
{
	var div = "<div class='"+type+"'>";
	var log = "[" + mage.name + "]:" + "Created "+ dmgBracket("The "+ weapon.full);
	var close ="</div>";
	var node = div + log + close;
	printLog(node);
	
}

function errorLog(errors)
{
	var div = "<div class='errorLog'>";
	// For each error
	// SpellBook Error: <word>,<word>
	var log = "SpellBook Error: "
	log += errors.map(function(element){
		return dmgBracket(element);
	}).join(" ");
	var close = "</div>";
	var node = div + log + close;
	printLog(node);
}

function printLog(node){
	$("#battleLog").append(node);
	$("#battleLogWrapper").scrollTop($("#battleLog").height());
}
// Debugging tools





