var last_node_id = '';
var session_id = '';
var sh_type = 0;
// var url = 'http://aicp.jkbk.cn/yjl/';
var url = 'http://www.newai.com/yjl/';
$(document).ready(function () {

    $(document).keyup(function (e) {//捕获文档对象的按键弹起事件
        if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
            up_say();
        }
    });

    //进入时发送空请求
    $.ajax({
        type: "post",  //提交方式
        url: url + "yjl/getindexdata",//路径
        data: null,//数据，这里使用的是Json格式进行传输
        dataType: "json",
        success: function (result) {//返回数据根据结果进行相应的处理
            session_id = result.session_id;
            for (var i = 0; i < result.result_num; i++) {
                if (result.value[i].value) {
                    if (i == 0) {
                        var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                        ans += '<div class="answer_text"><p>' + result.value[0].value + '<a href="javascript:void(0);" onclick="kp_pop();return false;" style="color:rgba(255,255,255,0.8);text-decoration: none;" class="reviewBtn"> <b>查看免责声明</b></a></p><i></i>'; // class="reviewBtnTop"
                        ans += '</div></div>';
                        $('.speak_box').append(ans);
                        for_bottom();
                    } else {
                        return_chatboot_msg(result.value[i].value);
                    }
                }
            }
        }
    });
});

/*******
 ** 开 **
 ** 篇 **
 ** 免 **
 ** 责 **
 ** 声 **
 ** 明 **
 *******/
function kp_pop() {
    $("#kp-popup_layer").css("display", "block");
    $(".kp-pop-close").on('touchend', function () {
        $("#kp-popup_layer").css("display", "none");
    });
}

function postAjax(text, session_id, context, k, v) {
    if (context == 1) {
        var data = {"query_text": text, "session_id": session_id, "context": "context", "k": k, "v": v};
    } else {
        var data = {"query_text": text, "session_id": session_id};
    }
    $.ajax({
        type: "post",  //提交方式
        url: url+"yjl/getindexdata",//路径
        data: data,//数据，这里使用的是Json格式进行传输
        dataType: "json",
        success: function (result) {//返回数据根据结果进行相应的处理

            console.log(result);
            console.log(result.result_num);
            var session_id = result.session_id;
            for (var i = 0; i < result.result_num; i++) {


                if (result.value[i].value) {
                    if (result.value[i].action == 'tanchuang') {
                        var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                        ans += '<div class="answer_text"><p>' + result.value[i].value + '<a href="javascript:void(0);" onclick="du_pop();return false;" style="color:rgba(255,255,255,0.8);text-decoration: none;"  class="reviewBtn"> <b>了解更多</b></a></p><i></i>'; // class="reviewBtnTop"
                        ans += '</div></div>';
                        $('.speak_box').append(ans);
                        for_bottom();
                    } else if (result.value[i].action == 'huli_pop') {
                        $("#hl-popup_layer .du-popup-size").html(result.value[i].value);
                    } else if (result.value[i].action == 'testResult') {
                        var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                        answerNew += '<div class="answer_text"><p><span class="result-bac">' + result.value[i].value + '</span></p><i></i>';
                        answerNew += '</div></div>';
                        $('.speak_box').append(answerNew);
                        for_bottom();
                    } else {
                        return_chatboot_msg(result.value[i].value);
                    }
                }
                switch (result.value[i].action) {
                    //console.log(result.value[i].action);
                    case 'yesorno'://是否测试
                        $(".wenwen-footer").css("display", "none");
                        $(".sh_think-footer").css("display", "block");
                        break;
                    case 'kangFu'://是否测试
                        $(".wenwen-footer").css("display", "none");
                        $(".kangFu_think-footer").css("display", "block");
                        break;
                    case 'isGood'://是否测试
                        $(".wenwen-footer").css("display", "none");
                        $(".isGood_think-footer").css("display", "block");
                        break;
                    case 'shareImg'://分享
                        shareUrlImg();
                        break;
                    case 'beginTest'://开始测试
                        $(".wenwen-footer").css("display", "none");
                        $(".answer-footer").css("display", "block");
                        $(".answer-footer .answer1").css("display", "block");
                        break;
                    case 'bianmi'://开始测试
                        show_img('bianmi');
                        break;
                    case 'fali'://开始测试
                        show_img('fali');
                        break;
                    case 'shishui'://开始测试
                        show_img('shishui');
                        break;
                    case 'feipang'://开始测试
                        show_img('feipang');
                        break;
                    case 'weihanpaleng'://开始测试
                        show_img('weihanpaleng');
                        break;
                    case 'chuhanshao'://开始测试
                        show_img('chuhanshao');
                        break;
                    case 'pifuganzao'://开始测试
                        show_img('pifuganzao');
                        break;
                    case 'zhijia'://开始测试
                        show_img('zhijia');
                        break;
                    case 'shiyubuzhen'://开始测试
                        show_img('shiyubuzhen');
                        break;
                    case 'zhuyili'://开始测试
                        show_img('zhuyili');
                        break;
                    case 'jiyili'://开始测试
                        show_img('jiyili');
                        break;
                    case 'qingxudiluo'://开始测试
                        show_img('qingxudiluo');
                        break;
                    case 'fuzhong'://开始测试
                        show_img('fuzhong');
                        break;
                    case 'jirou'://开始测试
                        show_img('jirou');
                        break;
                    case 'chihuan'://开始测试
                        show_img('chihuan');
                        break;
                    case 'xinlvhuanman'://开始测试
                        show_img('xinlvhuanman');
                        break;
                    case 'buyun'://开始测试
                        show_img('buyun');
                        break;
                    case 'yuejingshitiao'://开始测试
                        show_img('yuejingshitiao');
                        break;
                    case 'pifutuipi'://开始测试
                        show_img('pifutuipi');
                        break;
                }
            }

        }
    });
}

