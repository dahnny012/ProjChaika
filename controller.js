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
	var player = new Human();
	var boss = new AI("#bossHealth");
	console.log(boss.health);
	var spellQueue = new Array();
	function printSpell() {
		var spell = $("#controller").val();
		$("#spellDisplay").html(spell);
	}
	
	function processSpell(event){
		if(event.which == 13)
		{	
			var spell = $("#controller").val();
			$("#controller").val(null);
			spell = spellBook.spellSearch(spell);
			spellQueue.push(spell);
			cDebug = spellQueue;
			//var promise = spellBook.spellSearch(spell);
			//checkResults(promise,spell);
			
		}
	}
	function checkResults(promise,spell)
	{
		setTimeout(checkPromise(promise,spell),100);
	}
	
	function processQueue()
	{
		if(spellQueue.length != 0){
			var damage = engine.evaluate(spellQueue,player);
			if(damage !== 0)
			{
				boss.reduceHealth(damage);
				boss.update();
			}
		}
	}
	
	function dumpQueue()
	{
		console.log(player);
	}
	
	function checkPromise(promise,spell)
	{
		promise.success(function(data){
		if(data != undefined)
		{
			console.log(data);
			if(data != "")
			{
				data = JSON.parse(data);
			}
			//console.log(data);
			spellQueue.push(data);
		}
		else
		{
			checkResults(promise,spell);
		}
		});
	}
	
	
	
	$(document).on("input","#controller",printSpell);
	$(document).on("keydown","#controller",processSpell);
	$(document).on("click","#queue",dumpQueue);
	setInterval(processQueue,100);
}







