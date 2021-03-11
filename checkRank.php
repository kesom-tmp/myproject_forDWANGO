<?php

/////////////////////////////////////////
$host = "mysql4.star.ne.jp";
//$host = "localhost";
$db = "chicken_fuyasu";
$username = "chicken_root";
$pass = "uruseedamare56";
////////////////////////////////////////

$ary = [];
$postData = json_decode($_POST['clearTime']);
//$postData = ["unko",1];

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
    //echo json_encode("圏外");
} catch(PDOexception $e){
    echo json_decode(-1);
}







$dbh = null;


?>