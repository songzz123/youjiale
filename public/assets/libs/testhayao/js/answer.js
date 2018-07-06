$(function () {

    var resultQ = {};//创建一个空json用来存选择的所有答案
    var resultQ1 = [];//存第一题答案
    var resultQ2 = [];//存第二题答案
    var resultQ3 = [];//存第三题答案
    var resultQC = {};//创建一个空json用来存选择的所有答案内容
    var resultQC1 = [];//存第一题的答案内容
    var resultQC2 = [];//存第二题的答案内容
    var resultQC3 = [];//存第三题的答案内容
    var k1 = 1;
    var k2 = 1;
    var k3 = 1;

    //给每一页绑定点击事件
    function _bind() {
        //获取第一页所有的选项，绑定点击事件
        $('.answer1 .question-each').on('touchend', function () {

            console.log("第一题");
            var resultA1 = $(this).data("select-number");//获取每一题所选的选项
            var s = resultQ1.indexOf(resultA1);	//获取再次点击的索引值
            var qc = $(this).html();
            var q = resultQC1.indexOf(qc);	//获取再次点击的索引值

            if ($(this).hasClass("active")) {
                //判断是都已经添加了对勾
                $(this).removeClass("active");
                resultQ1.splice(s, 1);//再次点击则删除该选项
                resultQ["1"] = resultQ1.join(",");
                resultQC1.splice(q, 1);//再次点击则删除该选项
                resultQC["1"] = resultQC1.join(",");
            } else {
                $(this).addClass("active");


                resultQ1.push(resultA1);//把每一题的选项添加到result数组里
                resultQ["1"] = resultQ1.join(",");//把打第一题答案存入json
                resultQC1.push(qc);//把每一题的选项添加到result数组里
                resultQC["1"] = resultQC1.join(",");//把打第一题答案存入json
                console.log(resultQ1.indexOf("F"));
                if (resultQ1.indexOf("F") == 0) {//点击F后再次重新选择
                    $(this).siblings(".question-each-sp").removeClass("active");
                    resultQ1.splice("F", 1);
                    resultQC1.splice("以上均无", 1);
                    resultQ["1"] = resultQ1[0];
                }
            }

        });
        $('.answer1 .question-each-sp').on('touchend', function () {//以上均无判断
            resultQC1 = [];
            resultQ1 = [];

            var resultF1 = $(this).data("select-number");//获取每一题所选的选项
            var sf = resultQ1.indexOf(resultF1);	//获取再次点击的索引值
            var qcf = $(this).html();
            var qf = resultQC1.indexOf(qcf);	//获取再次点击的索引值


            if ($(this).hasClass("active")) {

                $(this).removeClass("active");
                resultQ1 = [];
                resultQ1.splice(sf, 1);//再次点击则删除该选项
                resultQC1.splice(qf, 1);//再次点击则删除该选项
                resultQ["1"] = resultQ1.join(",");//把打第一题答案存入json
                resultQC["1"] = resultQC1.join(",");
            } else {
                $(this).addClass("active");


                resultQ1.push(resultF1);
                resultQ["1"] = resultQ1.join(",");//把打第一题答案存入json
                $(this).siblings().removeClass("active");
                resultQC1.push(qcf);//把每一题的选项添加到result数组里
                resultQC["1"] = resultQC1.join(",");//把打第一题答案存入json
            }

        });
        //提交按钮
        $('.answer1 .answer-each-btn').on('touchend', function () {

            if (resultQ1.length === 0 || resultQ1 === undefined) {
                alert("请答题");
            } else {

                if (k1) {
                    resultQ1.length = 0;
                    $('.answer2 .question-each').removeClass("active");//清除上一题的选中高光
                    $('.answer2 .question-each-sp').removeClass("active");//清除上一题的选中高光
                    resultQC2.splice(0, resultQC2.length);//清空下一题的答案内容
                    // var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/hayao/images/doctor.jpg"></div>';
                    // answerNew += '<div class="answer_text"><p>剩余2个..</p>';
                    // answerNew += '</div></div>';
                    // $('.speak_box').append(answerNew);
                    // for_bottom();

                    setTimeout(function () {
                        var questionNew = '<div class="question">';
                        questionNew += '<div class="heard_img right"><img src="/assets/img/hayao/images/profle.png"></div>';
                        questionNew += '<div class="question_text clear" id="question_text_my"><p>' + resultQC1 + '</p>';
                        questionNew += '</div></div>';
                        $('.speak_box').append(questionNew);
                        for_bottom_one();
                    }, 500);
                    $(".answer1").css("display", "none");
                    k1 = 0;
                    k3 = 1;

                    console.log('here this');
                    console.log(resultQ);
                    console.log(resultQ1);
                    console.log(resultQC);

                    getAnswer(1, session_id, resultQ);
                    setTimeout(function () {
                        var firstanswers = '';//用户所选答案
                        if (resultQ[1] == 'F') {
                            firstanswers = '以上均无';
                        } else {
                            firstanswers = '其它选项';
                        }
                        postAjax('', session_id, 1, 'firstanswers', firstanswers);
                        firstanswers = '';
                    }, 1000);

                }
            }

        });
        $('.answer2 .question-each').on('touchend', function () {

            var resultA2 = $(this).data("select-number");//获取每一题所选的选项
            var s = resultQ2.indexOf(resultA2);	//获取再次点击的索引值
            var qc = $(this).html();
            var q = resultQC2.indexOf(qc);	//获取再次点击的索引值
            if ($(this).hasClass("active")) {
                //判断是都已经添加了对勾
                $(this).removeClass("active");
                resultQ2.splice(s, 1);//再次点击则删除该选项
                resultQ["2"] = resultQ2.join(",");
                resultQC2.splice(q, 1);//再次点击则删除该选项
                resultQC["2"] = resultQC2.join(",");
            } else {
                $(this).addClass("active");


                resultQ2.push(resultA2);//把每一题的选项添加到result数组里
                resultQ["2"] = resultQ2.join(",");//把打第一题答案存入json
                resultQC2.push(qc);//把每一题的选项添加到result数组里
                resultQC["2"] = resultQC2.join(",");//把打第一题答案存入json
                if (resultQ2.indexOf("F") == 0) {//点击F后再次重新选择
                    $(this).siblings(".question-each-sp").removeClass("active");
                    resultQ2.splice("F", 1);
                    resultQC2.splice("以上均无", 1);
                    resultQ["2"] = resultQ2[0];
                }

                console.log(resultQ2);
            }

        });
        $('.answer2 .question-each-sp').on('touchend', function () {//以上均无判断
            resultQC2 = [];
            resultQ2 = [];

            var resultF2 = $(this).data("select-number");//获取每一题所选的选项
            var sf = resultQ2.indexOf(resultF2);	//获取再次点击的索引值
            var qcf = $(this).html();
            var qf = resultQC2.indexOf(qcf);	//获取再次点击的索引值
            console.log(sf);

            if ($(this).hasClass("active")) {

                $(this).removeClass("active");
                resultQ2 = [];
                resultQ2.splice(sf, 1);//再次点击则删除该选项
                resultQC2.splice(qf, 1);//再次点击则删除该选项
                resultQ["2"] = resultQ2.join(",");//把打第一题答案存入json
                resultQC["2"] = resultQC2.join(",");

                console.log(resultQ);
                console.log(resultQC2);
                console.log(resultQC);
            } else {
                $(this).addClass("active");

                resultQ2.push(resultF2);
                resultQ["2"] = resultQ2.join(",");//把打第一题答案存入json
                $(this).siblings().removeClass("active");
                resultQC2.push(qcf);//把每一题的选项添加到result数组里
                resultQC["2"] = resultQC2.join(",");//把打第一题答案存入json

                console.log("二题F");
                console.log(resultQ);
                console.log(resultQC2);
                console.log(resultQC);
            }

        });
        //提交按钮
        $('.answer2 .answer-each-btn').on('touchend', function () {

            if (resultQ2.length === 0 || resultQ2 === undefined) {
                alert("请答题");
            } else {

                if (k2) {
                    console.log(resultQ2.length + "请答题");
                    $('.answer3 .question-each').removeClass("active");//清除上一题的选中高光
                    $('.answer3 .question-each-sp').removeClass("active");//清除上一题的选中高光
                    resultQC3.splice(0, resultQC3.length);//清空下一题的答案内容
                    console.log(resultQC3 + "再次点击");
                    // var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/hayao/images/doctor.jpg"></div>';
                    // answerNew += '<div class="answer_text"><p>剩余1个..</p>';
                    // answerNew += '</div></div>';
                    // $('.speak_box').append(answerNew);
                    // for_bottom();

                    setTimeout(function () {

                        console.log(resultQC2);
                        var questionNew = '<div class="question">';
                        questionNew += '<div class="heard_img right"><img src="/assets/img/hayao/images/profle.png"></div>';
                        questionNew += '<div class="question_text clear" id="question_text_my"><p>' + resultQC2 + '</p>';
                        questionNew += '</div></div>';
                        $('.speak_box').append(questionNew);
                        for_bottom_one();
                    }, 500);
                    $(".answer2").css("display", "none");

                    k2 = 0;
                    k1 = 1;
                    console.log('here this');
                    console.log(resultQ);
                    console.log(resultQ2);
                    console.log(resultQC);
                    getAnswer(2, session_id, resultQ);
                    setTimeout(function () {
                        var secondanswers = '';
                        if (resultQ[2] == 'F') {
                            secondanswers = '以上均无';
                        } else {
                            secondanswers = '其它选项';
                        }
                        postAjax('', session_id, 1, 'secondanswers', secondanswers);
                        secondanswers = '';
                    }, 1000);
                }
            }

        });

        $('.answer3 .question-each').on('touchend', function () {

            console.log("第三题");
            var resultA3 = $(this).data("select-number");//获取每一题所选的选项
            var s = resultQ3.indexOf(resultA3);	//获取再次点击的索引值
            var qc = $(this).html();
            var q = resultQC3.indexOf(qc);	//获取再次点击的索引值
            console.log(s);
            if ($(this).hasClass("active")) {
                //判断是都已经添加了对勾
                $(this).removeClass("active");
                resultQ3.splice(s, 1);//再次点击则删除该选项
                resultQ["3"] = resultQ3.join(",");
                resultQC3.splice(q, 1);//再次点击则删除该选项
                resultQC["3"] = resultQC3.join(",");
                console.log(resultQ);
                console.log(resultQC3);
                console.log("有");
            } else {
                $(this).addClass("active");


                resultQ3.push(resultA3);//把每一题的选项添加到result数组里
                resultQ["3"] = resultQ3.join(",");//把打第一题答案存入json
                resultQC3.push(qc);//把每一题的选项添加到result数组里
                resultQC["3"] = resultQC3.join(",");//把打第一题答案存入json
                console.log(resultQ3.indexOf("F"));
                if (resultQ3.indexOf("F") == 0) {//点击F后再次重新选择
                    $(this).siblings(".question-each-sp").removeClass("active");
                    resultQ3.splice("F", 1);
                    resultQC3.splice("以上均无", 1);
                    resultQ["3"] = resultQ3[0];
                }

                console.log(resultQ3);
                console.log(resultQC3);
                console.log(resultQ);
                console.log("没有");
            }

        });
        $('.answer3 .question-each-sp').on('touchend', function () {//以上均无判断
            resultQC3 = [];
            resultQ3 = [];

            var resultF3 = $(this).data("select-number");//获取每一题所选的选项
            var sf = resultQ3.indexOf(resultF3);	//获取再次点击的索引值
            var qcf = $(this).html();
            var qf = resultQC3.indexOf(qcf);	//获取再次点击的索引值
            console.log(sf);

            if ($(this).hasClass("active")) {

                $(this).removeClass("active");
                resultQ3 = [];
                resultQ3.splice(sf, 1);//再次点击则删除该选项
                resultQC3.splice(qf, 1);//再次点击则删除该选项
                resultQ["3"] = resultQ3.join(",");//把打第一题答案存入json
                resultQC["3"] = resultQC3.join(",");

                // console.log(resultQ);
                // console.log(resultQC3);
                // console.log(resultQC);
            } else {
                $(this).addClass("active");

                resultQ3.push(resultF3);
                resultQ["3"] = resultQ3.join(",");//把打第一题答案存入json
                $(this).siblings().removeClass("active");
                resultQC3.push(qcf);//把每一题的选项添加到result数组里
                resultQC["3"] = resultQC3.join(",");//把打第一题答案存入json

                // console.log("三题F");
                // console.log(resultQ);
                // console.log(resultQC3);
                // console.log(resultQC);
            }

        });


        $('.answer3 .answer-each-btn').on('touchend', function () {
            if (resultQ3.length === 0 || resultQ3 === undefined) {
                alert("请答题");
            } else {

                if (k3) {
                    console.log(resultQ3.length + "请答题");
                    resultQ3.length = 0;
                    $('.answer1 .question-each').removeClass("active");//清除上一题的选中高光
                    $('.answer1 .question-each-sp').removeClass("active");//清除上一题的选中高光
                    resultQC1.splice(0, resultQC1.length);//清空下一题的答案内容
                    console.log(resultQC1 + "再次点击");
                    // var answerNew = '<div class="answer"><div class="heard_img left"><img src="/assets/img/hayao/images/doctor.jpg"></div>';
                    // answerNew += '<div class="answer_text"><p>没了..</p>';
                    // answerNew += '</div></div>';
                    // $('.speak_box').append(answerNew);
                    // for_bottom();

                    setTimeout(function () {

                        console.log(resultQC3);
                        var questionNew = '<div class="question">';
                        questionNew += '<div class="heard_img right"><img src="/assets/img/hayao/images/profle.png"></div>';
                        questionNew += '<div class="question_text clear" id="question_text_my"><p>' + resultQC3 + '</p>';
                        questionNew += '</div></div>';
                        $('.speak_box').append(questionNew);
                        for_bottom();
                    }, 500);
                    $(".answer3").css("display", "none");
                    console.log('here this');
                    console.log(resultQ);
                    console.log(resultQ3);
                    console.log(resultQC);
                    getAnswer(3, session_id, resultQ);
                    k3 = 0;
                    k2 = 1;

                    var data = {
                        act: 'naire',
                        session_id: session_id,
                        answer: JSON.stringify(resultQ)
                    };

                    $.ajax({
                        type: "post",
                        url: url + "testhayao/ajaxAction",
                        data: {data: JSON.stringify(data)},
                        dataType: "json",
                        success: function (data) {
                            if (data.code == 1) {
                                setTimeout(function () {
                                    postAjax('', session_id, 1, 'testResult', data.msg);
                                }, 1000);
                            }

                        }
                    });
                    resultQ = {};//创建一个空数组用来存选择的答案
                    reset();
                    $(".answer-footer").css("display", "none");
                    $(".wenwen-footer").css("display", "block");
                }

            }

        });
    };
    _bind();

});


/**
 *  答题记录逐个提交答案
 * @param titleCont 第几题
 * @param session_id session_id
 * @param result 结果
 */
function getAnswer(titleCont, session_id, result) {
    console.log(url);
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
        url: url + "testhayao/ajaxAction",
        // data: {data:JSON.stringify(data)},
        data: {data: JSON.stringify(data)},
        dataType: "json",
        success: function (data) {
            // console.log(data);
            return data;
        }
    });
}

function reset() {
    $('.answer3 .question-each').removeClass("active");
    $(".answer3").fadeOut(1000);
    // $(".answer1").delay(1000).fadeIn(100);

}