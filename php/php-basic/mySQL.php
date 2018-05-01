<?php
    echo 'for mySQLAdmin & servers on apache';

    $dbURL = 'localhost';
    $dbpass = '';
    $dbName = 'learndb';
    $dbuser = 'root';

    $connect = mysqli_connect($dbURL,$dbuser,$dbpass,$dbName) or die("can't connect");

    $query = "SELECT * FROM `learntable`";

    $rows = mysqli_query($connect,$query);

    echo '<br>';
    while ($row = mysqli_fetch_array($rows)) {
        echo 'result : ' . implode(" ",$row) . '<br>';
    }

    $insertSQL = "INSERT INTO `learntable`(`name`, `value`, `from`, `to`) VALUES ('bewNW',55,'bb','zzxc')";
    if ($connect->query($insertSQL) === TRUE) {
        echo 'insert successfully';
    } else {
        echo 'cant inseted';
    }

?>