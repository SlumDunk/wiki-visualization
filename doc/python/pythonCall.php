<?php
ini_set('memory_limit', '8024M');
ini_set("display_errors", 0);

echo getSVD($_POST['param']);

function getSVD($svdInput)
{
    try {
        #Create/Open a file and prepare it for writing
        $tempFile = "temp.dat";
        $fh = fopen($tempFile, 'w') or die("can't open file");
        foreach ($svdInput as $value) {
            //fwrite($fh, $value."\n");
            foreach ($value as $v) {
                fwrite($fh, $v);
            }
            fwrite($fh, "\n");
        }
        fclose($fh);
        $result = shell_exec('python pythoncode.py');

        return json_encode($result);
    } catch (Exception $e) {
        return json_encode($e);
    }
}

?>