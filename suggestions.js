var MAXRANDS = 10;
var MAXLINES = 65000;

function Suggestions(){
    this.fillBank(MAXRANDS,MAXLINES);
}
Suggestions.prototype.n;
Suggestions.prototype.range;

// Singleton
Suggestions.prototype.bank = [];


Suggestions.prototype.refresh = function(){
    this.bank = [];
    this.fillBank()
}
Suggestions.prototype.fillBank = function(n,range){
    var rands = this.genRandNums(n,range);
    var promise = this.sendRands(rands);
    setPromiseTimer(promise,this);   
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
        type:"GET",
        url:"suggestions.php",
        data:{randNums:rands}});
}

Suggestions.prototype.log=function(suggestion){
    var div = "<div class= 'suggestion'>";
	var word = dmgBracket(suggestion.word);
	var pos = dmgBracket(suggestion.pos)
	var close ="</div>";
	var node = div + word + pos + close;
}

function checkRandPromise(promise,Suggestions)
{
    promise.success(function(data){
        if(data !== undefined){
            Suggestions.bank = data;
            console.log(Suggestions.bank);
        }
        else{
        setPromiseTimer(promise);    
        }
    })
}

function setPromiseTimer(promise,Suggestions){
    setTimeout(checkRandPromise,100,promise,Suggestions);
}
