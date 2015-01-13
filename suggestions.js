var MAXRANDS = 5;
var MAXLINES = 65000;
var SUGGESTIONCD = 3;
var LOADCOMPLETE = 1;

function Suggestions(){
    this.bar = new SuggestionBar();
    this.container.hide();
    //this.fillBank(MAXRANDS,MAXLINES);
}

// Singleton
Suggestions.prototype.bank = [];

Suggestions.prototype.container = $("#suggestions");

Suggestions.prototype.refresh = function(){
    this.bank = [];
    this.fillBank(MAXRANDS,MAXLINES);
}
Suggestions.prototype.fillBank = function(n,range){
    if(n===undefined)
        n = MAXRANDS;
    if(range===undefined)
        range = MAXLINES;
    var rands = this.genRandNums(n,range);
    var promise = this.sendRands(rands);
    this.clear();
    setPromiseTimer(promise,this);   
}

Suggestions.prototype.clear = function(){
    this.container.html("");
}
Suggestions.prototype.genRandNums = function(n,range){
    this.n = n;
    this.range = range;
    var nums = new Array(n);
    for(var i=0; i<n; i++){
        var rand = Math.floor((Math.random() * range) + 1);
        while(nums.indexOf(rand) > -1)
         rand = Math.floor((Math.random() * range) + 1);
        nums[i] = rand;
    }
    return nums.join(",");
}

Suggestions.prototype.sendRands = function(rands){
    return $.ajax({
		type:'GET',
  		url: 'suggestions.php',
		data: { randNums: rands },
		error: function(xhr, status, error,output)
		{
		    console.log("ERROR");
			 console.log(error);
			 console.log(output);
		}
		});
}


		


Suggestions.prototype.makeNode=function(suggestion){
    var div = "<div class= 'suggestion'>";
	var word = suggestion.word;
	var pos = suggestion.pos;
	var close ="</div>";
	var node = div + word + "<br>"+ pos + close;
	return node;
}

Suggestions.prototype.write = function(data){
    for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
        var pair = Suggestion(data[prop]);
        var node = this.makeNode(pair);
        $(this.container).append(node);
    }
    }
}
function Suggestion(data){
    var obj = {};
    data = data.split(":");
    obj.word = data[0];
    obj.pos = fixPos(data[1]);
    return obj;
};

function fixPos(pos){
    pos = pos.split(",");
	pos = pos.map(
	    function (elements){
	        // Dictionary.js
			return convert(elements);
		});
				
	    var empty = [];
				
		// Get rid of duplicates
		pos.forEach(function(element){
	    if(empty.indexOf(element) === -1){
		    empty.push(element)
	    }});
				
				//Merge back together
		pos = empty;
		pos = pos.join(",");
		return pos;
}

function SuggestionBar(){
    this.val = SUGGESTIONCD;
    this.startTimer = this.val * 1000;
    this.timer = this.startTimer;
    this.startWidth = 0; 
    this.width = pxToNum(this.barId.css("width"));
}

SuggestionBar.prototype.cdId = $("#suggestCd");
SuggestionBar.prototype.barId = $("#suggestionBar");
SuggestionBar.prototype.countDown=function(bar,suggestions,cb){
    bar.update(bar.timer);
     if(bar.timer <= 0){
         cb(suggestions);
        bar.timer = bar.startTimer;
        
        bar.countDown(bar,suggestions,cb);
        return LOADCOMPLETE;
        
     }
     else{
        bar.timer -= FPS30;
        setTimeout(bar.countDown,FPS30,bar,suggestions,cb);
     }
}
SuggestionBar.prototype.update= function(num){
    // Do width shit
    //console.log("update");
    var percent = (this.startTimer - num)/this.startTimer;
    //console.log(percent);
    var amount = percent * this.width;
    //console.log(amount);
    this.startWidth = amount * percent;
    var val = this.val - (this.startTimer - this.timer)/1000;
    if(this.startWidth >= this.width){
        this.startWidth = this.timerWidth;
        val = 0;
    }
    this.cdId.html(val.toFixed(0)+"s");
    this.barId.css("width",this.startWidth);
}




function checkRandPromise(promise,Suggestions)
{
    promise.success(function(data){
        if(data !== ""){
            data = JSON.parse(data);
            Suggestions.bank = data;
            Suggestions.write(data);
        }
        else{
        setPromiseTimer(promise,Suggestions);    
        }
    });
}

function setPromiseTimer(promise,Suggestions){
    setTimeout(checkRandPromise,10,promise,Suggestions);
}