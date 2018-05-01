<?php
    header('Access-Control-Allow-Origin: *');

    $path = $_GET['path'];

    $url = 'http://localhost/' . $path;

    //echo $url;

    $handle = fopen($url, 'r');

    if ($handle) {
        while (!feof($handle)) {
            $buffer = fgets($handle, 4096);
            echo $buffer;
        }
        fclose($handle);
    }
?>