$(function () {

    var result = [];//创建一个空数组用来存选择的答案
    var k1 = 1;
    var k2 = 1;
    var k3 = 1;
    var k4 = 1;
    var k5 = 1;
    var k6 = 1;
    var k7 = 1;
    var k8 = 1;
    var k9 = 1;
    //给每一页绑定点击事件
    /*    
     * 在第五题的提交按钮点击方法里写结论
     * 其他是重复的多余。。。。。
     *
     * */
    function _bind() {
        //获取第一页所有的选项，绑定点击事件
        $('.answer1 .question-each').on('touchend', function () {
            if (k1) {

                var result1 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result1);//把每一题的选项添加到result数组里
                console.log(result);
                $(this).addClass("active");
                $('.answer1').siblings().find(".question-each").removeClass("active");
                //console.log($('.answer1').siblings().find(".question-each"));
                var titleCont = $('.answer1 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余8个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 500);

                $(".answer1").fadeOut(1000);
                $(".answer2").delay(1000).fadeIn(100);

                k1 = 0;
                k9 = 1;
                getAnswer(titleCont, session_id, result1);

            }
            //console.log(1);

        });
        $('.answer2 .question-each').on('touchend', function () {
            if (k2) {

                //console.log(1);
                var result2 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result2);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer2').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer2 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余7个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 500);

                $(".answer2").fadeOut(1000);
                $(".answer3").delay(1000).fadeIn(100);

                k2 = 0;
                k1 = 1;
                getAnswer(titleCont, session_id, result2);
            }

        });
        $('.answer3 .question-each').on('touchend', function () {
            if (k3) {
                //console.log(1);
                var result3 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result3);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer3').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer3 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余6个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 1000);

                $(".answer3").fadeOut(1000);
                $(".answer4").delay(1000).fadeIn(100);
                k3 = 0;
                k2 = 1;
                getAnswer(titleCont, session_id, result3)
            }

        });
        $('.answer4 .question-each').on('touchend', function () {
            if (k4) {
                //console.log(1);
                var result4 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result4);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer4').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer4 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余5个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 1000);

                $(".answer4").fadeOut(1000);
                $(".answer5").delay(1000).fadeIn(100);

                k4 = 0;
                k3 = 1;
                getAnswer(titleCont, session_id, result4)
            }

        });
        $('.answer5 .question-each').on('touchend', function () {
            if (k5) {
                //console.log(1);
                var result5 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result5);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer5').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer5 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余4个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 1000);

                $(".answer5").fadeOut(1000);
                $(".answer6").delay(1000).fadeIn(100);
                k5 = 0;
                k4 = 1;
                getAnswer(titleCont, session_id, result5)
            }

        });
        $('.answer6 .question-each').on('touchend', function () {
            if (k6) {
                //console.log(1);
                var result6 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result6);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer6').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer6 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余3个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 1000);

                $(".answer6").fadeOut(1000);
                $(".answer7").delay(1000).fadeIn(100);
                k6 = 0;
                k5 = 1;
                getAnswer(titleCont, session_id, result6)
            }

        });
        $('.answer7 .question-each').on('touchend', function () {
            if (k7) {
                //console.log(1);
                var result7 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result7);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer7').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer7 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余2个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 1000);

                $(".answer7").fadeOut(1000);
                $(".answer8").delay(1000).fadeIn(100);
                k7 = 0;
                k6 = 1;
                getAnswer(titleCont, session_id, result7)
            }
        });
        $('.answer8 .question-each').on('touchend', function () {
            if (k8) {
                //console.log(1);
                var result8 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result8);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer8').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer8 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '(剩余1个..)</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 1000);

                $(".answer8").fadeOut(1000);
                $(".answer9").delay(1000).fadeIn(100);
                k8 = 0
                k7 = 1;
                getAnswer(titleCont, session_id, result8)
            }
        });
        $('.answer9 .question-each').on('touchend', function () {
            if (k9) {

                //console.log(1);
                var result9 = $(this).data("select-number");//获取每一题所选的选项
                result.push(result9);//把每一题的选项添加到result数组里

                console.log(result);
                $(this).addClass("active");
                $('.answer9').siblings().find(".question-each").removeClass("active");

                var titleCont = $('.answer9 .answer-title').html();
                console.log(titleCont);
                var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/yjl/images/doctor.png"></div>';
                answerNew += '<div class="answer_text"><p>' + titleCont + '</p><i></i>';
                answerNew += '</div></div>';
                $('.speak_box').append(answerNew);
                for_bottom();
                var questionCont = $(this).html();

                setTimeout(function () {

                    console.log(questionCont);
                    var questionNew = '<div class="question">';
                    questionNew += '<div class="heard_img right"><img src="/assets/img/yjl/images/profle.jpg"></div>';
                    questionNew += '<div class="question_text clear"><p>' + questionCont + '</p><i></i>';
                    questionNew += '</div></div>';
                    $('.speak_box').append(questionNew);
                    for_bottom();
                }, 500);

                getAnswer(titleCont, session_id, result9)
                var data = {
                    act: 'sh_sub_test',
                    session_id: session_id,
                    answer: JSON.stringify(result)
                };


                $.ajax({
                    type: "post",
                    url: url+"yjl/ajaxAction",
                    data: {data: JSON.stringify(data)},
                    dataType: "json",
                    success: function (data) {
                        if (data.code == 200) {
                            setTimeout(function () {
                                postAjax('', session_id, 1, 'solve_result', data.msg);
                            }, 1000);
                        }
                    }
                });

                $(".answer-footer").css("display", "none");
                $(".answer9").css("display", "none");
                $(".answer1").css("display", "block");
                $(".wenwen-footer").css("display", "block");

                k9 = 0;
                k8 = 1;
                result = [];//为下一次存入新选项清空数组
            }
        });

    };
    _bind();

    /**
     *  答题记录逐个提交答案
     * @param titleCont 第几题
     * @param session_id session_id
     * @param result 结果
     */
    function getAnswer(titleCont, session_id, result) {
        var num = parseInt(titleCont);
        var data = {
            act: 'gailv',
            session_id: session_id,
            // answer: JSON.stringify(result1),
            answer: result,
            num: num
        };

        $.ajax({
            type: "post",
            url: url+"yjl/ajaxAction",
            // data: {data:JSON.stringify(data)},
            data: {data: JSON.stringify(data)},
            dataType: "json",
            success: function (data) {
                // console.log(data);
                return data;
            }
        });
    }

});

