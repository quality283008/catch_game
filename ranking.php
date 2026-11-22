<!DOCTYPE html>
<html lang="jp">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ハロウィンアイスキャッチゲーム</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/ranking.css">
    <link rel="stylesheet" href="css/angle.css">
    <link rel="shortcut icon" href="img/favicon.png" type="image/x-icon">
</head>
<body>
    <!-- 縦画面禁止 -->
    <div id="AngleFrame">
        <h1 id="AngleFrameText">このゲームはスマホの横画面専用です<br>※Google Chrome だとうまく動作しない可能性があります。<br>（Safari推奨）</h1>
    </div>
    <div id="main_wrapper">
        <!-- ここから背景要素 -->
        <div class="main_background_img_wrapper">
            <img class="main_background_img" src="img/back.png" alt="ハロウイン背景画像">
        </div>
        <div id="moon"></div>
        <!-- ここまでが背景要素 -->
        <!-- game.htmlから送られてくる内容 -->
        <form action="insert.php" method="post" id="ran_form">
            <div class="ranking_img_text">
                <img src="img/ranking_text_img.png" alt="">
            </div>
            <?php
            $post_point = $_POST["hidden_num"];
            echo "<input type='hidden' id='user_value' name='user_point' value='".$post_point."'>";
            echo "<span class='user_value_text'>あなたの獲得したポイントは</span><span id='inner_value'>".$post_point."</span><span class='user_value_text'>ポイントです</span>"
            ?>
            <div class="white_ranking_link">
                <div class="white_name">
                    <input type="text" id="white_name" placeholder="名前を入力する" name="user_name" required>
                </div>
                <div class="sub_ranking_link">
                    <input type="submit" id="sub_ranking_link" value="ランキングに登録する" onclick="audio()">
                </div>
            </div>
            <a href="RankingList.php" class="ranking_no_name" onclick="audio()">登録しないでランキングを見る</a>
        </form>
    </div>
    <!-- 効果音 -->
    <audio src="audio/btn.mp3" id="audio_1"></audio>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" crossorigin="anonymous"></script>
    <script src="js/font.js"></script>
    <script src="js/loading.js"></script>
    <script src="js/NotScroll.js"></script>
    <script src="js/audio.js"></script>
    <script src="js/height.js"></script>
    <script src="js/angle.js"></script>
    
</body>
</html>