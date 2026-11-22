"use strict";
window.onload = function(){
    setTimeout(function(){
      window.scrollTo(0,1);
    }, 1);
  }
// 初期ポイント
let GetPoint = 0;
let PointGauge = document.getElementById("PointGauge");
PointGauge.innerHTML = GetPoint;

// 初期タイマー
let GetTimer = 60;
let TimerGauge = document.getElementById("TimerGauge");
TimerGauge.innerHTML = GetTimer;

// 初期コーン位置
let ConePosition = 50;

// アイスオブジェクト
let IceObj_1 = document.getElementById("ice_1");
let IceObj_2 = document.getElementById("ice_2");
let IceObj_3 = document.getElementById("ice_3");
let IceObj_4 = document.getElementById("ice_4");
let Ice_w_a = IceObj_1.offsetWidth;
let Ice_w_b = IceObj_2.offsetWidth;
let Ice_w_c = IceObj_3.offsetWidth;
let Ice_w_d = IceObj_4.offsetWidth;
let Ice_h_a = 10;
let Ice_h_b = 10;
let Ice_h_c = 10;
let Ice_h_d = 10;

// コーンオブジェクト
let ConeObj = document.getElementById("cone");
let Cone_w = 100;
let Cone_h = 0;
// アイス要素
let Ice_1 = document.getElementById("ice_1");
let Ice_2 = document.getElementById("ice_2");
let Ice_3 = document.getElementById("ice_3");
let Ice_4 = document.getElementById("ice_4");

// アイス初期位置
let Ice_y_1 = 18;
let Ice_y_2 = 18;
let Ice_y_3 = 18;
let Ice_y_4 = 18;
Ice_1.style.top = Ice_y_1 + "%";
Ice_2.style.top = Ice_y_2 + "%";
Ice_3.style.top = Ice_y_3 + "%";
Ice_4.style.top = Ice_y_4 + "%";
Ice_1.style.opacity = 0;
Ice_2.style.opacity = 0;
Ice_3.style.opacity = 0;
Ice_4.style.opacity = 0;

// 月オブジェクト
let MoonObj = document.getElementById("moon");

// ゲーム後の画面
let FinishScreen = document.getElementById("finish_screen");
let UserPoint = document.getElementById("user_point");
let RankingLink =  document.getElementById("ranking_link");

/////////////////////////////////////////////////////////
if (window.matchMedia( "(max-width: 768px)" ).matches) {
    window.addEventListener("load",function(){
        Timer();
        console.log("モバイル");
    });
}else{
    window.addEventListener("load",function(){
        Timer();
        
        console.log("パソコン");
    });
}
ConePC();
/////////////////////////////////////////////////////////
// ポイントアップ関数
function PointUp(){
    GetPoint = GetPoint + 10;
    PointGauge.innerHTML = GetPoint;
    if( GetTimer === 0 ){
        GetPoint = GetPoint + 0;
    }
}
/////////////////////////////////////////////////////////
// タイマー関数
function Timer(){
    let GameTimer = setInterval(() => {
        GetTimer--;
        TimerGauge.innerHTML = GetTimer;
        if( GetTimer === 0 ){
            // ゲームタイマーをストップ
            clearInterval(GameTimer);
            // アイスを落とす処理をストップ
            clearInterval(RandomTimer_1)
            clearInterval(RandomTimer_2)
            clearInterval(RandomTimer_3)
            clearInterval(RandomTimer_4)
            TimerGauge.classList.remove("red_time");
            TimerGauge.classList.remove("finish_time");
            // 獲得獲得ポイントの表示
            UserPoint.innerHTML = GetPoint;
            FinishScreen.classList.add("finish_screen_pointer");
            document.getElementById("hidden").value = GetPoint;
            
            // window.location.href = "finish.html?point=" + GetPoint;
        }else if(GetTimer < 10){
            TimerGauge.classList.add("red_time");
            if(GetTimer <= 5){
                TimerGauge.classList.add("finish_time");
            }
        }
    }, 1000);
}
/////////////////////////////////////////////////////////
// モバイル時のコーン移動
// ジャイロセンサーへのアクセス












// function ConeSP(){
//     // 左ボタン
//     let LeftBtn = document.getElementById("left_btn");
//     LeftBtn.addEventListener("click",function(){
//         if(ConePosition > 10){
//             ConePosition -= 5;
//         }
//         Cone.style.left = ConePosition + "%";
//         console.log("左クリック");        
//     })
//     // 右ボタン
//     let RightBtn = document.getElementById("right_btn");
//     RightBtn.addEventListener("click",function(){
//         if(ConePosition < 90){
//             ConePosition += 5;
//         }
//         Cone.style.left = ConePosition + "%";
//         console.log("右クリック");        
//     })

