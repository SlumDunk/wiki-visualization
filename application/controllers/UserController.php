<?php
ini_set('memory_limit', '8024M');
ini_set("display_errors", 0);

/**
 * import the requrire classes
 */
require("../models/user.php");
require("../../framework/databases/Utils.php");

/**
 * accept the query from the browser
 */
if (isset($_POST['fromDate'])) {
    echo GetRequestedUsers($_POST['fromDate'], $_POST['toDate'], $_POST['userType']);
} else {
    echo GetRequestedUsersTest();

}

/**
 * query user data
 * @param $fromDate
 * @param $toDate
 * @param $type
 * @return false|string
 */
function GetRequestedUsers($fromDate, $toDate, $type)
{
    $conn = Utils::getConnectionObject();
    if (!$conn) {

        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "";

    if ($type == "Both") {
        $sql = "
SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#000' as color,p.pagecategories FROM vandalusers 
 JOIN pages p on vandalusers.pagetitle = p.pagetitle
 where revtime between '" . $fromDate . "' and '" . $toDate . "'"
            .
            "union all
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#F6B67F' as color,p.pagecategories  FROM benignusers
 JOIN pages p on benignusers.pagetitle = p.pagetitle
 where revtime between '" . $fromDate . "' and '" . $toDate . "'";
    } else if ($type == "Benign") {
        $sql = "
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#F6B67F' as color,p.pagecategories  FROM benignusers
 JOIN pages p on benignusers.pagetitle = p.pagetitle
 where revtime between '" . $fromDate . "' and '" . $toDate . "'";

    } else {
        $sql = "
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#000' as color,p.pagecategories FROM vandalusers 
 JOIN pages p on vandalusers.pagetitle = p.pagetitle
 where revtime between '" . $fromDate . "' and '" . $toDate . "'";

    }

    try {
        $result = $conn->query($sql);
        $itemsData = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $toAdd = new user($row["username"], $row["revtime"], $row["pagetitle"], $row["isReverted"], $row["revertTime"], $row["color"], $row["pagecategories"]);
                $itemsData[] = $toAdd;
            }
        }
        return json_encode(utf8ize($itemsData));
    } catch (Exception $e) {
        return json_encode($e);
    }
    $conn->close();

}

/**
 * query the user data for test
 * @return false|string
 */
function GetRequestedUsersTest()
{
    $conn = Utils::getConnectionObject();
    if (!$conn) {
        echo "die";
        die("Connection failed: " . mysqli_connect_error());

    }

    try {

        $sql = "
SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#000' as color,p.pagecategories FROM vandalusers 
 JOIN pages p on vandalusers.pagetitle = p.pagetitle
 where revtime between '2013-12-01' and '2013-12-05'
 union all
 SELECT username,revtime,p.pagetitle,isReverted,revertTime,'#F6B67F' as color,p.pagecategories  FROM benignusers
 JOIN pages p on benignusers.pagetitle = p.pagetitle
 where revtime between '2013-12-01' and '2013-12-05'";
        $result = $conn->query($sql);
        $itemsData = array();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $toAdd = new user($row["username"], $row["revtime"], $row["pagetitle"], $row["isReverted"], $row["revertTime"], $row["color"], $row["pagecategories"]);
                $itemsData[] = $toAdd;
            }
        }
        return json_encode(utf8ize($itemsData));
    } catch (Exception $e) {
        return json_encode($e);
    }
    $conn->close();
}

/**
 * using utf8 to encode the string
 * @param $d
 * @return array|string
 */
function utf8ize($d)
{
    if (is_array($d))
        foreach ($d as $k => $v)
            $d[$k] = utf8ize($v);

    else if (is_object($d))
        foreach ($d as $k => $v)
            $d->$k = utf8ize($v);

    else
        return utf8_encode($d);

    return $d;
}

?>