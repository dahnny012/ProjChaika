function mainController()
{
	//contains story controller
	//contains battle controller
	//controls when story and battle controller are active.
	
}


var cDebug;
function BattleController(type)
{
	var spellBook = new Dictionary();
	var engine = new SpellEngine();
	var player = new Human("Chaika",100);
	var suggestions = new Suggestions();
	var tutorial;
	var boss;
	var bossManager = new BossManager();
	var spellQueue = new Array();
	var gameType = type;
	var story;
	function main(){
		gameType = type;
		switch(type){
			case TUTORIAL:
				tutorialStart(tutorial,suggestions,boss,player);
				break;
			case STORY:
				storyStart(boss,player,suggestions,bossManager);
		}
	}
	main();
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
			if(spell !== undefined)
				spellQueue.push(spell);
			if(event.data !== undefined){
				processQueue(event.data.boss,
				event.data.tutorial);}
			else{
				processQueue(); }
				
		}
	}
	
	
	// In later refactor boss will be using spell engine as well.
	function processQueue(boss,tutorial)
	{
		console.log("EVENT");
		console.log(boss);
		console.log(tutorial);
		if(spellQueue.length !== 0){
			var spell = engine.evaluate(spellQueue,player,boss);
			if(spell === undefined)
			{
				console.log("You done fked");
				// <No matches>
			}
			else if(spell.type == "Weapon"){
				weaponLog(spell,"playerLog",player,boss);
			}
			else if(spell !== 0){
				if(boss !== undefined){
					boss.reduceHealth(spell.power);
					battleLog(spell,"playerLog",player,boss);
					if(boss.health <= 0 && boss.name !== "Training Dummy"){
						switch(gameType){
							case TUTORIAL:
								clearBoss();
								tutorial.reload();
								break;
							case STORY:
								story.procede();
								unloadSuggestions(suggestions);
								toggleBattleLog();
								unloadBoss();
								checkStory(story,suggestions,boss,player);
						}
						player.resetHealth();
					}
				}
			}
		}
	}
	
	function storyStart(){
		story=new Story();
		setTimeout(checkStory,1000,story,suggestions,boss,player);
	}
	
	function battleStart(boss,player,suggestions)
	{
		console.log("battle start");
		boss = bossManager.getNextBoss();
		if(boss.name == "Potato,Boss of Potatoes")
			boss = bossManager.getNextBoss();
		boss.init();
		$(document).unbind().on("keydown","#controller",{boss:boss},processSpell);
		player.init();
		boss.cast(boss,player,endGame);
		suggestions.bar.countDown(suggestions.bar,suggestions,
		function(suggestions){
			suggestions.fillBank();
			suggestions.container.show()}
		);
	}
	//battleStart(boss,player,suggestions);
	function tutorialStart(tutorial,suggestions,boss,player){
		tutorial = new Tutorial();
		boss = loadDummyAI(boss);
		$("#controller").on("keydown",{boss:boss},processSpell);
		setTimeout(checkTutorial,1000,tutorial,suggestions,boss,player);
	}
	//tutorialStart(tutorial,suggestions,boss,player);
	
	function loadDummyAI(boss){
		boss = new DummyAI();
		boss.init();
		return boss;
	}
	function loadTutorialBoss(boss,tutorial){
		boss = bossManager.getNextBoss();
		boss.init();
		boss.type = "Tutorial";
		$("#controller").unbind().on("keydown",{boss:boss,tutorial:tutorial},processSpell);
		boss.cast(boss,player,endGame);
	}
	function loadSuggestions(suggestions){
		$("#suggestionsWrapper").show();
	}
	function unloadSuggestions(suggestions){
		$("#suggestionsWrapper").hide();
		suggestions.bar.width = suggestions.bar.maxWidth;
		suggestions.bar.stop = TRUE;
	}
	
	function toggleBattleLog(){
		$("#battleLog").html("");
		$("#battleLogWrapper").slideToggle("100");
	}
	
	function unloadBoss(){
		$("#bossWrapper").hide("100");
	}
	function checkTutorial(tutorial,suggestions,boss,player){
		if(tutorial.status == DONE){
			player.init();
			loadTutorialBoss(boss,tutorial);
			loadSuggestions(suggestions);
			suggestions.bar.countDown(suggestions.bar,suggestions,
			function(suggestions){
			suggestions.fillBank();
			suggestions.container.show()}
			);
		}
		else{
			setTimeout(checkTutorial,1000,tutorial,suggestions,boss,player);
		}
	}
	
	function checkStory(story,suggestions,boss,player){
		if(story.status == BOSS){
			console.log("loading boss");
			if(player !== undefined)
				player.reset();
			if(boss !== undefined)
				boss.reset();
			battleStart(boss,player,suggestions);
			loadSuggestions(suggestions);
			toggleBattleLog();
			story.status = BATTLE;
		}
		else{
			setTimeout(checkStory,500,story,suggestions,boss,player);
		}
	}
	
	function playerDump()
	{
		console.log(player);
	}
	function endGame(boss,player){
    	if (confirm("Would you like to retry?") == true) {
    		player.gui.deathScreen();
    		boss.reset();
    		player.reset();
    		boss.cast(boss,player,endGame);
    	} else {
        	endGame(boss,player);
    	}
	}
	function clearBoss(){
		$("#bossWrapper").toggle("100");
	}
	function endTutorial(tutorial){
		tutorial.reload();
	}
}


// Logging stuff
function battleLog(spell,type,mage,boss)
{
	var div = "<div class='"+type+"'>";
	var log = "[" + mage.name + "]:" + " " + spell.full;
	var dmg = "&#60;"+spell.power.toFixed(2)+"&#62" + checkMod(spell,boss);
	var close ="</div>";
	var node = div + log + dmg + close;
	printLog(node);
}
function dmgBracket(dmg){
	return "&#60;"+dmg+"&#62";
}

function weaponLog(weapon,type,mage,boss)
{
	var div = "<div class='"+type+"'>";
	var log = "[" + mage.name + "]:" + "Created "+ dmgBracket("The "+ weapon.full)
	+ checkMod(weapon,boss);
	var close ="</div>";
	var node = div + log + close;
	printLog(node);
	
}

function errorLog(errors)
{
	var div = "<div class='errorLog'>";
	// For each error
	// SpellBook Error: <word>,<word>
	var log = "Not in Spellbook: "
	log += errors.map(function(element){
		return dmgBracket(element);
	}).join(" ");
	var close = "</div>";
	var node = div + log + close;
	printLog(node);
}
function checkMod(spell,boss){
	if(boss !== undefined && spell.modded)
		return "(" + boss.ability.name +")";
	return "";
}

function printLog(node){
	$("#battleLog").append(node);
	$("#battleLogWrapper").scrollTop($("#battleLog").height());
}
// Debugging tools