// }
/////////////////////////////////////////////////////////
// パソコン時のコーン移動
function ConePC(){
    ConeObj.style.left = ConePosition + "%";
    addEventListener( "keydown", KeyDownEvent );
    function KeyDownEvent( event ) {
        let KeyNumber = event.keyCode;
        console.log("移動");
        let audio1 = document.getElementById("audio_1");
        audio1.load();
        audio1.play();
        if( KeyNumber == 37 && ConePosition > 5 ){
            ConePosition -= 5;
            // event.preventDefault();
        }else if( KeyNumber == 39 && ConePosition < 95){
            ConePosition += 5;
        }                                                           
        ConeObj.style.left = ConePosition + "%";
    }
}
/////////////////////////////////////////////////////////
// 当たり判定
function IceHit_1(){
    let IceSetName_1 = setInterval(() => {
        Ice_1.style.opacity = 1;
        Ice_y_1 = Ice_y_1 + 1;
        Ice_1.style.top = Ice_y_1 + "%";
        // コーン要素
        let Cone_left = ConeObj.offsetLeft;
        let Cone_top = ConeObj.offsetTop;
        let Cone_x = Cone_left+(Cone_w/2);
        let Cone_y = Cone_top+(Cone_h/2);
        // アイス要素
        let Ice_left_a = IceObj_1.offsetLeft;
        let Ice_top_a = IceObj_1.offsetTop;
        let Ice_x_a = Ice_left_a+(Ice_w_a/2);
        let Ice_y_a = Ice_top_a+(Ice_h_a/2);
        if(
            Math.abs(Cone_x - Ice_x_a)<Cone_w/2 + Ice_w_a/2 
            &&
            Math.abs(Cone_y - Ice_y_a)<Cone_h/2 + Ice_h_a/2
        ){
            console.log("当たった");
            clearInterval(IceSetName_1);
            Ice_1.style.opacity = 0;
            Ice_y_1 = 18;
            Ice_1.style.top = Ice_y_1 + "%";
            // ポイントアップ
            PointUp();
            // コーンの点滅
            ConeLite();
            // 月点滅
            MoonLite();
        }

        if( Ice_y_1 > 100){
            Ice_1.style.opacity = 0;
            clearInterval(IceSetName_1);
            Ice_y_1 = 18;
            Ice_1.style.top = Ice_y_1 + "%";
        }
    }, 20);
}
function IceHit_2(){
    let IceSetName_2 = setInterval(() => {
        Ice_2.style.opacity = 1;
        Ice_y_2 = Ice_y_2 + 1;
        Ice_2.style.top = Ice_y_2 + "%";
        // コーン要素
        let Cone_left = ConeObj.offsetLeft;
        let Cone_top = ConeObj.offsetTop;
        let Cone_x = Cone_left+(Cone_w/2);
        let Cone_y = Cone_top+(Cone_h/2);

        let Ice_left_b = IceObj_2.offsetLeft;
        let Ice_top_b = IceObj_2.offsetTop;
        let Ice_x_b = Ice_left_b+(Ice_w_b/2);
        let Ice_y_b = Ice_top_b+(Ice_h_b/2);
        if(
            Math.abs(Cone_x - Ice_x_b)<Cone_w/2 + Ice_w_b/2 
            &&
            Math.abs(Cone_y - Ice_y_b)<Cone_h/2 + Ice_h_b/2
        ){
            console.log("当たった");
            clearInterval(IceSetName_2);
            Ice_2.style.opacity = 0;
            Ice_y_2 = 18;
            Ice_2.style.top = Ice_y_2 + "%";
            // ポイントアップ
            PointUp();
            // コーンの点滅
            ConeLite();
            // 月点滅
            MoonLite();
        }

        if( Ice_y_2 > 100){
            Ice_2.style.opacity = 0;
            clearInterval(IceSetName_2);
            Ice_y_2 = 18;
            Ice_2.style.top = Ice_y_2 + "%";
        }
    }, 20);
}
function IceHit_3(){
    let IceSetName_3 = setInterval(() => {
        Ice_3.style.opacity = 1;
        Ice_y_3 = Ice_y_3 + 1;
        Ice_3.style.top = Ice_y_3 + "%";
        // コーン要素
        let Cone_left = ConeObj.offsetLeft;
        let Cone_top = ConeObj.offsetTop;
        let Cone_x = Cone_left+(Cone_w/2);
        let Cone_y = Cone_top+(Cone_h/2);

        let Ice_left_c = IceObj_3.offsetLeft;
        let Ice_top_c = IceObj_3.offsetTop;
        let Ice_x_c = Ice_left_c+(Ice_w_c/2);
        let Ice_y_c = Ice_top_c+(Ice_h_c/2);
        if(
            Math.abs(Cone_x - Ice_x_c)<Cone_w/2 + Ice_w_c/2 
            &&
            Math.abs(Cone_y - Ice_y_c)<Cone_h/2 + Ice_h_c/2
        ){
            console.log("当たった");
            clearInterval(IceSetName_3);
            Ice_3.style.opacity = 0;
            Ice_y_3 = 18;
            Ice_3.style.top = Ice_y_3 + "%";
            // ポイントアップ
            PointUp();
            // コーンの点滅
            ConeLite();
            // 月点滅
            MoonLite();
        }

        if( Ice_y_3 > 100){
            Ice_3.style.opacity = 0;
            clearInterval(IceSetName_3);
            Ice_y_3 = 18;
            Ice_3.style.top = Ice_y_3 + "%";
        }
    }, 20);
}
function IceHit_4(){
    let IceSetName_4 = setInterval(() => {
        Ice_4.style.opacity = 1;
        Ice_y_4 = Ice_y_4 + 1;
        Ice_4.style.top = Ice_y_4 + "%";
        // コーン要素
        let Cone_left = ConeObj.offsetLeft;
        let Cone_top = ConeObj.offsetTop;
        let Cone_x = Cone_left+(Cone_w/2);
        let Cone_y = Cone_top+(Cone_h/2);

        let Ice_left_d = IceObj_4.offsetLeft;
        let Ice_top_d = IceObj_4.offsetTop;
        let Ice_x_d = Ice_left_d+(Ice_w_d/2);
        let Ice_y_d = Ice_top_d+(Ice_h_d/2);
        if(
            Math.abs(Cone_x - Ice_x_d)<Cone_w/2 + Ice_w_d/2 
            &&
            Math.abs(Cone_y - Ice_y_d)<Cone_h/2 + Ice_h_d/2
        ){
            console.log("当たった");
            clearInterval(IceSetName_4);
            Ice_4.style.opacity = 0;
            Ice_y_4 = 18;
            Ice_4.style.top = Ice_y_4 + "%";
            // ポイントアップ
            PointUp();
            // コーンの点滅
            ConeLite();
            // 月点滅
            MoonLite();
        }

        if( Ice_y_4 > 100){
            Ice_4.style.opacity = 0;
            clearInterval(IceSetName_4);
            Ice_y_4 = 18;
            Ice_4.style.top = Ice_y_4 + "%";
        }
    }, 20);
}
// let ak = Math.random()*3;

