
function Story()
{
	this.init();
}

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
    var tut = e.data.story;
    if(e.which == ENTER)
    {
        tut.queue.forEach(function(e){
            //e.toggle();
        })
        tut.queue = []
        tut.loadNext();
        tut.step++;
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

function start(){
   var battle = new BattleController(STORY); 
};
start();