function Story()
{
	this.init();
}

Story.prototype.container = $("#storyContainer");
Story.prototype.step = 3;//INPROGRESS;
Story.prototype.queue = [];
Story.prototype.init = function(){
	this.turnOn("#start");
	this.loadNext();
}
Story.prototype.turnOn = function(query){
	query = $(query);
	query.slideToggle("500");
	this.queue.push(query);
}
Story.prototype.loadNext = function(){
    var pEmpty = $("#prompt"+this.step).length === 0;
    var storyEmpty = $("#story"+this.step).length === 0;
    if(this.step == 50){
        alert("GG");
    }   
    else if(!pEmpty){
        this.turnOn("#c"+this.step);
    }
    else if(!storyEmpty){
        this.turnOn("#intro"+this.step)
        this.step++;
        this.loadNext();
    }
}