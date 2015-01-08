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
			var damage = engine.evaluate(spellQueue,player);
			if(damage !== 0)
			{
				boss.reduceHealth(damage);
				boss.healthUpdate();
			}
		}
	}
	
	// Debugging tools
	function playerDump()
	{
		console.log(player);
	}
	

	
	
	
	//$(document).on("input","#controller",printSpell);
	$(document).on("keydown","#controller",processSpell);
	setInterval(processQueue,100);
	
}







