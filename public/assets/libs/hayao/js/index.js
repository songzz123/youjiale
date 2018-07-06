var last_node_id = '';
var session_id = '';
var ageType = 0;
var url = 'http://aicp.jkbk.cn/hayao/';
// var url = 'http://www.newai.com/hayao/';
var typeurl = $("input[name=url]").attr('data-value');
$(document).ready(function () {

    $(document).keyup(function (e) {//捕获文档对象的按键弹起事件
        if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
            up_say();
        }
    });


    //进入时发送空请求
    $.ajax({
        type: "post",  //提交方式
        url: url + "hayao/getindexdata",//路径
        data: {'typeurl': typeurl},//数据，这里使用的是Json格式进行传输
        dataType: "json",
        success: function (result) {//返回数据根据结果进行相应的处理
            session_id = result.session_id;
            for (var i = 0; i < result.result_num; i++) {
                if (result.value[i].value) {
                    if (result.value[i].value) {
                        if (i == 0) {
                            var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/hayao/images/doctor.png"></div>';
                            ans += '<div class="answer_text"><p>' + result.value[0].value + '<a href="javascript:void(0);" onclick="du_pop();return false;" style="color:#919191;text-decoration: none;" > 查看免责声明</a></p><i></i>'; // class="reviewBtnTop"
                            ans += '</div></div>';
                            $('.speak_box').append(ans);
                            for_bottom();
                        } else {
                            return_chatboot_msg(result.value[i].value);
                        }
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
function du_pop() {
    $("#du-popup_layer").css("display", "block");
    $(".du-pop-close").on('touchend', function () {
        $("#du-popup_layer").css("display", "none");
    });
}

// 生长发育自测
$("#sub").on('touchend', function () {
    var age = $("input[name='age']").val();
    var sex = $("input[type='radio']:checked").val();
    var height = $("input[name='height']").val();
    var weight = $("input[name='weight']").val();
    if (age == '' || sex == undefined || height == '' || weight == '') {
        return_chatboot_msg('必须全部写进去┗|｀O′|┛ 嗷~~');
        return false;
    }
    // console.log(data);
    $.ajax({
        url: url + 'hayao/testFunc',
        type: 'post',
        dataType: 'json',
        data: {
            'age': age,
            'sex': sex,
            'height': height,
            'weight': weight,
            'session_id': session_id
        },
        success: function (ms) {
            $("input[name='age']").val('');
            $("input[type='radio']").attr('checked', false);
            $("input[name='height']").val('');
            $("input[name='weight']").val('');
            console.log(ms);
            var img = '';
            switch (ms.zz) {
                case '偏矮':
                    img = '/assets/img/hayao/images/pianai.png'; // 偏矮
                    break;
                case '矮瘦':
                    img = '/assets/img/hayao/images/aishou.png';
                    break;
                case '矮胖':
                    img = '/assets/img/hayao/images/aipang.png';
                    break;
                case '偏瘦':
                    img = '/assets/img/hayao/images/pianshou.png';
                    break;
                case '超重':
                    img = '/assets/img/hayao/images/chaozhong.png';
                    break;
                case '肥胖':
                    img = '/assets/img/hayao/images/feipang.png';
                    break;
                case '正常':
                    img = '/assets/img/hayao/images/zc.png';
                    break;
            }
            if (ms.code == 400) {
                alert(ms.msg);
            } else if (ms.code == 200) {
                return_chatboot_test_msg(ms.mbi, img, ms.zz, ms.tops, ms.msgs, ms.sex);
                fy_pop()
                getResult();
                postAjax('', session_id, 1, 'testFunc', ms.zz);
                $(".testFunc-footer").css("display", "none");
            }
            // else if (ms.code == 201) {
            //     return_chatboot_test_msg(ms.mbi, img, ms.zz, ms.tops, ms.msgs,ms.sex);
            //     fy_pop()
            //     getResult();
            //     postAjax('', session_id, 1, 'testFunc', '状况不好');
            //     $(".testFunc-footer").css("display", "none");
            // }
        }
    });
});

function postAjax(text, session_id, context, k, v) {

    console.log(typeurl);
    if (context == 1) {
        var data = {
            "query_text": text,
            "session_id": session_id,
            "context": "context",
            "k": k,
            "v": v,
            'typeurl': typeurl
        };
    } else {
        var data = {"query_text": text, "session_id": session_id, 'typeurl': typeurl};
    }
    $.ajax({
        type: "post",  //提交方式
        url: url + "hayao/getindexdata",//路径
        data: data,//数据，这里使用的是Json格式进行传输
        dataType: "json",
        success: function (result) {//返回数据根据结果进行相应的处理
            var rellsut = '';
            var session_id = result.session_id;
            for (var i = 0; i < result.result_num; i++) {
                if (result.value[i].value) {
                    if (result.value[i].action == 'more_child_life') {
                        rellsut = result.value[i].value + '<a href="javascript:void(0);" onclick="sz_pop();return false;" style="color:white;text-decoration: none;" class="reviewBtn">了解更多</a>';
                        return_chatboot_msg(rellsut);
                        postAjax('生长发育自测', session_id);
                    } else if (result.value[i].action == 'no_child_life') {
                        rellsut = result.value[i].value + '<a href="javascript:void(0);" onclick="sz_pop();return false;" style="color:white;text-decoration: none;" class="reviewBtn">了解更多</a>';
                        return_chatboot_msg(rellsut);
                    } else if (result.value[i].action == 'howDoEat') {
                        show_img('/assets/img/hayao/images/shipu.jpeg', result.value[i].value);
                        postAjax('生长发育自测', session_id);
                        // return_chatboot_msg(rellsut);
                    } else if (result.value[i].action == 'howDoEatTwo') {
                        show_img('/assets/img/hayao/images/shipu.jpeg', result.value[i].value);
                        postAjax('引导用户输入关键字', session_id);
                        // return_chatboot_msg(rellsut);
                    } else {
                        return_chatboot_msg(result.value[i].value);
                    }
                }
                switch (result.value[i].action) {
                    case 'Ask':
                        $(".wenwen-footer").css("display", "none");
                        $(".yesorno-footer").css("display", "block");
                        break;
                    case 'heightAlert':
                        $(".wenwen-footer").css("display", "none");
                        $(".growup-footer").css("display", "block");
                        break;
                    case 'FirstTest':
                        $(".wenwen-footer").css("display", "none");
                        $(".answer-footer").css("display", "block");
                        $(".answer1").css("display", "block");
                        break;
                    case 'SecondTest':
                        $(".wenwen-footer").css("display", "none");
                        $(".answer-footer").css("display", "block");
                        $(".answer2").css("display", "block");
                        break;
                    case 'ThreeTest':
                        $(".wenwen-footer").css("display", "none");
                        $(".answer-footer").css("display", "block");
                        $(".answer3").css("display", "block");
                        break;
                    case 'beginTest':
                        $(".wenwen-footer").css("display", "none");
                        $(".answer-footer").css("display", "block");
                        break;

                    case  'sanJing': // 显示 三精两款产品 酸锌 酸钙
                        $(".wenwen-footer").css("display", "none");
                        $(".sanjing-footer").css("display", "block");
                        break;
                    case 'sanjing-xins': // 三精葡萄糖酸锌 FAQ
                        $(".sanjing-xin-footer").css("display", "block");
                        break;
                    case 'sanjing-gais': // 三精葡萄糖酸钙 FAQ
                        $(".sanjing-gai-footer").css("display", "block");
                        break;
                    case 'howDo': // 概念类 营养均衡跳转自测函数路径
                        postAjax('生长发育自测', session_id);
                        break;
                    // case 'howDoEat': // 概念类 营养均衡跳转自测函数路径
                    //     show_img('/testhayao/images/shipu.jpeg', result.value[i].value);
                    //     postAjax('生长发育自测', session_id);
                    //     break;
                    case 'howZnCa': // 跳转补钙补锌路径
                        postAjax('孩子缺钙缺锌怎么办', session_id);
                        break;
                    case 'howCa': // 跳转缺钙路径
                        postAjax('孩子缺钙怎么办', session_id);
                        break;
                    case 'howOther': // 跳转other-营养路径
                        postAjax('孩子缺少other营养怎么办', session_id);
                        break;

                    // 解决方案
                    case 'Zn': // 锌
                        $(".wenwen-footer").css("display", "none");
                        $(".Zn-footer").css("display", "block");
                        break;
                    case 'Ca': // 钙
                        $(".wenwen-footer").css("display", "none");
                        $(".Ca-footer").css("display", "block");
                        break;
                    case 'ZnCa': // 钙锌
                        $(".wenwen-footer").css("display", "none");
                        $(".ZnCa-footer").css("display", "block");
                        break;
                    case 'CoH2o': // 碳水化合物
                        $(".wenwen-footer").css("display", "none");
                        $(".tan-footer").css("display", "block");
                        break;
                    case 'danbaizhi': // 蛋白质
                        $(".wenwen-footer").css("display", "none");
                        $(".dan-footer").css("display", "block");
                        break;
                    case 'vc': // 维生素
                        $(".wenwen-footer").css("display", "none");
                        $(".vc-footer").css("display", "block");
                        break;
                    case 'kuang': // 矿物质
                        $(".wenwen-footer").css("display", "none");
                        $(".kuang-footer").css("display", "block");
                        break;
                    case 'weiliang': // 微量元素
                        $(".wenwen-footer").css("display", "none");
                        $(".wei-footer").css("display", "block");
                        break;
                    case 'yishengjun': // 益生菌
                        $(".wenwen-footer").css("display", "none");
                        $(".yi-footer").css("display", "block");
                        break;
                    case 'dha': // DHA
                        $(".wenwen-footer").css("display", "none");
                        $(".dha-footer").css("display", "block");
                        break;
                    case 'other': // 其他元素
                        $(".wenwen-footer").css("display", "none");
                        $(".other-footer").css("display", "block");
                        break;
                    // 生长发育自测 显示
                    case 'heightFatTest':
                        // 显示测试弹窗 跳转 test.html
                        $(".wenwen-footer").css("display", "none");
                        // $(".test-footer").css("display", "block");
                        $(".testFunc-footer").css("display", "block");
                        break;
                    case 'yfzlZx': // 预防治疗 && 专业咨询
                        // 显示测试弹窗 跳转 test.html
                        $(".wenwen-footer").css("display", "none");
                        $(".helpFunc-footer").css("display", "block");
                        break;
                    case 'zlAlert':
                        $(".wenwen-footer").css("display", "none");
                        $(".manyFunc-footer").css("display", "block");
                        break;
                    case 'fatFunc':
                        $(".wenwen-footer").css("display", "none");
                        $(".fatFunc-footer").css("display", "block");
                        break;
                    case 'sinFunc':
                        $(".wenwen-footer").css("display", "none");
                        $(".sinFunc-footer").css("display", "block");
                        break;

                }
            }

        }
    });
}

function show_img(path_img, content) {
    var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/hayao/images/doctor.png"></div>';
    ans += '<div class="answer_text">' +
        '<div class="my-gallery imgS" data-pswp-uid="2">' +
        // '<figure itemprop="associatedMedia" itemscope itemtype="">' +
        // '<a href="' + path_img + '" itemprop="contentUrl" data-size="800x800"  style="color:white;text-decoration: none;" class="tanchu">' +
        '<img src=' + path_img + ' itemprop="thumbnail" alt="Image description" class="imgSi"/><p style="color:white;text-decoration: none;">点击图片查看食谱</p>' +
        // '</a>' +
        // '</figure>' +
        '</div>' +
        '<i></i>';
    ans += '</div></div>';
    $('.speak_box').append(ans);
    initPhotoSwipeFromDOM('.my-gallery');//dom结构获取后再执行
    for_bottom();
    $(".imgSi").on('touchend', function () {
        sp_pop(content);
    });

}


/*******
 ** 哈 **
 ** 药 **
 ** 了 **
 ** 解 **
 ** 更 **
 ** 多 **
 *******/
function sz_pop() {
    $("#hy-popup_layer").css("display", "block");
    $(".hy-pop-close").on('touchend', function () {
        $("#hy-popup_layer").css("display", "none");
    });
}

/*******
 ** 食 **
 ** 谱 **
 ** 了 **
 ** 解 **
 ** 更 **
 ** 多 **
 *******/
function sp_pop(content) {
    $("#sp-popup_layer").css("display", "block");
    $("#sp-popup_layer p").html(content);
    $(".sp-pop-close").on('touchend', function () {
        $("#sp-popup_layer").css("display", "none");
        $("#sp-popup_layer p").html('');
    });
}

/*******
 ** 哈 **
 ** 药 **
 ** 了 **
 ** 解 **
 ** 更 **
 ** 多 **
 *******/
function fy_pop() {
    $("#fy-popup_layer").css("display", "block");
    $(".fy-pop-close").on('touchend', function () {
        $("#fy-popup_layer").css("display", "none");
    });
}

function getResult() {
    var rellsut = '点击<a href="javascript:void(0);" onclick="fy_pop();return false;" style="color:white;text-decoration: none;" class="reviewBtn">了解详情</a>查看孩子的自测结果吧';
    return_chatboot_msg(rellsut);
}

function return_chatboot_test_msg(mbi, img, zz, top, msg, sex) {
    if (sex == 0) {
        $(".fy-popup-size >p").html('根据您提供的信息，您的孩子目前生长发育情况：<span style="color: red;"><b>' + zz + '</b></span><br>在全国同年龄阶段男孩子中，身高排名为：<span style="color: red;"><b>' + top + '</b></span>,超过了<span style="color: red;"><b>' + msg + '</b></span>的小朋友<br>经小度认真评估，宝宝的BMI值（身高体重指数）为：<span style="color: red;"><b>' + mbi + '</b></span><br>');
    } else {
        $(".fy-popup-size >p").html('根据您提供的信息，您的孩子目前生长发育情况：<span style="color: red;"><b>' + zz + '</b></span><br>在全国同年龄阶段女孩子中，身高排名为：<span style="color: red;"><b>' + top + '</b></span>,超过了<span style="color: red;"><b>' + msg + '</b></span>的小朋友<br>经小度认真评估，宝宝的BMI值（身高体重指数）为：<span style="color: red;"><b>' + mbi + '</b></span><br>');
    }
    $(".fy-popup-size >img").attr('src', img);
    return true;
}


function return_chatboot_msg(msg) {

    var ans = '<div class="answer"><div class="heard_img left"><img src="/assets/img/hayao/images/doctor.png"></div>';
    ans += '<div class="answer_text"><p>' + msg + '</p><i></i>';
    ans += '</div></div>';
    $('.speak_box').append(ans);
    // for_bottom();
    for_bottom_one();
}

function return_user_msg(msg) {
    var ans = '<div class="question"><div class="heard_img right"><img src="/assets/img/hayao/images/profle.png"></div>';
    ans += '<div class="question_text clear" id="question_text_my" style="max-width: 239px;"><p>' + msg + '</p><i></i>';
    ans += '</div></div>';
    $('.speak_box').append(ans);
    for_bottom();
}


function checkYes(clickNum) {
    switch (clickNum) {
        case 0:
            return_user_msg('不用了，我已了解');
            postAjax('不好', session_id);

            $(".yesorno-footer").css("display", "none");
            $(".wenwen-footer").css("display", "block");
            break;
        case 1:
            return_user_msg('好的');
            postAjax('好的', session_id);

            $(".yesorno-footer").css("display", "none");
            $(".wenwen-footer").css("display", "block");
            break;
        case '营养饮食':
            return_user_msg('营养饮食');
            postAjax('', session_id, 1, 'eatFunc', '营养饮食');

            $(".growup-footer").css("display", "none");
            $(".wenwen-footer").css("display", "block");
            break;
        case '运动睡眠和心态':
            return_user_msg('运动睡眠和心态');
            postAjax('', session_id, 1, 'eatFunc', '运动睡眠和心态');

            $(".growup-footer").css("display", "none");
            $(".wenwen-footer").css("display", "block");
            break;
        case '三精葡萄糖酸锌':// 三精葡萄糖酸锌
            return_user_msg('三精葡萄糖酸锌');
            postAjax('', session_id, 1, 'pro', '三精葡萄糖酸锌');

            $(".sanjing-footer").css("display", "none");
            $(".wenwen-footer").css("display", "block");
            break;
        case '三精葡萄糖酸钙': // 三精葡萄糖酸钙
            return_user_msg('三精葡萄糖酸钙');
            postAjax('', session_id, 1, 'pro', '三精葡萄糖酸钙');

            $(".sanjing-footer").css("display", "none");
            $(".wenwen-footer").css("display", "block");
            break;
        case '锌-是什么': // 锌-是什么
            return_user_msg('“锌”介绍');
            postAjax('', session_id, 1, 'what', '锌-是什么');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-xin-footer").css("display", "none");
            break;
        case '锌-成分': // 锌-是什么
            return_user_msg('“锌”成分');
            postAjax('', session_id, 1, 'what', '锌-成分');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-xin-footer").css("display", "none");
            break;
        case '锌-主治功能': // 锌-是什么
            return_user_msg('“锌”功能');
            postAjax('', session_id, 1, 'what', '锌-主治功能');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-xin-footer").css("display", "none");
            break;
        case '锌-疗效': // 锌-是什么
            return_user_msg('“锌”疗效');
            postAjax('', session_id, 1, 'what', '锌-疗效');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-xin-footer").css("display", "none");
            break;

        case '钙-是什么': // 钙-是什么
            return_user_msg('是什么？');
            postAjax('', session_id, 1, 'what', '钙-是什么');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-gai-footer").css("display", "none");
            break;
        case '钙-成分': // 钙-是什么
            return_user_msg('成分？');
            postAjax('', session_id, 1, 'what', '钙-成分');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-gai-footer").css("display", "none");
            break;
        case '钙-主治功能': // 钙-是什么
            return_user_msg('主治功能？');
            postAjax('', session_id, 1, 'what', '钙-主治功能');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-gai-footer").css("display", "none");
            break;
        case '钙-疗效': // 钙-是什么
            return_user_msg('疗效？');
            postAjax('', session_id, 1, 'what', '钙-疗效');
            $(".wenwen-footer").css("display", "block");
            $(".sanjing-gai-footer").css("display", "none");
            break;
        case 'other-eat': // other 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'other-eat');

            $(".wenwen-footer").css("display", "block");
            $(".other-footer").css("display", "none");
            break;
        case 'other-life': // other 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'other-life');

            $(".wenwen-footer").css("display", "block");
            $(".other-footer").css("display", "none");
            break;
        case 'dha-eat': // dha 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'dha-eat');

            $(".wenwen-footer").css("display", "block");
            $(".dha-footer").css("display", "none");
            break;
        case 'dha-life': // dha 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'dha-life');

            $(".wenwen-footer").css("display", "block");
            $(".dha-footer").css("display", "none");
            break;
        case 'yi-eat': // yi 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'yi-eat');

            $(".wenwen-footer").css("display", "block");
            $(".yi-footer").css("display", "none");
            break;
        case 'yi-life': // yi 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'yi-life');

            $(".wenwen-footer").css("display", "block");
            $(".yi-footer").css("display", "none");
            break;
        case 'wei-eat': // wei 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'wei-eat');

            $(".wenwen-footer").css("display", "block");
            $(".wei-footer").css("display", "none");
            break;
        case 'wei-life': // wei 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'wei-life');

            $(".wenwen-footer").css("display", "block");
            $(".wei-footer").css("display", "none");
            break;
        case 'kuang-eat': // kuang 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'kuang-eat');

            $(".wenwen-footer").css("display", "block");
            $(".kuang-footer").css("display", "none");
            break;
        case 'kuang-life': // kuang 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'kuang-life');

            $(".wenwen-footer").css("display", "block");
            $(".kuang-footer").css("display", "none");
            break;
        case 'vc-eat': // vc 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'vc-eat');

            $(".wenwen-footer").css("display", "block");
            $(".vc-footer").css("display", "none");
            break;
        case 'vc-life': // vc 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'vc-life');

            $(".wenwen-footer").css("display", "block");
            $(".vc-footer").css("display", "none");
            break;
        case 'dan-eat': // dan 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'dan-eat');

            $(".wenwen-footer").css("display", "block");
            $(".dan-footer").css("display", "none");
            break;
        case 'dan-life': // dan 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'dan-life');

            $(".wenwen-footer").css("display", "block");
            $(".dan-footer").css("display", "none");
            break;
        case 'tan-eat': // tan 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'tan-eat');

            $(".wenwen-footer").css("display", "block");
            $(".tan-footer").css("display", "none");
            break;
        case 'tan-life': // tan 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'tan-life');

            $(".wenwen-footer").css("display", "block");
            $(".tan-footer").css("display", "none");
            break;
        case 'ZnCa-eat': // ZnCa 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'ZnCa-eat');

            $(".wenwen-footer").css("display", "block");
            $(".ZnCa-footer").css("display", "none");
            break;
        case 'ZnCa-life': // ZnCa 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'ZnCa-life');

            $(".wenwen-footer").css("display", "block");
            $(".ZnCa-footer").css("display", "none");
            break;
        case 'Ca-eat': // Ca 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'Ca-eat');

            $(".wenwen-footer").css("display", "block");
            $(".Ca-footer").css("display", "none");
            break;
        case 'Ca-life': // Ca 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'Ca-life');

            $(".wenwen-footer").css("display", "block");
            $(".Ca-footer").css("display", "none");
            break;
        case 'Zn-eat': // Zn 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'solve_func', 'Zn-eat');

            $(".wenwen-footer").css("display", "block");
            $(".Zn-footer").css("display", "none");
            break;
        case 'Zn-life': // Zn 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'solve_func', 'Zn-life');

            $(".wenwen-footer").css("display", "block");
            $(".Zn-footer").css("display", "none");
            break;
        case 'Zn-yingyang': // Zn 生活方式
            return_user_msg('营养补充剂');
            postAjax('', session_id, 1, 'solve_func', 'Zn-yingyang');

            $(".wenwen-footer").css("display", "block");
            $(".Zn-footer").css("display", "none");
            break;
        case 'Ca-yingyang': // Zn 生活方式
            return_user_msg('营养补充剂');
            postAjax('', session_id, 1, 'solve_func', 'Ca-yingyang');

            $(".wenwen-footer").css("display", "block");
            $(".Ca-footer").css("display", "none");
            break;
        case 'ZnCa-yingyang': // Zn 生活方式
            return_user_msg('营养补充剂');
            postAjax('', session_id, 1, 'solve_func', 'ZnCa-yingyang');

            $(".wenwen-footer").css("display", "block");
            $(".ZnCa-footer").css("display", "none");
            break;


        // case 'test-good': // 状况良好
        //     return_user_msg('状况良好');
        //     postAjax('', session_id, 1, 'testFunc', '状况良好');
        //
        //     $(".wenwen-footer").css("display", "block");
        //     $(".test-footer").css("display", "none");
        //     break;
        // case 'test-bad': // 状况不好
        //     return_user_msg('状况不好');
        //     postAjax('', session_id, 1, 'testFunc', '状况不好');
        //
        //     $(".wenwen-footer").css("display", "block");
        //     $(".test-footer").css("display", "none");
        //     break;
        case 'helpFunc-yfzl': // 预防治疗
            return_user_msg('预防治疗');
            postAjax('', session_id, 1, 'helpFunc', '预防治疗');

            $(".wenwen-footer").css("display", "block");
            $(".helpFunc-footer").css("display", "none");
            break;
        case 'helpFunc-zyzx': // 专业咨询
            return_user_msg('专业咨询');
            postAjax('', session_id, 1, 'helpFunc', '专业咨询');

            $(".wenwen-footer").css("display", "block");
            $(".helpFunc-footer").css("display", "none");
            break;
        case 'fatFunc-yskz': // 饮食控制
            return_user_msg('饮食控制');
            postAjax('', session_id, 1, 'mergeFunc', '饮食控制');

            $(".wenwen-footer").css("display", "block");
            $(".fatFunc-footer").css("display", "none");
            break;
        case 'fatFunc-jcyd': // 坚持运动
            return_user_msg('坚持运动');
            postAjax('', session_id, 1, 'mergeFunc', '坚持运动');

            $(".wenwen-footer").css("display", "block");
            $(".fatFunc-footer").css("display", "none");
            break;
        case 'sinFunc-yscj': // 饮食促进
            return_user_msg('饮食促进');
            postAjax('', session_id, 1, 'mergeFunc', '饮食促进');

            $(".wenwen-footer").css("display", "block");
            $(".sinFunc-footer").css("display", "none");
            break;
        case 'sinFunc-xggl': // 习惯管理
            return_user_msg('习惯管理');
            postAjax('', session_id, 1, 'mergeFunc', '习惯管理');

            $(".wenwen-footer").css("display", "block");
            $(".sinFunc-footer").css("display", "none");
            break;
        case 'many-eat': // 饮食习惯
            return_user_msg('饮食习惯');
            postAjax('', session_id, 1, 'yfzllife', '饮食习惯');

            $(".wenwen-footer").css("display", "block");
            $(".manyFunc-footer").css("display", "none");
            break;
        case 'many-life': // 生活方式
            return_user_msg('生活方式');
            postAjax('', session_id, 1, 'yfzllife', '生活方式');

            $(".wenwen-footer").css("display", "block");
            $(".manyFunc-footer").css("display", "none");
            break;
        case 'many-yingyang': // 营养补充剂
            return_user_msg('营养补充剂');
            postAjax('', session_id, 1, 'yfzllife', '营养补充剂');

            $(".wenwen-footer").css("display", "block");
            $(".manyFunc-footer").css("display", "none");
            break;
    }

}


function to_write() {

    $('.wenwen_btn img').attr('src', '/assets/img/hayao/images/yy_btn.png');
    $('.wenwen_btn').attr('onclick', 'to_say()');
    $('.write_box,.wenwen_help button').show();
    $('.circle-button,.wenwen_help a').hide();
    $('.write_box input').focus();
    for_bottom();
}

function to_say() {
    $('.wenwen_btn img').attr('src', '/assets/img/hayao/images/jp_btn.png');
    $('.wenwen_btn').attr('onclick', 'to_write()');
    $('.write_box,.wenwen_help button').hide();
    $('.circle-button,.wenwen_help a').show();
    for_bottom();
}

function up_say() {
    $('.write_list').remove();
    var text = $('.write_box input').val(),
        str = '<div class="question">';
    str += '<div class="heard_img right"><img src="/assets/img/hayao/images/profle.png"></div>';
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
        // for_bottom();
        for_bottom_one();
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
    str += '<div class="heard_img right"><img src="images/profle.png"></div>';
    str += '<div class="question_text clear"><p>不好意思，我听不清！</p>';
    str += '</div></div>';
    $('.speak_box').append(str);
    for_bottom();
    setTimeout(function(){
        var ans  = '<div class="answer"><div class="heard_img left"><img src="images/doctor.jpg"></div>';
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

function for_bottom_one() {
    $('.speak_box').css("margin-bottom", '230px');
    console.log($('.speak_box').css('marginBottom'));
    var speak_height = $('.speak_box').height();
    // console.log(speak_height);
    $('.speak_box,.speak_window').animate({scrollTop: speak_height}, 500);
}

function autoWidth() {
    console.log($('.question').width() - 60);
    $('.question_text').css('max-width', $('.question').width() - 100);
}
