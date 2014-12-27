function Dictionary()
{
	
}

	Dictionary.prototype.db = db;

	Dictionary.prototype.buildQuery = function(spell){
		spell = spell.split(" ");
        return spell

	};
	
	
	
	Dictionary.prototype.PHPspellSearch = function (spell) {
	console.log("stage 1 cleared");
		spell = this.buildQuery(spell);
		return $.ajax({
		type:'GET',
  		url: 'process.php',
		data: { data: spell },
		/*success: function(output){
			console.log(output);
		},*/
		error: function(xhr, status, error,output)
		{
			 console.log(error);
			 console.log(output);
		}
		});
	};
	
	
	
	Dictionary.prototype.spellSearch = function(spell)
	{
		var list = spell.split(" ");
		list = list.map(function(word){
			var modWord = dbFormat(word);
			if(db[modWord] !== 0)
			{
				console.log("found one");

				console.log(db[modWord]);
				
				var pos = db[modWord].split(",");
				var spell = new Array();
				spell[0] = word;
				
				
				//
				pos = pos.map(function (elements){
					return convert(elements);
				});
				
				
			   var empty = [];
				
				// Get rid of duplicates
			   pos.forEach(function(element){
			   if(empty.indexOf(element) === -1){
			   	empty.push(element)
			   }});
				pos = empty;
				pos = pos.join(",");
				return [word,pos];
			}
		})
		return list
	}
	
	
function dbFormat(word)
{
		return "'" + word + "'";
}
	
function convert(pos)
{
		pos = pos.trim();
		switch(pos){
		case 'adjective':
		case 'adj':
		case 'adje':
		case 'adxj':
		case 'determine':
		case 'number':
		case 'num':
		case 'numbe':
		case 'nm':
		case 'numbr':
		case 'determinr':
		case 'determiner':
		case 'quantifir':
		case 'quantifier':
		case 'quat':
		case 'quant':
			return 'adj';
		case 'noun':
		case 'pnon':
		case 'pn':
    	case 'n':
		case 'non':
		case 'pron':
		case 'pronon':
		case 'prn':
			return 'n';
		case 'verb':
    	case 'v':
    	case 'modal v':
    	case 'auxiliary v':
    	case 'modal ver':
    	case 'modal veb':
    	case 'vb':
			return 'v';
		case 'adverb':
    	case 'adv':
		case 'ad':
		case 'adveb':
			return 'adv';
		case 'prep':
			return 'prep';
		case 'pfx':
		case 'sfx':
		case 'prefx':
		case 'suffx':
		case 'sx':
		case 'suffix':
			return 'fix';
		case 'ij':
		case 'interj':
		case 'coj':
		case 'ijectin':
		case 'cj':
		case 'intej':
		case 'interjectin':
		case 'cjunctio':
			return 'j';
		default:
			//console.log(pos + " not in parsed, Line: " + (maxLines-numLines));
       		return '';
		}
}
	
	
	

