function guiUtils()
{
    
}

guiUtils.prototype.flashScreen = function(){
    
    var body = $("body")
    var node = document.createElement("div");
    node.id = "flashScreen";
    node.style.width = body.css("width");
    node.style.height=body.css("height");
    node.style.opacity = ".5";
    node.style.background="red";
    node.style.position ="absolute";
    node.style.top = "0px";
    node.style.left="0px";
    body.append(node);
    setTimeout(function(){
        $("#flashScreen").hide();
    },100);
}

guiUtils.prototype.deathScreen = function(){
    var body = $("body")
    var node = document.createElement("div");
    node.id = "flashScreen";
    node.style.width = "100%";
    node.style.height= "100%";
    node.style.opacity = ".8";
    node.style.background="black";
    node.style.position ="absolute";
    node.style.top = "0px";
    node.style.left="0px";
}



