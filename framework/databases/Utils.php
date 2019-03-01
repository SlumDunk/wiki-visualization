<?php

/**
 * util class
 */
class Utils
{
    // const SERVER_NAME = "cci199phh2wws.uncc.edu:3306";
    // const USER_NAME = "root";
    // const PASSWORD = "Woodward404"; //
    // const DB_NAME = "wiki_views_data";

    const SERVER_NAME = "localhost";
    const USER_NAME = "root";
    const PASSWORD = "root123"; //
    const DB_NAME = "wiki_data";

    /**
     * get db connection
     * @return mysqli
     */
    public static function getConnectionObject()
    {
        return mysqli_connect("localhost:3306", "root", "root123", "wiki_data");
    }
}


?>