function Tutorial()
{
    this.init();
}

Tutorial.prototype.done = INPROGRESS;

Tutorial.prototype.container=$("#mainWrapper");

Tutorial.prototype.step = 2;
 
Tutorial.prototype.queue = [];

Tutorial.prototype.init = function(){
    this.turnOn("#start");
    this.turnOn("#c" + this.step);
    var tut = this;
    $("#mainWrapper").on("keydown",{tut:tut},tut.continue);
};


Tutorial.prototype.continue = function(e){
    console.log("FF");
    var tut = e.data.tut;
    if(e.which == ENTER)
    {
        tut.queue.forEach(function(e){
            e.toggle();
        })
        tut.queue = []
        tut.step++;
        tut.loadNext();
    }
}

Tutorial.prototype.loadNext = function(){
    var cEmpty = $("#c"+this.step).length === 0;
    var instrEmpty = $("#intro"+this.step).length === 0;
    if(this.step == 28)
    {
        this.done = DONE;
        this.turnOn("#bossWrapper");
        this.container.slideToggle("100",function(){});
    }
    else if(!cEmpty){
        this.turnOn("#c"+this.step);
        if(this.step == 4){
            $("#battleLogWrapper").slideToggle("100",function(){});
            $("#playerWrapper").slideToggle("100",function(){});
        }
    }
    else if(!instrEmpty){
        this.turnOn("#intro"+this.step)
        this.step++;
        this.loadNext();
    }
}

Tutorial.prototype.turnOn = function(query){
    query = $(query);
     query.slideToggle("100",function(){});
    this.queue.push(query);
}