function show_img(path_img) {
    var img;
    switch (path_img) {
        case 'bianmi':
            img = '便秘.jpg';
            break;
        case 'fali'://开始测试
            img = '疲乏无力.jpg';
            break;
        case 'shishui'://开始测试
            img = '嗜睡.jpg';
            break;
        case 'feipang'://开始测试
            img = '肥胖.jpg';
            break;
        case 'weihanpaleng'://开始测试
            img = '畏寒怕冷.jpg';
            break;
        case 'chuhanshao'://开始测试
            img = '出汗少.jpg';
            break;
        case 'pifuganzao'://开始测试
            img = '皮肤干燥.jpg';
            break;
        case 'zhijia'://开始测试
            img = '指甲变脆易断.jpg';
            break;
        case 'shiyubuzhen'://开始测试
            img = '食欲不振.jpg';
            break;
        case 'zhuyili'://开始测试
            img = '注意力难集中.jpg';
            break;
        case 'jiyili'://开始测试
            img = '记忆力下降.jpg';
            break;
        case 'qingxudiluo'://开始测试
            img = '情绪低落抑郁.jpg';
            break;
        case 'fuzhong'://开始测试
            img = '身体浮肿.jpg';
            break;
        case 'jirou'://开始测试
            img = '肌肉酸痛.jpg';
            break;
        case 'chihuan'://开始测试
            img = '行动迟缓.jpg';
            break;
        case 'xinlvhuanman'://开始测试
            img = '心率缓慢.jpg';
            break;
        case 'buyun'://开始测试
            img = '女性不孕.jpg';
            break;
        case 'yuejingshitiao'://开始测试
            img = '月经.jpg';
            break;
        case 'pifutuipi'://开始测试
            img = '皮肤脱屑.jpg';
            break;
    }
    var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
    ans += '<div class="answer_text"><div class="my-gallery imgS" data-pswp-uid="2"><figure itemprop="associatedMedia" itemscope itemtype=""><a href="/assets/img/yjl/images/' + img + '" itemprop="contentUrl" data-size="800x800"><img src="/assets/img/yjl/images/' + img + '" itemprop="thumbnail" alt="Image description" class="imgSi"/></a></figure></div><i></i>'
    ans += '</div></div>';
    $('.speak_box').append(ans);
    initPhotoSwipeFromDOM('.my-gallery');//dom结构获取后再执行
    for_bottom();


}

/**
 * 分享页
 */
function shareUrlImg() {
    var arr = ['将您的关心分享给大家吧！立即点击下图吧！'];

    // var index = Math.floor((Math.random() * arr.length));

    var url = "http://aicp.jkbk.cn/yjl/yjl/share";
    var ans = '<div class="question"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
    ans += '<div class="answer_text clear" id="question_text_my" style="max-width: 278px;"><a href="' + url + '"><p><span class="text_my-link-title">' + arr + '</span><span class="text_my-link-box cf"><span class="text_my-link-left"></span><span class="text_my-link-right"><img src="/assets/img/yjl/images/share.jpg" alt="" /></span></span></p></a><i></i>';
    ans += '</div></div>';
    $('.speak_box').append(ans);
    for_bottom();
}

/**
 * 症状描述 了解更多
 */
function du_pop() {
    $("#du-popup_layer").css("display", "block");
    $(".du-pop-close").on('touchend', function () {
        $("#du-popup_layer").css("display", "none");
    });
}

/**
 * 环境护理
 */
function huli_pop() {
    $("#hl-popup_layer").css("display", "block");
    $(".hl-pop-close").on('touchend', function () {
        $("#hl-popup_layer").css("display", "none");
    });
}

function return_chatboot_msg(msg) {

    var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
    ans += '<div class="answer_text"><p>' + msg + '</p><i></i>';
    ans += '</div></div>';
    $('.speak_box').append(ans);
    for_bottom();
}

function return_user_msg(msg) {
    var ans = '<div class="question"><div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
    ans += '<div class="question_text clear" id="question_text_my"><p>' + msg + '</p><i></i>';
    ans += '</div></div>';
    $('.speak_box').append(ans);
    for_bottom();
}


