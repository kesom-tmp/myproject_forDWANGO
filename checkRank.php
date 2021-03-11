<?php

/////////////////////////////////////////
$host = "見せられないよ！";
$db = "見せられないよ！";
$username = "見せられないよ！";
$pass = "見せられないよ！";
////////////////////////////////////////

$ary = [];
$postData = json_decode($_POST['']);

try{
    $dbh = new PDO("mysql:host=$host; dbname=$db; charset=utf8", $username, $pass);
    $sql = "SELECT * FROM clearData";
    $clearData = $dbh->query($sql);
    foreach( $clearData as $value){
        $ary["$value[id]"-1] = intval("$value[time]");
    }
    for($i=0;$i<count($ary);$i++){
        if($postData<=$ary[$i]){
            echo json_encode($i+1);
            break;
        }
    }
} catch(PDOexception $e){
    echo json_decode(-1);
}







$dbh = null;


?>
