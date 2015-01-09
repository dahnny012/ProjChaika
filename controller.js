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
	
	// For testing. Wont be hardcoded later
	var boss = new AI("Boss Name",200,3000);
	
	// Queue of spell requests by player. Should do boss too....In later refactor
	var spellQueue = new Array();
	var stopGame;

	function processSpell(event){
		// 13 -> enter
		if(event.which == 13)
		{	
			var spell = $("#controller").val();
			$("#controller").val(null);
			spell = spellBook.spellSearch(spell);
			spellQueue.push(spell);
		}
	}
	
	
	// In later refactor boss will be using spell engine as well.
	function processQueue()
	{
		if(spellQueue.length !== 0){
			var spell = engine.evaluate(spellQueue,player);
			console.log(spell);
			if(spell.power !== 0)
			{
				boss.reduceHealth(spell.power);
				boss.healthBarUpdate();
				
				battleLog(spell,"playerLog",player);
			}
		}
	}
	
	/*function processBossQueue()
	{
		if(boss.castQueue.length !== 0)
		{
			var bossSpell = {};
			var spellToken = boss.castQueue.pop();
			bossSpell.full = spellToken[0];
			bossSpell.dmg = spellToken[1];
			player.reduceHealth(bossSpell.dmg);
			battleLog(bossSpell,"bossLog",boss);
			boss.cast(bossSpell.full,boss);
		}
	}*/
	
	function battleStart()
	{
		$(document).on("keydown","#controller",processSpell);
		setInterval(processQueue,100);
		//setInterval(processBossQueue,100);
		//boss.cast("Some Spell",boss,player);
	}
	battleStart();
	
	
	
	function playerDump()
	{
		console.log(player);
	}

	//$(document).on("input","#controller",printSpell);
	
}

function battleLog(spell,type,mage)
{
	var div = "<div class='"+type+"'>";
	var log = "[" + mage.name + "]:" + " " + spell.full;
	var dmg = "&#60;"+spell.power+"&#62";
	var close ="</div>";
	var node = div + log + dmg + close;
	$("#battleLog").append(node);
	$("#battleLogWrapper").scrollTop($("#battleLog").height());
}

// Debugging tools