let min = 3 ;
let max = 5 ;
let ran_1 = ( Math.random() * (max + 1 - min) ) + min ;
let ran_2 = ( Math.random() * (max + 1 - min) ) + min ;
let ran_3 = ( Math.random() * (max + 1 - min) ) + min ;
let ran_4 = ( Math.random() * (max + 1 - min) ) + min ;


// ランダムに落とす関数
let RandomTimer_1 = setInterval(() => {
    IceHit_1();
}, 1000*ran_1);
let RandomTimer_2 = setInterval(() => {
    IceHit_2();
}, 1000*ran_2);
let RandomTimer_3 = setInterval(() => {
    IceHit_3();
}, 1000*ran_3);
let RandomTimer_4 = setInterval(() => {
    IceHit_4();
}, 1000*ran_4);


function ConeLite(){
    ConeObj.style.backgroundImage = "url('img/cone_lite.png')";
    setTimeout(() => {
        ConeObj.style.backgroundImage = "url('img/cone.png')";
    }, 400);
}
function MoonLite(){
    MoonObj.style.backgroundImage = "url('img/moon_lite.png')";
    setTimeout(() => {
        MoonObj.style.backgroundImage = "url('img/moon.png')";
    }, 400);
}
// ゲーム終了後画面を暗くして終了するランキングへともう一度遊ぶ
// ハイスコア
// あなたの順位は？

