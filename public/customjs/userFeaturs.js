/**
 * change million seconds to minitues
 * @param millis
 * @returns {number}
 */
function millisToMinutesAndSeconds(millis) {
    let minutes = Math.ceil(millis / 60000);
    return minutes;
}

/**
 * meta data about pages
 * @type {Array}
 */
var metaPages = [];

/**
 * filter source data get from the server and add decoration information on the dataset
 * @param data
 * @returns {{sc_2: Array, sc_1: Array}}
 */
function featureOne(data) {

    console.log("Data before making changes..");
    let logBase = 2;
    let index = 0;
    //slice the user data base on key
    //group user by username, and inside each value, group by pagetitle
    let users = d3.nest()
        .key(function (d) {
            return d.username;
        })
        .key(function (d) {
            return d.pagetitle;
        })
        .entries(data);

    console.log(users);
    //result set
    let userToReturn = [];
    for (let i = 0; i < users.length; i++) {
        // get all pages group by user name
        let userPages = users[i].values;

        //time difference between two edits great than 15 hours
        users[i].timeG15 = 0;
        //time difference between two edits less than 3 hours
        users[i].timeL3 = 0;
        //time difference between two edits great than 3 hours less than 15 hours
        users[i].timeG3L15 = 0;
        // number of meta pages
        users[i].numOfMetaPages = 0;
        // number of non meta pages
        users[i].numOfNonMetaPages = 0;
        //use the color of the first page of the pages correspond to the first page title key
        users[i].color = users[i].values[0].values[0].color;
        //meta pages, time difference between two edits great than 15 hours
        users[i].mtimeG15 = 0;
        //meta pages, time difference between two edits less than 3 hours
        users[i].mtimeL3 = 0;
        //meta pages, time difference between two edits great than 3 hours less than 15 hours
        users[i].mtimeG3L15 = 0;
        //times of edits executed by benign users
        users[i].numOfGoodEdits = 0;
        //times of edits executed by vandal users
        users[i].numOfBadEdits = 0;
        users[i].userIndex = index++;
        //threshold
        let isEditAboveTH = false;
        //iterates pages edit by this user, group by page title
        for (let j = 0; j < userPages.length; j++) {
            //get the edit pages
            let edits = userPages[j].values;
            //get the page title
            let pageTitle = userPages[j].key;

            for (let k = 0; k < edits.length - 1; k++) {
                //console.log(pageEdits);
                let curr_edit_time = new Date(edits[k].revtime).getTime();
                let next_edit_time = new Date(edits[k + 1].revtime).getTime();
                //get the time difference between two adjacent edits
                let timeDiff = next_edit_time - curr_edit_time;
                timeDiff = millisToMinutesAndSeconds(timeDiff);

                // if this edit is bad edit
                if (edits[k].isReverted == "True") {
                    users[i].numOfBadEdits = users[i].numOfBadEdits + 1;
                } else {
                    users[i].numOfGoodEdits = users[i].numOfGoodEdits + 1;
                }

                if (timeDiff < (3 * 60)) {//time difference less than 3 hours
                    users[i].timeL3 = users[i].timeL3 + 1;
                } else if (timeDiff >= (3 * 60) & timeDiff <= (15 * 60)) {//3 hours<=time difference <=15 hours
                    users[i].timeG3L15 = users[i].timeG3L15 + 1;
                } else if (timeDiff > (15 * 60)) {// time difference >15 hours
                    users[i].timeG15 = users[i].timeG15 + 1;
                }

            }

            // Meta Pages
            // -- talk: user: Wikipedia: Template: Category talk: Category: Command: Daft: File: Book: Portal
            if (pageTitle.toLowerCase().indexOf("talk:") >= 0
                | pageTitle.toLowerCase().indexOf("user:") >= 0
                | pageTitle.toLowerCase().indexOf("wikipedia:") >= 0
                | pageTitle.toLowerCase().indexOf("template:") >= 0
                | pageTitle.toLowerCase().indexOf("category:") >= 0
                | pageTitle.toLowerCase().indexOf("command:") >= 0
                | pageTitle.toLowerCase().indexOf("daft:") >= 0
                | pageTitle.toLowerCase().indexOf("book:") >= 0
                | pageTitle.toLowerCase().indexOf("file:") >= 0
            ) {
                users[i].numOfMetaPages = users[i].numOfMetaPages + 1;

                for (let k = 0; k < edits.length - 1; k++) {
                    let curr_edit_time = new Date(edits[k].revtime).getTime();
                    let next_edit_time = new Date(edits[k + 1].revtime).getTime();

                    let timeDiff = next_edit_time - curr_edit_time;
                    timeDiff = millisToMinutesAndSeconds(timeDiff);


                    if (timeDiff <= (3 * 60)) {
                        users[i].mtimeL3 = users[i].mtimeL3 + 1;
                    } else if (timeDiff >= (3 * 60) & timeDiff <= (15 * 60)) {
                        users[i].mtimeG3L15 = users[i].mtimeG3L15 + 1;
                    } else if (timeDiff >= (15 * 60)) {
                        users[i].mtimeG15 = users[i].mtimeG15 + 1;
                    }
                }
            } else {// Non meta pages
                users[i].numOfNonMetaPages = users[i].numOfNonMetaPages + 1;
            }

        }
        //if the number of good edits of this user greater than the mini edits, add this item to the result set
        if (users[i].numOfGoodEdits > min_edits) {
            userToReturn.push(users[i]);
        }

        // for(let i= 0;i<users.length;i++){
        //     users[i].timeG15 = getBaseLog(users[i].timeG15+1,logBase);
        //     users[i].timeL3 = getBaseLog(users[i].timeL3+1,logBase);
        //     users[i].timeG3L15 = getBaseLog(users[i].timeG3L15+1,logBase);
        //     users[i].noOfMetaPages = getBaseLog(users[i].noOfMetaPages+1,logBase);
        //     users[i].noOfNonMetaPages = getBaseLog(users[i].noOfNonMetaPages+1,logBase);
        //     users[i].mtimeG15 = getBaseLog(users[i].mtimeG15+1,logBase);
        //     users[i].mtimeL3 = getBaseLog(users[i].mtimeL3+1,logBase);
        //     users[i].mtimeG3L15 = getBaseLog(users[i].mtimeG3L15+1,logBase);
        //     users[i].numOfGoodEdits = getBaseLog(users[i].numOfGoodEdits+1,logBase);
        //     users[i].numOfBadEdits = getBaseLog(users[i].numOfBadEdits+1,logBase);
        // }
    }

    //sort result set by the name of user
    userToReturn.sort(function (itemA, itemB) {
        return d3.ascending(itemA.key, itemB.key);
    });

    //return the result, sc_1 represents both meta pages and non-meta pages, sc_2 represents meta pages, the project
    //does not use sc_2
    return {"sc_1": userToReturn, "sc_2": metaPages};

}

/**
 *
 * @param dimensions
 * @returns {Array}
 */
function zeros(dimensions) {
    let array = [];
    for (let i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

/**
 * get the log value of x
 * @param value
 * @param base
 * @returns {number}
 */
function getBaseLog(value, base) {
    return Math.log(value);
}