function checkYes(clickNum) {

    switch (clickNum) {
        case '好的':
            return_user_msg('好的');
            postAjax('OK', session_id, 0);

            $(".wenwen-footer").css("display", "block");
            $(".sh_think-footer").css("display", "none");
            break;
        case '残忍拒绝': //3-14周岁
            return_user_msg('不了，我已了解');
            postAjax('不好', session_id, 0);
            $(".wenwen-footer").css("display", "block");
            $(".sh_think-footer").css("display", "none");
            break;
        case 'OK-康复建议':
            return_user_msg('日常注意');
            postAjax('YES', session_id, 0);
            $(".wenwen-footer").css("display", "block");
            $(".kangFu_think-footer").css("display", "none");
            break;
        case 'NO-康复建议':
            return_user_msg('我已了解');
            postAjax('NO', session_id, 0);
            $(".wenwen-footer").css("display", "block");
            $(".kangFu_think-footer").css("display", "none");
            break;
        case 'NO-不满意':
            return_user_msg('有待完善');
            postAjax('NO', session_id, 0);
            $(".wenwen-footer").css("display", "block");
            $(".isGood_think-footer").css("display", "none");
            break;
        case 'OK-满意':
            return_user_msg('满意');
            postAjax('YES', session_id, 0);
            $(".wenwen-footer").css("display", "block");
            $(".isGood_think-footer").css("display", "none");
            break;
    }

}


function to_write() {

    $('.wenwen_btn img').attr('src', '/assets/img/yjl/images/yy_btn.png');
    $('.wenwen_btn').attr('onclick', 'to_say()');
    $('.write_box,.wenwen_help button').show();
    $('.circle-button,.wenwen_help a').hide();
    $('.write_box input').focus();
    for_bottom();
}

function to_say() {
    $('.wenwen_btn img').attr('src', '/assets/img/yjl/images/jp_btn.png');
    $('.wenwen_btn').attr('onclick', 'to_write()');
    $('.write_box,.wenwen_help button').hide();
    $('.circle-button,.wenwen_help a').show();
    for_bottom();
}

function up_say() {
    $('.write_list').remove();
    var text = $('.write_box input').val(),
        str = '<div class="question">';
    str += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
    str += '<div class="question_text clear" id="question_text_my"><p>' + text + '</p><i></i>';
    str += '</div></div>';

    if (text == '') {
        alert('请输入提问！');
        $('.write_box input').focus();
    } else {
        $('.speak_box').append(str);
        $('.write_box input').val('');
        $('.write_box input').focus();
        autoWidth();
        for_bottom();

        postAjax(text, session_id);

    }
}

function keyup() {
    var footer_height = $('.wenwen-footer').outerHeight(),
        text = $('.write_box input').val(),
        str = '<div class="write_list">' + text + '</div>';
    if (text == '' || text == undefined) {
        $('.write_list').remove();
    } else {

    }
}

var wen = document.getElementById('wenwen');

function _touch_start(event) {
    event.preventDefault();

    var constraints = {auido: true};


    MediaDevices.getUserMedia(constraints, onSuccess, onError);


    $('.wenwen_text').css('background', '#c1c1c1');
    $('.wenwen_text span').css('color', '#fff');
    $('.saying').show();
}

function onSuccess(stream) {
    var video = document.querySelector("video");
    video.src = window.URL.createObjectURL(stream);
}

function onError(error) {
    console.log("navigator.getUserMedia error: ", error);
}


function _touch_end(event) {

    /*
    event.preventDefault();
    $('.wenwen_text').css('background','#fff');
    $('.wenwen_text .circle-button').css('color','#666');
    $('.saying').hide();
    var str  = '<div class="question">';
    str += '<div class="heard_img right"><img src="images/profle.jpg"></div>';
    str += '<div class="question_text clear"><p>不好意思，我听不清！</p>';
    str += '</div></div>';
    $('.speak_box').append(str);
    for_bottom();
    setTimeout(function(){
        var ans  = '<div class="answer"><div class="heard_img left"><img src="images/doctor.png"></div>';
        ans += '<div class="answer_text"><p>我不知道你在说什么?</p>';
        ans += '</div></div>';
        $('.speak_box').append(ans);
        for_bottom();
    },1000);
    */
}

wen.addEventListener("touchstart", _touch_start, false);

//wen.addEventListener("touchend", _touch_end, false);

function for_bottom() {
    var all_footer = $('.answer-footer').height();
    $('.speak_box').css("margin-bottom", all_footer);
    var speak_height = $('.speak_box').height();
    console.log(speak_height);
    $('.speak_box,.speak_window').animate({scrollTop: speak_height}, 500);
}

function autoWidth() {
    console.log($('.question').width() - 60);
    $('.question_text').css('max-width', $('.question').width() - 100);
}
