import mwapi
import json
import os
import unicodecsv
import sys

'''
All users: https://en.wikipedia.org/w/api.php?action=query&list=allusers&format=jsonfm
Block user: https://en.wikipedia.org/w/api.php?action=query&list=blocks&format=jsonfm
User contribution: https://en.wikipedia.org/w/api.php?action=query&list=usercontribs&ucuser=Srijankedia&format=jsonfm
Categories: https://en.wikipedia.org/w/api.php?action=query&prop=categories&titles=Network%20motif&format=jsonfm
https://en.wikipedia.org/w/api.php?action=query&prop=categories&pageids=12499410&format=jsonfm
'''

x = mwapi.MWApi("https://en.wikipedia.org")

auparams = {}
auparams["action"] = "query"
auparams["list"] = "allusers"
auparams["format"] = "json"
auparams["auprop"] = "blockinfo"

bkparams = {}
bkparams["action"] = "query"
bkparams["list"] = "blocks"
bkparams["format"] = "json"
bkparams["bkstart"] = "20140602195000"
bkparams["bkend"] = "20140601000000"

bkparams["bklimit"] = "500"
bkparams["bkshow"] = "!ip"

ucparams = {}
ucparams["action"] = "query"
ucparams["list"] = "usercontribs"
ucparams["format"] = "json"
ucparams["uclimit"] = "500"
ucparams["ucdir"] = "newer"
ucparams["ucend"] = "20140801000000"
ucparams["ucnamespace"] = "0" # only get contributions in the main wikipedia articles; we should change it to all to take into account other edits as well (maybe this also contributes)

clparams = {}
clparams["action"] = "query"
clparams["prop"] = "categories"
clparams["format"] = "json"
clparams["cllimit"] = "500"

f = open("user_and_revision.csv","w")

writer = unicodecsv.writer(f)
writer.writerow(("username", "blocked_time", "page_title", "revision_time", "reverted", "reverted_time", "userid", "blocked_reason", "revision_id", "pageid", "page_categories"))

while True:
    bkresp = json.loads(x._request(method="POST",params=bkparams).content)
    users = bkresp["query"]["blocks"]
    for user in users:
        if "user" not in user:
            # the user was autoblocked
            continue

        if "vandal" not in user["reason"].lower():
            continue

        print "====================================="
        writer.writerow(())
        # get all the contributions of the users
        ucparams["ucuser"] = user["user"]
        prevcontrib = ''
        while True:
            ucresp = json.loads(x._request(method="POST",params=ucparams).content)            
            
            contribs = ucresp["query"]["usercontribs"]
            for contrib in contribs:
                revid = contrib["revid"]
                revertededit = False
                revertedtime = "-"
                fin,fout = os.popen4("grep \"^" + str(revid) + " \" reverted_revids.txt")
                output = fout.read()
                if output!='':
                    revertededit = True
                    revertedtime = output.split()[1]
                    revertedtime = revertedtime[:4] + "-" + revertedtime[4:6] + "-" + revertedtime[6:8] + "T" + revertedtime[8:10] + ":" + revertedtime[10:12] + ":" + revertedtime[12:14] + "Z"
                    
                pageid = contrib["pageid"]
                #print user["user"], pageid
                ts = contrib["timestamp"]
                
                pagecategories = set()
                clparams["pageids"] = pageid
                while True:
                    clresp = json.loads(x._request(method="POST",params=clparams).content)
                    try:
                        pagecategories = pagecategories.union(set((cat["title"] for cat in clresp["query"]["pages"][str(pageid)]["categories"])))
                    except:
                        print "Category not found for " + contrib["title"]
                    if 'query-continue' not in clresp:
                        break
                    clparams["clcontinue"] = clresp["query-continue"]["categories"]["clcontinue"]
                
                print user["user"], "\t", user["timestamp"], "\t", contrib["title"], "\t", ts, "\t", revertededit, "\t", revertedtime
                writer.writerow((user["user"], user["timestamp"], contrib["title"], contrib["timestamp"], revertededit, revertedtime, user["id"], user["reason"], contrib["revid"], contrib["pageid"], pagecategories))
            if 'query-continue' not in ucresp:
                break
            ucparams["uccontinue"] = ucresp["query-continue"]["usercontribs"]["uccontinue"]

    if 'query-continue' not in bkresp:
        break
    bkparams["bkcontinue"] = bkresp['query-continue']['blocks']["bkcontinue"]

