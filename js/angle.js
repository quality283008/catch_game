"use strict";
let vh;
if (window.matchMedia( "(max-width: 768px)" ).matches) {
    window.addEventListener("orientationchange", ()=>{
        setTimeout(() => {
            SetAngle();
            console.log("回転");
        }, 100);
    });
    window.addEventListener("load",function(){
        setTimeout(() => {
            SetAngle();
            console.log("ロード");
        }, 100);
    });
}else{
    window.addEventListener("load",function(){
        setTimeout(() => {
            SetAngle();
            console.log("ロード");
        }, 100);
    });
    AngleFrame.classList.remove("AngleFrame");
    AngleFrameText.classList.add("AngleFrameText");
    // btn_a.classList.add("AngleFrameText");
}

function SetAngle(){
    let angle = screen && screen.orientation && screen.orientation.angle;
    if ( angle === undefined ) {
        angle = window.orientation;   
    }
    function disableScroll(event) {
        event.preventDefault();
    }
    let AngleFrame = document.getElementById("AngleFrame");
    let AngleFrameText = document.getElementById("AngleFrameText");
    if( angle === 0 ){
        console.log("縦向き");
        vh = window.innerHeight;
        console.log(vh);
        document.getElementById('main_wrapper').style.height = vh + 'px';
        // AngleFrame.classList.add("vertical");
        // AngleFrame.attr('id','vertical');
        AngleFrame.classList.add("AngleFrame");
        AngleFrameText.classList.remove("AngleFrameText");
        // btn_a.classList.remove("AngleFrameText");
    }
    else{
        console.log("横向き");
        vh = window.innerHeight;
        console.log(vh);
        document.getElementById('main_wrapper').style.height = vh + 'px';
        // AngleFrame.classList.remove("vertical");
        AngleFrame.classList.remove("AngleFrame");
        AngleFrameText.classList.add("AngleFrameText");
        // btn_a.classList.add("AngleFrameText");
    }
}