
function Story(boss,player,suggestions,mgr)
{
	this.init();
	this.gui = new GuiUtils();
	this.boss = boss;
	this.player = player;
	this.suggestions = suggestions;
	this.mgr = mgr;
}

Story.prototype.status = NOBOSS;
Story.prototype.container = $("#storyContainer");
Story.prototype.step = STORYSTART;//INPROGRESS;
Story.prototype.queue = [];
Story.prototype.init = function(){
	this.turnOn("#start");
    var story = this;
	this.container.on("keydown",{story:story},story.continue);
    //setTimeout(function(story){story.loadNext()},5000,story);
}
Story.prototype.continue = function(e){
    console.log("FF");
    var story = e.data.story;
    if(e.which == ENTER)
    {
        //story.queue.forEach(function(e){
            //e.toggle();
        //})
        switch(story.step){
            case 14:
            case 25:
            case 34:
            case 45:
                console.log("UNbinding")
                story.container.unbind();
                story.status = BOSS;
                story.loadBossGui();
                break;
            default:
                story.status = NOBOSS;
                story.loadNext();
                story.step++;
        }
        
    }
}
Story.prototype.turnOn = function(query){
	query = $(query);
	query.slideToggle("500",function(){
	    $("#storyContainer").scrollTop($("#story").height());
	});
	this.queue.push(query);
	
}
Story.prototype.loadNext = function(){
    var pEmpty = $("#prompt"+this.step).length === 0;
    var storyEmpty = $("#story"+this.step).length === 0;
    console.log("this step:" + this.step);
    this.checkFade();
    if(this.step == STORYDONE){
        alert("GG");
    }   
    else if(!pEmpty){
        this.turnOn("#prompt"+this.step);
    }
    else if(!storyEmpty){
        this.turnOn("#story"+this.step)
        //this.step++;
        //this.loadNext();
        //var story = this;
        //setTimeout(function(story){story.loadNext()},5000,story);
    }
}


Story.prototype.clearQueue = function(){
    this.queue.forEach(function(e){
        e.slideToggle("100");
    });
    this.queue = [];
}

Story.prototype.chapters =["Ruins of Spere",
"Ruins of Zeno","Ruins of Ein","Ruins of Merlin"];
Story.prototype.checkFade = function(){
    switch(this.step){
        case 10:
        case 19:
        case 29:
        case 38:
            this.clearQueue();
            this.gui.fadeBlack(this.chapters.shift());
            break;
        case 57:
            this.clearQueue();
            this.gui.blackOut("End of Prologue");
    }
}

Story.prototype.loadBossGui = function(){
    this.turnOn("#bossWrapper");
    this.container.slideToggle("100",function(){});
}



function start(){
   var battle = new BattleController(STORY); 
};
start();