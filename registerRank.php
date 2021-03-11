<?php

/////////////////////////////////////////
$host = "見せられないよ！";
$db = "見せられないよ！";
$username = "見せられないよ！";
$pass = "見せられないよ！";
////////////////////////////////////////

$ary = [];

$postData = json_decode($_POST['clearInfo']);
$clearName = htmlspecialchars($postData[0], ENT_QUOTES, 'UTF-8');
$clearTime =$postData[1];
echo json_encode([$clearName, $clearTime]);

const rankingNum = 100;

try{
    $dbh = new PDO("mysql:host=$host; dbname=$db; charset=utf8", $username, $pass);
    $sql = "SELECT * FROM clearData";
    $clearData = $dbh->query($sql);
    foreach( $clearData as $value){
        $ary["$value[id]"-1][0] = htmlspecialchars("$value[name]");
        $ary["$value[id]"-1][1] = intval("$value[time]");
    }
    for($i=0;$i<count($ary);$i++){
        if($clearTime <= $ary[$i][1]){
            array_splice($ary, $i, 0, array([$clearName, $clearTime]));
            break;
        }
    }
    for($i=0;$i<rankingNum;$i++){
        $name = $ary[$i][0];
        $time = $ary[$i][1];
        $req = $dbh->prepare('UPDATE clearData SET name = :name, time = :time WHERE id = :id');
        $req->execute(
            array(':name'=>$name, ':time'=>$time, ':id'=>$i+1)
        );

    }
    
} catch(PDOexception $e){
    echo $e;
}







$dbh = null;


?>
