<html>
    <head>
        <title>Php basic</title>
    </head>

    <body>
        <?php

            echo '<h3>Hello Php</h3>';

            // Read GET/POST Requests Param , address?username=...
            if ($_GET && $_GET['username']) {
                $userName = $_GET['username'];
                if ($userName) {
                    echo '<p> request from GET request ?username= ' . $userName;
                }
            } else if($_POST && $_POST['username']) {
                $userName = $_POST['username'];
                if ($userName) {
                    echo '<p> request from POST request ?username= ' . $userName;
                }
            } else {
                echo '<p> no requests... </p>';
            }

            echo '<p>6+5=' . (6+5) . '</p>';
            $myNum = (6+5);
            echo '<p>' . 'increase times 2' . ($myNum *= 2) . '</p>';
            
            $InitByBoolean = (10 == 7) ? "10 equals to 7" : "10 is not equal to 7";
            echo '<p>' . $InitByBoolean;
            
            echo '<p>';
            for ($num = 1; $num<=4; $num++) {
                echo $num . ',';
            }
            echo '</p>';
            
            $arr = array('abc','gfd','mtf','bbc');
            $arr[5] = 'bbm';
            $output = '';
            foreach ($arr as $key => $value) {
                echo 'the key : ' . $key . ' the value ' . $value . '<br>';
                $output = $output . $value;
            }
            echo 'all arr' . $output . '<br>';

            echo 'print array ' . implode(" ",$arr) . '<br>';
            // special sorts ksort,asort (sort by keys) => reverse sort rksort
            // see string length => strlen('SSS')

            $arrMAP = array('one'=>5,'two'=>10,'three'=>15);
            foreach ($arrMAP as $key => $value) {
                echo 'MAP the key : ' . $key . ' the value ' . $value . '<br>';
            }
            
            $something = 'in printf';
            printf('print something %s',$something);

            echo '<br> is "abb" equals to "ab3" : ' . strcmp('abb','ab3');
        ?>
    </body>
</html>