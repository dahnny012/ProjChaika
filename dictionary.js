function Dictionary()
{
	
	return this;
}

	
	Dictionary.prototype.buildQuery = function(spell){
		spell = spell.split(" ");
        return spell

	};
	
	Dictionary.prototype.spellSearch = function (spell) {
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
	
	
	
	

