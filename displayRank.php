
<html lang="ja">
<head>
  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-163769255-1"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-163769255-1');
  </script>

  <meta charset="utf-8">
  <!---<meta name="viewport" content="width=device-width,user-scalable=no">--->
  <meta name="viewport" content="width=device-width">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="description" content="ブラウザで手軽に遊べるゲームを作っています。暇つぶしにどうぞ。">
  <meta name="keywords" content="ゲーム,スマートフォン,ブラウザ,ブラウザゲーム,暇つぶし,ゲーミングチャーハン">
  <meta name="twitter:creator" content="@miseromisero" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="og:url" content="https://gamingchahan.com/fuyasu/" />
  <meta property="og:title" content="ふやすを増やすゲーム" />
  <meta property="og:image" content="https://gamingchahan.com/fuyasu/images/twicard.png">

  <title>ふやすを増やすゲーム|ランキング</title>



  <script data-ad-client="ca-pub-1200773173710092" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  

  <style>

  body {
    background-color:#302833;
    color: #FFFFFF;
    width: 100%;
    font-family: "Helvetica Neue",
    Arial,
    "Hiragino Kaku Gothic ProN",
    "Hiragino Sans",
    Meiryo,
    sans-serif;
    overflow-x: hidden;
    margin: auto;
    text-align:center;
    
  }
  div:not(#game){
    background-color: #425550;
    text-align: center;
    border: 3px solid #cccccc;
  }
  table{
    margin-left: auto;
    margin-right: auto;
  }
  @media screen and (min-width: 767px) {
    div:not(#game) {
      width: 500px;
      padding: 0px;
      margin: 30px auto;
    }
    div.main {
      height:auto;
      overflow: hidden;
      text-align: center;
      
    }
    div.title{
      font-size: 250%;
    }
    table{
        font-size: 120%;
    }
  }
  @media screen and (max-width: 767px){
    div:not(#game) {
      width: 95vw;
      padding: 0vw;
      margin-left: auto;
      margin-right: auto;
      margin-top: 3vh;
    }
    div.main{
      height: auto;
      overflow: hidden;
      text-align: center;
      
    }
    div.title{
      font-size: 5vh;
    }
    table{
        font-size: 5vw;
    }
  }
 



  a{
    color:aquamarine;
    font-size:120%;
  }
  div.game{
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
  }



  </style>
  </head>

  <body>
      <div class="title">ふやすを増やすゲーム<br>ランキング</div>
  <div class="main">
      <?php

      /////////////////////////////////////////
    $host = "mysql4.star.ne.jp";
    //$host = "localhost";
    $db = "chicken_fuyasu";
    $username = "chicken_root";
    $pass = "uruseedamare56";
    ////////////////////////////////////////

    try{
        $dbh = new PDO("mysql:host=$host; dbname=$db; charset=utf8", $username, $pass);
        $sql = "SELECT * FROM clearData";
        $clearData = $dbh->query($sql);
        foreach( $clearData as $value){
            $ary["$value[id]"-1][0] = htmlspecialchars("$value[name]");
            $ary["$value[id]"-1][1] = intval("$value[time]");
        }
        echo "<table>";
        for($i=0;$i<count($ary);$i++){
            echo "<tr>";
            echo "<td>" . ($i+1) . "位　</td>";
            echo "<td>" . htmlspecialchars($ary[$i][0]) . "　</td>";
            echo "<td>"  . strval(floor($ary[$i][1]/60)) .  "." . strval(ceil(floor(($ary[$i][1]%60*100/60)*100)/100)) . "秒" . "　</td>";
            echo "</tr>";
            
        }
        echo "</table>";
        
    } catch(PDOexception $e){
        echo "あざらしさんがデータを食べちゃった";
    }
      ?>
</div>
</body>