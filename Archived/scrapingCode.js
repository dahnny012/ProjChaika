function Dictionary()
{
	//this.apiKey = "&apikey=POOixylI7Y9ZpQpYEYfF5lzd541ertPQ"; //dahnny012
	//this.apiKey = "&apikey=CkiTBNnuoIkRT5D0m1VntG9ToehTFRZz";
	//this.apiKey = "&apikey=TW7vXKdMtb94bjH46kxiDk96KDlKCjzf";
	//this.apiKey = "&apikey=5mimpv2ImuMJGArQpGpiAMg5dpbVeHye";

	
	this.apiKey = "&apikey=LwBMdDWB71X5Ulumr58CVdA2WR8W2EWc";
	//this.dict = PearsonApis.dictionaries(this.apiKey);
	//this.entries = this.dict.entries;
	
	return this;
}
	Dictionary.prototype.offset = 100;
	Dictionary.prototype.adjOffset = function(newoff){
		this.offset = newoff;
	};

	Dictionary.prototype.pearsonSearch = function(spell)
	{
		
		return this.entries.search(spell);
	};
	function makeOffset()
	{
		this.off = //128525+25;
		//292396;
		//288496
		305421;
		return this;
	}
	var offset = makeOffset();

	
	Dictionary.prototype.dTest = function () {
		console.log("worked")
	};
	
	Dictionary.prototype.buildSpell = function(spell){
		//all = true;
		spell = spell.split(" ");
		var request = [];
		var request2 = [];
		request.push("http://api.pearson.com/v2/dictionaries/entries?headword=");
		request2.push("https://api.pearson.com:443/v2/dictionaries/wordwise/entries?headword=");
		var i=0;
		if(all == true)
		{
			return "http://api.pearson.com/v2/dictionaries/entries?headword=*";
		}
		request.push("(");
		while(spell[i] != null)
		{
			console.log("spell "+spell[i]);         ;
			
			request.push(spell[i]);
			if(spell[i + 1] != null)
			{
				request.push(" ");
			}
			i++;
		}
		  request.push(")");
        return request.join("");

	};
	
	Dictionary.prototype.spellSearch = function (spell) {
		spell = this.buildSpell(spell);
        console.log(spell);
		$.ajax({
		dataType: "json",
  		url: spell,
  		success: function(output){
  		console.log(output);
  		}
		});
		//var results = this.pearsonSearch(spell);
		// search pearson dictionary for json match
		
		//console.log(results);
		//$("#dictionary").html(results);
		// for each word , in spell , find match and all its part of speech.
		// return array of single spell and its parts of speech
		// return spellSequence
	};
	var errReq = Array();
	var joffset = 0;
	Dictionary.prototype.scrape = function(){
		var temp =[];
		var base = "https://api.pearson.com/v2/dictionaries/entries?headword=(*)&offset=";
		temp.push(base);
		temp.push(offset.off);
		//alert(offset.off);
		joffset = this.offset.off;
		this.offset.off -= 25;
		if(this.offset.off <= 305421-10000)
		{
			abort();
		}
		var finish = "&limit=100" + gg.apiKey;
		temp.push(finish)
		var spell = temp.join("");
	console.log(spell);
			$.ajax({
			dataType: "json",
  			url: spell,
  			success: function(output){
				console.log(output);
  			dumpJson(output);
			},
			error:function(){
				errReq.push(joffset);
			}
			});
		/*if(this.offset >= 10000)
		{
			abort();
		}*/
	};
	var stop = 0;
	var object =0;
	var bigDig = Array();
	Dictionary.prototype.scrapeDictionary = function () {
		this.offset=0;
		stop =setInterval(this.scrape,1500);
	};
	
	function abort()
	
	{
		window.clearInterval(stop);
	}
	var masterArray = [];
	function dumpJson(json)
	{
		var data = json.results;
		object = data;
		var length = data.length;
		for(var i=0; i<length; i++)
		{
			//console.log(data[i].headword);
			//console.log(data[i].part_of_speech);
			var head = data[i].headword;
			var pos = data[i].part_of_speech;
			if(pos != undefined) {
				if (bigDig[head] == undefined) {
					var bigPos = new Array();
					bigPos[pos] = pos;
					bigDig[head] = bigPos;
				}
				else {
					bigDig[head][pos] = pos;
				}
			}

		}
	}
	var a =0;
	function printArray()
	{
		for (var prop in bigDig) {
		  if( bigDig.hasOwnProperty( prop ) ) {
		  //console.log(a++);
			//console.log("var['" + prop +"']"  + "=\""+bigDig[prop] + "\"");
			 // $("#dictionary").append(prop + " : ");
			  for(var prop2 in bigDig[prop])
			  {
				//console.log(a++);
				  if( bigDig[prop].hasOwnProperty( prop2 ) ) {
					  prop2 = prop2.split(",");
					  var length = prop2.length;
					  for(var k =0; k<length; k++)
					  {
						prop2[k] = compress(prop2[k]);
						var word = "a[\"" + prop +"\"]" + "[\""+ prop2[k] +"\"]" + "='"+ prop2[k] + "';\n";
						$("#dictionary").append(word);
					  }

				  }
			  }
			  $("#dictionary").append("<br>");
		  } 
		}
	}

	function preArray()
	{
		for (var prop in bigDig) {
		  if( bigDig.hasOwnProperty( prop ) ) {
			var word = "a[\"" + prop +"\"]" + "=[];";
			$("#dictionary").append(word);
			$("#dictionary").append("<br>");
		}
		}
	}
	
	function compress(pos)
	{
		pos = pos.trim();
		switch(pos){
		case 'adjective':
			return 'adj';
		break;
		case 'noun':
			return 'n';
		break;
		case 'preposition':
			return 'prep';
		break;
		case 'verb':
			return 'v';
		break;
		case 'adverb':
			return 'adv';
		break;
		case 'plural noun':
			return 'pln';
		break;
		case 'conjunction':
		case 'conj':
			return 'cj';
		break;
		case 'interjection':
		case 'interj':
			return 'ij';
		break;
		case 'possessive':
			return 'ps';
		break;
		case 'pronoun':
			return 'pn';
		break;
		case 'reflexive pronoun':
			return 'rfn';
		break;
		case 'phrasal verb':
			return 'pv';
			break;
		case 'sfx':
			return 'sfx';
			break;
		case 'prefix':
			return 'pfx';
			break;
		case 'number':
		case 'num':
		case 'determiner':
		case 'quant':
			return 'num';
			break;
		case 'short form of'
			return 'sht';
		break;
		default:
			console.log(pos);
			return pos;
		}
	}


	
	
	
	

