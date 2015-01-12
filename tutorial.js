function Tutorial()
{
    this.hideAll();
}



Tutorial.prototype.hideAll = function(){
    $(".continue").hide();
    $(".text").hide();
}

Tutorial.prototype.init = function(){
    
}