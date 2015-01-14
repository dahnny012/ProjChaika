var ENTER = 13;
var MAXRANDS = 3;
var MAXLINES = 65000;
var SUGGESTIONCD = 10;
var LOADCOMPLETE = 1;
var WORD = 0;
var POS = 1;
var DONE = 28;
var INPROGRESS = 2;

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



// Css helping functions
function getWidth(query){
	return $(query).css("width");
}
function numToPx(num)
{
	return num + "px";
}
function pxToNum(px){
    if(px === undefined)
        return 0;
	return parseFloat(px.substr(0,px.search("px")));
}