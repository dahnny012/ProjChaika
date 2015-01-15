function Tutorial()
{
    this.init();
}


Tutorial.prototype.container=$("#mainWrapper");

Tutorial.prototype.step = INPROGRESS;
 
Tutorial.prototype.queue = [];

Tutorial.prototype.init = function(){
    this.turnOn("#start");
    this.turnOn("#c" + this.step);
    var tut = this;
    this.container.on("keydown",{tut:tut},tut.continue);
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
    if(this.step == DONE){
        this.unloadDummy();
        this.container.unbind();
        this.loadBossGui();
        this.loadSuggestions();
    }   
    else if(!cEmpty){
        this.turnOn("#c"+this.step);
        if(this.step == 4)
            this.loadPlayerGui();
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


Tutorial.prototype.loadBossGui = function(){
    this.status = DONE;
    this.turnOn("#bossWrapper");
    this.container.slideToggle("100",function(){});
};
Tutorial.prototype.loadPlayerGui = function(){
    $("#battleLogWrapper").slideToggle("100",function(){});
    $("#playerWrapper").slideToggle("100",function(){});
};

Tutorial.prototype.loadSuggestions = function(){
    $("#suggestionsWrapper").slideToggle("100",function(){});
}

Tutorial.prototype.unloadDummy = function(){
    $("#dummyWrapper").slideToggle("100",function(){});
}