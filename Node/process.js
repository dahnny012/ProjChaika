var Reader = require("line-by-line");
var fs = require("fs");
var reader = new Reader("newBank.txt");

var numLines = 100000;
var maxLines = numLines;
var buffer = {};
buffer.constructor = undefined;

reader.on('error', function (err) {
    // 'err' contains error object
});

reader.on('line', function (line) {
    var data = new Array();
	fillData(line);
	//console.log(buffer);

	/*if(exist)
	{
		// update pos.
	}
	else
	{
		
	}*/
	
	numLines--;
	if(numLines == 0)
	{
		buffer = JSON.stringify(buffer);
		fs.writeFileSync("temp.json", "var a = " + buffer);
		process.exit(1);
	}
});

reader.on('end', function () {
    // All lines are read, file is closed now.
});



function fillData(line)
{
	if(line == "")
	{
		return;
	}
	var modLine = line.split(":");
	if(modLine[0] == undefined || modLine[1] == undefined)
	{
		console.log("Original: " + line);
		console.log("Modded: " + modLine);
		console.log(maxLines - numLines);
		return;
	}
	var word = modLine[0].trim();
	var pos= modLine[1].trim();
	var wordPair =buffer["'"+word+"'"];
	//console.log(buffer["'"+word+"'"]);
	if(	wordPair == undefined)
	{
		buffer["'"+word+"'"] = pos;
		//console.log("Pair not found");
	}
	else
	{
	//	console.log(buffer["'"+word+"'"]);
	//	console.log("Pair exists");
		var currentPos = wordPair.split(",");
		var newPos = pos.split(",");
		
		for(var i=0; i<newPos.length; i++){
	//		console.log("element " + newPos[i]);
			element = convert(newPos[i]);
			if(currentPos.indexOf(element) < 0 && element !== '')
			{
				currentPos.push(element);
	//			console.log("Added " + element);
			}
		
		}
		buffer["'"+word+"'"] = currentPos.join(",");
	//	console.log(buffer["'"+word+"'"]);
	}
}


function convert(pos)
{
	pos = pos.trim();
	switch(pos){
		case 'adjective':
		case 'adj':
		case 'adje':
			return 'adj';
		case 'noun':
    	case 'n':
		case 'non':
			return 'n';
		case 'verb':
    	case 'v':
			return 'v';
		case 'adverb':
    	case 'adv':
		case 'ad':
		case 'adveb':
			return 'adv';
		case 'prep'
			return 'prep'
		default:
			console.log(pos + " not in parsed, Line: " + (maxLines-numLines));
       		return '';
		}
}