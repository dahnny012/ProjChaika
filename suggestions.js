var MAXRANDS = 5;
var MAXLINES = 65000;

function Suggestions(){
    this.fillBank(MAXRANDS,MAXLINES);
}

// Singleton
Suggestions.prototype.bank = [];


Suggestions.prototype.container = "#container";

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
    $(this.container).html("");
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
	var word = dmgBracket(suggestion.word);
	var pos = dmgBracket(suggestion.pos)
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
    obj.pos = data[1];
    return obj;
};

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
function dmgBracket(dmg){
	return "&#60;"+dmg+"&#62";
}