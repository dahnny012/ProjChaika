function Suggestion(){
    
}

Suggestion.prototype.init = function(){
    // Call fill database
} 

// Singleton
Suggestion.prototype.bank = [];


Suggestion.prototype.refresh = function(){
    // set bank to 0.
    // fill database
}
Suggestion.prototype.fillBank = function(n,range){
    var rands = genRandNums(n,range);
    var promise = sendRands(rands);
    setPromiseTimer(promise);   
}


function genRandNums(n,range){
    var nums = new Array(n);
    for(var i=0; i<n; i++){
        var rand = Math.floor((Math.random() * range) + 1);
        while(nums.indexOf(rand) > -1)
         rand = Math.floor((Math.random() * range) + 1);
        nums[i] = rand;
    }
    return nums.join(",");
}

function sendRands(rands){
    return $.ajax({
        type:"GET",
        url:"suggestion.php",
        data:{randNums:rands}});
}

function checkRandPromise(promise)
{
    if(promise.success)
    {
        
    }
    else{
    setPromiseTimer(promise);    
    }
}

function setPromiseTimer(promise){
    setTimeout(checkRandPromise,100,promise);
}
