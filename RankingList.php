<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ハロウィンゲーム</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/ranking.css">
    <link rel="stylesheet" href="css/RankingList.css">
    
    <link rel="shortcut icon" href="img/favicon.png" type="image/x-icon">
</head>
<body>
    <div class="ranking_wrapper">
        <div class="ranking_list_img">
            <img src="img/ranking_text_img.png" alt="">
        </div>
        <!-- pc_header -->
        <svg id="svg_wrapper_pc" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 454.03">
            <path class="svg_1" d="M0,0V442.88s104.06-35.33,205.89-35.33S302.13,454,396,454s107.55-46.48,193.9-46.48,75.48,35.33,162.83,35.33,90.6-38.12,177.41-35.33S1008.42,454,1099.93,454s115.78-35.27,206.54-35.27S1406,454,1484.41,454s145.7-35.8,229.81-35.27S1920,454,1920,454V0Z"/>
        </svg>
        <!-- tablet_header -->
        <svg id="svg_wrapper_tablet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 834 302.69">
            <path class="svg_1" d="M0,0V295.25S45.2,271.7,89.43,271.7s66.27,31,107,31,57.65-31,95.15-31,86,31,124,31,84.41-32.85,122.12-31,58.62,31,98.37,31,73.43-31.34,110-31,88,31,88,31V0Z"/>
        </svg>
        <svg id="svg_wrapper_sp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376.57 226.92">
            <path class="svg_1" d="M1.34,0,0,226.92s39.79-18.1,59.67-18.1,44.76,18.1,63.09,18.1,53.05-19.53,70-18.1,41.47,18.1,59.34,18.1,47.92-18.37,64.35-18.1,60.12,18.1,60.12,18.1-.23-41-.23-226.92Z"/>
        </svg>
        <div class="ranking_list_wrapper">
            <div class="ranking_list_inner">
                <div class="ranking_select_name ranking_item">
                    <div class="ranking_umber_name ranking_number">RANK</div>
                    <div class="ranking_name_name ranking_name">NAME</div>
                    <div class="ranking_point_name ranking_point">POINT</div>
                </div>
                <?php
                // エラー出力する場合
                ini_set( 'display_errors', 1 );
                //pdoでデータ作成
                try{     
                    $pdo = new PDO('sqlite:user.db');
                }catch (PDOException $e){
                    die ('DB Error');
                }
                //全て
                // $all = $pdo->query("SELECT user_na, user_point RANK() OVER ( ORDER BY user_point DESC ) AS rank_result FROM t_ranking GROUP BY user_na");
                // while ($row = $all->fetch()) {
                //     $ran_id= htmlspecialchars($row['ran_id']);
                //     $name= htmlspecialchars($row['user_na']);
                //     $point= htmlspecialchars($row['user_point']);
                //     $rank= htmlspecialchars($row['rank_result']);
                //         echo "<div class='ranking_item top3'>";
                //         echo "<div class='ranking_number'>".$rank."位</div>";
                //         echo "<div class='ranking_name'>".$name."</div>";
                //         echo "<div class='ranking_point'>".$point."ポイント</div>";
                //         echo "</div>";
                // }
                $all = $pdo->query("SELECT * FROM(SELECT ran_id, user_na, user_point, ROW_NUMBER() OVER(ORDER BY user_point DESC) AS rank_result FROM t_ranking) AS s WHERE rank_result <= 3;");
                while ($row = $all->fetch()) {
                    $ran_id= htmlspecialchars($row['ran_id']);
                    $name= htmlspecialchars($row['user_na']);
                    $point= htmlspecialchars($row['user_point']);
                    $rank= htmlspecialchars($row['rank_result']);
                        echo "<div class='ranking_item top3'>";
                        echo "<div class='ranking_number'><img src='img/ranking_number".$rank.".png' alt='王冠'></div>";
                        echo "<div class='ranking_name'>".$name."</div>";
                        echo "<div class='ranking_point'>".$point."ポイント</div>";
                        echo "</div>";
                }
                $all = $pdo->query("SELECT * FROM(SELECT ran_id, user_na, user_point, ROW_NUMBER() OVER(ORDER BY user_point DESC) AS rank_result FROM t_ranking) AS s WHERE rank_result > 3;");
                while ($row = $all->fetch()) {
                    $ran_id= htmlspecialchars($row['ran_id']);
                    $name= htmlspecialchars($row['user_na']);
                    $point= htmlspecialchars($row['user_point']);
                    $rank= htmlspecialchars($row['rank_result']);
                    echo "<div class='ranking_item'>";
                    echo "<div class='ranking_number'>".$rank."位</div>";
                    echo "<div class='ranking_name'>".$name."</div>";
                    echo "<div class='ranking_point'>".$point."ポイント</div>";
                    echo "</div>";
                }
                ?>
            </div>
            <div style="margin-bottom: 50px;">
                <a href="https://fes2021.tokyo-ec.net/wm/Halloween_Game/count.html" class="ranking_no_name">もう一度ゲームをする</a>
            </div>
            <div>
                <a href="https://fes2021.tokyo-ec.net/wm/student_work/" class="ranking_no_name">展示サイトに戻る</a>
            </div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" crossorigin="anonymous"></script>
    <script src="js/font.js"></script>
    <script src="js/loading.js"></script>
    
</body>
</html>