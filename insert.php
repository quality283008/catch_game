<?php
    //画面にエラー出力する記述
    ini_set('display_errors',1);
    //pdoでデータ作成
    try{
        $pdo = new PDO('sqlite:user.db');
    }catch(PDOException $e){
        die('DB Error');
    }
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_ASSOC);
        $post_name = $_POST["user_name"];
        $post_point = $_POST["user_point"];
        $pdo->exec("INSERT INTO t_ranking (user_na, user_point) VALUES ('$post_name', '$post_point')");
        header('Location:RankingList.php');
?>