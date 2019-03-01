
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.ceil(millis / 60000);
  return minutes;
}

var metaPages =[];
function featureOne(data)
{

	console.log("Data before making changes..");
	console.log(data);
 var logBase = 2;
 var index = 0;
 var users = d3.nest()
        .key(function(d) { return d.username; })
        .key(function(d) { return d.pagetitle; })
        .entries(data);

//console.log(data);

var userToReturn = [];
	 for(var i= 0;i<users.length;i++)
	 {
	 	var userPages = users[i].values; // get all pages for the users
	 	var metaPageObj = null;

	 	users[i].timeG15 = 0;
	 	users[i].timeL3 = 0;
	 	users[i].timeG3L15 = 0;

	 	users[i].noOfMetaPages = 0;
	 	users[i].noOfNonMetaPages = 0;
        users[i].color =  users[i].values[0].values[0].color;

	 	users[i].mtimeG15 = 0;
	 	users[i].mtimeL3 = 0;
	 	users[i].mtimeG3L15 = 0;

	 	users[i].numOfGoodEdits = 0;
	 	users[i].numOfBadEdits = 0;
		users[i].userIndex = index++;
		/*users[i].timeG15 = 1;
	 	users[i].timeL3 = 1;
	 	users[i].timeG3L15 = 1;

	 	users[i].noOfMetaPages = 1;
	 	users[i].noOfNonMetaPages = 1;
        users[i].color =  users[i].values[0].values[0].color;

	 	users[i].mtimeG15 = 1;
	 	users[i].mtimeL3 = 1;
	 	users[i].mtimeG3L15 = 1;

	 	users[i].numOfGoodEdits = 1;
	 	users[i].numOfBadEdits = 1;*/

	 	var isEditAboveTH = false;
	 	for(var j =0; j<userPages.length; j++)
	 	{
	 		var pageEdits = userPages[j].values;
	 		var page = userPages[j].key;


	 		for(var k = 0; k<pageEdits.length - 1 ; k++)
	 		{
	 			//console.log(pageEdits);
	 			var curr_edit_time = new Date(pageEdits[k].revtime).getTime();
	 			var next_edit_time = new Date(pageEdits[k+1].revtime).getTime();

	 			var timeDiff = next_edit_time - curr_edit_time;
	 			var timeDiff = millisToMinutesAndSeconds(timeDiff);
	 			
	 			// All pages

				if(pageEdits[k].isReverted == "True")
				{
                    users[i].numOfBadEdits = users[i].numOfBadEdits +1;
				}else
				{
                    users[i].numOfGoodEdits = users[i].numOfGoodEdits +1;
				}
	 			
	 			if(timeDiff <= (3*60))
	 			{
	 				users[i].timeL3 = users[i].timeL3  + 1;
	 			}
	 			else if(timeDiff >= (3*60) & timeDiff <= (15*60))
	 			{
	 				users[i].timeG3L15 = users[i].timeG3L15 + 1;
	 			}
	 			else if(timeDiff >= (15*60))
	 			{
	 				users[i].timeG15 = users[i].timeG15 + 1;
	 			}

	 		}
	 		/*
	 			-- talk: user: Wikipedia: Template: Category talk: Category: Command: Daft: 
 				-- File: Book: Portal
 				indexOf("Talk") >= 0 
	 			*/
	 			// Meta Pages

	 			if(page.toLowerCase().indexOf("talk:") >= 0
	 				| page.toLowerCase().indexOf("user:") >= 0
	 				| page.toLowerCase().indexOf("wikipedia:") >= 0
	 				| page.toLowerCase().indexOf("template:") >= 0
	 				| page.toLowerCase().indexOf("category:") >= 0
	 				| page.toLowerCase().indexOf("command:") >= 0
	 				| page.toLowerCase().indexOf("daft:") >= 0
	 				| page.toLowerCase().indexOf("book:") >= 0
	 				| page.toLowerCase().indexOf("file:") >= 0
	 				)
	 			{

	 				users[i].noOfMetaPages = users[i].noOfMetaPages + 1;

	 				//console.log(page);

					for(var k = 0; k<pageEdits.length - 1 ; k++)
					{
						//console.log(pageEdits);
						var curr_edit_time = new Date(pageEdits[k].revtime).getTime();
						var next_edit_time = new Date(pageEdits[k+1].revtime).getTime();

						var timeDiff = next_edit_time - curr_edit_time;
						var timeDiff = millisToMinutesAndSeconds(timeDiff);

					

						if(timeDiff <= (3*60))
						{
							users[i].mtimeL3 = users[i].mtimeL3  + 1;
						}
						else if(timeDiff >= (3*60) & timeDiff <= (15*60))
						{
							users[i].mtimeG3L15 = users[i].mtimeG3L15 + 1;
						}
						else if(timeDiff >= (15*60))
						{
							users[i].mtimeG15 = users[i].mtimeG15 + 1;
						}

					}
					//metaPageObj = users[i];
					//metaPages.push(users[i]);
	 			}
	 			else
	 			{
	 				users[i].noOfNonMetaPages = users[i].noOfNonMetaPages + 1;
	 			}


	 			// Non meta pages
	 		
	 	}

	 	//alert(min_edits);
	 	if(users[i].numOfGoodEdits > min_edits)
            userToReturn.push(users[i]);
	 	//if(metaPageObj!= null)
	 	//metaPages.push(metaPageObj);
	 }
	 //console.log(users);
	 for(var i= 0;i<users.length;i++){
		
		 var userPages = users[i].values; // get all pages for the users
		
			users[i].timeG15 = getBaseLog(users[i].timeG15+1,logBase);
			users[i].timeL3 = getBaseLog(users[i].timeL3+1,logBase);
			users[i].timeG3L15 = getBaseLog(users[i].timeG3L15+1,logBase);
			users[i].noOfMetaPages = getBaseLog(users[i].noOfMetaPages+1,logBase);
			users[i].noOfNonMetaPages = getBaseLog(users[i].noOfNonMetaPages+1,logBase);
			users[i].mtimeG15 = getBaseLog(users[i].mtimeG15+1,logBase);
			users[i].mtimeL3 = getBaseLog(users[i].mtimeL3+1,logBase);
			users[i].mtimeG3L15 = getBaseLog(users[i].mtimeG3L15+1,logBase);
			users[i].numOfGoodEdits = getBaseLog(users[i].numOfGoodEdits+1,logBase);
			users[i].numOfBadEdits = getBaseLog(users[i].numOfBadEdits+1,logBase);
			}
		//console.log(users);
	 //console.log("000000-------000000000000------------------0--->")
    userToReturn.sort(function(x, y){
        return d3.ascending(x.key, y.key);
    });
    //console.log("<-----------users------------------------->");

     console.log({"Total users": users, "Users returned after filtered by edits":userToReturn});
	 //console.log(metaPages);
	 return {"sc_1": userToReturn, "sc_2":metaPages};
	
}



function zeros(dimensions) {
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function getBaseLog(x,y){
	
	return Math.log(x);
}