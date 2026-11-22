$(window).on('load', function(){
    $('body').removeClass('fade_out');
});
$(function() {
    $('a:not([href^="#"]):not([target])').on('click', function(e){
        e.preventDefault(); // ナビゲートをキャンセル
        url = $(this).attr('href'); // 遷移先のURLを取得
        if (url !== '') {
            $('body').addClass('fade_out');  // bodyに class="fadeout"を挿入
            setTimeout(function(){
                window.location = url;  // 0.8秒後に取得したURLに遷移
            }, 500);
        }
        return false;
    });
});