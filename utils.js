var ENTER = 13;
var MAXRANDS = 4;
var MAXLINES = 112000;
var SUGGESTIONCD = 10;
var LOADCOMPLETE = 1;
var WORD = 0;
var POS = 1;
var DONE = 28;
var INPROGRESS = 2;
var TRUE = 1;
var FALSE = 0;
var STORYSTART = 3;
var STORYDONE = 59;
var TUTORIAL= 2;
var STORY = 1;
var NOBOSS = 0;
var BOSS = 1
var BATTLE =2;
var STOP = 1;
function GuiUtils()
{
    
}

GuiUtils.prototype.flashScreen = function(){
    
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
        $("#flashScreen").remove();
    },100);
}

GuiUtils.prototype.deathScreen = function(){
    var body = $("body")
    var node = document.createElement("div");
    node.id = "deathScreen";
    node.style.width = "100%";
    node.style.height= "100%";
    node.style.opacity = ".5";
    node.style.background="black";
    node.style.position ="absolute";
    node.style.top = "0px";
    node.style.left="0px";
    body.append(node);
}

GuiUtils.prototype.removeDeathScreen = function(){
    $("#deathScreen").remove();
}


GuiUtils.prototype.fadeBlack = function(string){
    // pretend the black element is there.
    
    $("#fadeBlack").html(string);
    $("#fadeBlack").show().animate({opacity:"1"},2000,function(){
        setTimeout(function() {
            $("#fadeBlack").animate({opacity:"0"},1000,function(){
                $("#fadeBlack").hide();
            });
        }, 1000);
    });
}

GuiUtils.prototype.blackOut=function(string){
    $("#fadeBlack").html(string);
    $("#fadeBlack").show().animate({opacity:"1"},2000,function(){
        setTimeout(function() {
            $("#fadeBlack").html("Wake up");
            setTimeout(function(){
                $("#fadeBlack").html("Wake up!");
                setTimeout(function(){
                    $("#fadeBlack").animate({"opacity":"0"},function(){
                        $("#fadeBlack").hide();
                    })
                },1000)
            },2000)
        }, 3000);
    });
}

GuiUtils.prototype.credits = function(string){
    // pretend the black element is there.
    
    $("#fadeBlack").html(string);
    $("#fadeBlack").show().animate({opacity:"1"},2000,function(){
    });
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