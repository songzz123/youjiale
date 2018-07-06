define(['jquery', 'bootstrap', 'backend', 'addtabs', 'table', 'echarts', 'echarts-theme', 'template', 'bootstrap-daterangepicker', 'moment', 'bootstrap-datetimepicker', 'form'], function ($, undefined, Backend, Datatable, Table, Echarts, undefined, Template, undefind, Moment, Form) {

    var Controller = {
        index: function () {

            //---------图标页面---------//
            // ajaxData();
            $('.date-search').click(function () {
                ajaxData();
            });
            /*
             * 给新插入input添加时间选择
             */
            $('.endtime').val(Moment().format('YYYY-MM-DD'));
            $('.starttime').val(Moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD'));
            //时间选择
            $('.datepicker').datetimepicker({format: 'YYYY-MM-DD'});

            /*
             *后台发送请求
             *
             * @param action 要操作的类型
             * @param id 如果有则不加dom
             */
            function ajaxData() {
                var starttime = $('input[name=\'starttime\']').val();
                var endtime = $('input[name=\'endtime\']').val();
                var type = $('select[name=\'type\']').val();
                $.ajax({
                    url: 'selectresult/getdata',
                    data: {
                        'starttime': starttime,
                        'endtime': endtime,
                        'type': type,
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (row) {
                        barChart(row);
                        buildTable(row);
                    }
                });
            }

            function barChart(row) {
                // var zrColor = require('zrender/tool/color');
                var colorList = [
                    '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                    '#ff92bc', '#FF7674', '#A6B7FF', '#ffa500', '#da70d6'
                ];
                // var itemStyle = {
                //     normal: {
                //         color: function (params) {
                //             if (params.dataIndex < 0) {
                //                 // for legend
                //                 return zrColor.lift(
                //                     colorList[colorList.length - 1], params.seriesIndex * 0.1
                //                 );
                //             }
                //             else {
                //                 // for bar
                //                 return zrColor.lift(
                //                     colorList[params.dataIndex], params.seriesIndex * 0.1
                //                 );
                //             }
                //         }
                //     }
                // };
                if (row.group_id == 2) {
                    option = {
                        title: {
                            text: '每道测试题不同选项的选择次数：每道测试题，被用户选择的次数；',
                            subtext: '数据测试文档',
                            // sublink: 'http://data.stats.gov.cn/search/keywordlist2?keyword=%E5%9F%8E%E9%95%87%E5%B1%85%E6%B0%91%E6%B6%88%E8%B4%B9'
                        },
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(255,255,255,0.7)',
                            axisPointer: {
                                type: 'shadow'
                            },
                            formatter: function (params) {
                                // for text color
                                var color = colorList[params[0].dataIndex];
                                var res = '<div style="color:' + color + '">';
                                res += '<strong>' + params[0].name + '选择次数（个）</strong>'
                                for (var i = 0, l = params.length; i < l; i++) {
                                    res += '<br/>' + params[i].seriesName + ' : ' + params[i].value
                                }
                                res += '</div>';
                                return res;
                            }
                        },
                        legend: {
                            x: 'right',
                            data: ['正常', '轻度', '中度', '重度']
                        },
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            y: 'center',
                            feature: {
                                mark: {show: true},
                                dataView: {show: true, readOnly: false},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        calculable: true,
                        grid: {
                            y: 80,
                            y2: 40,
                            x2: 40
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: row.column,
                                show: true,
                                boundaryGap: true,
                                axisLabel: {
                                    interval: 0,//横轴信息全部显示
                                    rotate: 0,//倾斜显示
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle:
                                        {
                                            color: '#48b',
                                            width: 1,
                                            type: 'solid'
                                        }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: row.barvalue
                    };
                }

                Echarts.init(document.getElementById('echart-top'), 'walden').setOption(option);

            }

            /**
             * 曲线面积图
             * @param row
             */
            function lineChart(row) {
                var option = {
                    title: {
                        text: 'Kupperman测试结果程度分布',
                        subtext: '统计用户测试结果分布',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: row.name
                    },
                    color: Controller.randColorArr(),
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            },
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    series: [
                        {
                            name: '结果分布',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: row.goodData
                        }
                    ]
                };

                Echarts.init(document.getElementById('echart-top'), 'walden').setOption(option);
            }

            /**
             * 生成table
             *
             * @param data
             */
            function buildTable(data) {
                if (data.group_id == 2) {

                    var counts = data.column.length;
                    var tHtml = '';
                    tHtml += '<thead>';
                    tHtml += '<tr>';
                    tHtml += '<th>症状分类</th>';
                    tHtml += '<th>正常</th>';
                    tHtml += '<th>轻度</th>';
                    tHtml += '<th>中度</th>';
                    tHtml += '<th>重度</th>';
                    tHtml += '</tr>';


                    tHtml += '</thead>';

                    tHtml += '<tbody>';


                    for (var v = 0; v < counts; v++) {
                        tHtml += '<tr>';
                        switch (v) {
                            case 0:
                                tHtml += '<th>潮热汗出</th>';
                                break;
                            case 1:
                                tHtml += '<th>感觉异常</th>';
                                break;
                            case 2:
                                tHtml += '<th>失眠</th>';
                                break;
                            case 3:
                                tHtml += '<th>情绪波动</th>';
                                break;
                            case 4:
                                tHtml += '<th>抑郁疑心</th>';
                                break;
                            case 5:
                                tHtml += '<th>眩晕</th>';
                                break;
                            case 6:
                                tHtml += '<th>疲乏</th>';
                                break;
                            case 7:
                                tHtml += '<th>骨关节痛</th>';
                                break;
                            case 8:
                                tHtml += '<th>头疼</th>';
                                break;
                            case 9:
                                tHtml += '<th>心悸</th>';
                                break;
                            case 10:
                                tHtml += '<th>皮肤蚁走感</th>';
                                break;
                            case 11:
                                tHtml += '<th>性生活</th>';
                                break;
                            case 12:
                                tHtml += '<th>泌尿感染</th>';
                                break;
                            default:
                                tHtml += '<th></th>';
                                break;
                        }
                        for (var i = 0; i < 4; i++) {
                            tHtml += '<th>' + data.value[v][i] + '</th>';
                        }
                        tHtml += '</tr>';
                    }


                    tHtml += '</tbody>';
                }

                $('#t-table').html(tHtml);
            }

        },
        add: function () {
            Form.api.bindevent($('form[role=form]'));
        },
        randColorArr: function () {
            var array = ['#00acec', '#49bf67', '#f8a326', '#9564e2', '#f44542', '#f7acbc', '#b2d235', '#cde6c7', '#dea32c', '#ea66a6'];
            // var copy = [],
            //   n = array.length, i;
            // // 如果还剩有元素则继续。。。
            // while (n) {
            //   // 随机抽取一个元素
            //   i = Math.floor(Math.random() * array.length);
            //   // 如果这个元素之前没有被选中过。。
            //   if (i in array) {
            //     copy.push(array[i]);
            //     delete array[i];
            //     n--;
            //   }
            // }
            // return copy;
            return array;
        }
    };
    return Controller;
});