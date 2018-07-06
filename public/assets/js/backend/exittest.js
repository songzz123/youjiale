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
                    url: 'exittest/getdata',
                    data: {
                        'starttime': starttime,
                        'endtime': endtime,
                        'type': type,
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (row) {
                        lineChart(row);
                        buildTable(row);
                    }
                });
            }

            /**
             * 曲线面积图
             * @param row
             */
            function lineChart(row) {
                console.log(row.answer_num);
                console.log(row.ct);
                var option = {
                    title: {
                        text: 'Kupperman测试题跳出率',
                        subtext: '统计用户测试题跳出率',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: row.answer_num
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    grid: {
                        borderWidth: 0,
                        y: 80,
                        y2: 60
                    },
                    xAxis: [
                        {
                            type: 'category',
                            show: true,
                            data: row.answer_num,
                            axisLabel: {
                                interval: 0,//横轴信息全部显示
                                rotate: 60,//倾斜显示
                            },
                        }
                    ],
                    // yAxis: [
                    //     {
                    //         type: 'value',
                    //         show: true,
                    //         data: row.ct,
                    //     }
                    // ],
                    yAxis: [{
                        type: 'value',
                        name: '跳出率: %',
                        nameTextStyle: {
                            color: 'rgba(255,64,104,0.5)',
                        },
                        axisLabel: {
                            formatter: '{value} %',
                            textStyle: {
                                color: 'rgba(255,64,104,0.5)',
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dotted",
                                color: ["rgba(255,60,104,.1)"]
                            }
                        }
                    }],
                    series: [
                        {
                            name: '跳出率',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                            '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                            '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{b}\n{c}%'
                                    }
                                }
                            },
                            data: row.ct,
                            markPoint: {
                                tooltip: {
                                    trigger: 'item',
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    formatter: function (params) {
                                        return '<img src="'
                                            + params.data.symbol.replace('image://', '')
                                            + '"/>';
                                    }
                                },
                                data: [
                                    {
                                        xAxis: 0,
                                        y: 350,
                                        name: 'Line',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/折线图.png'
                                    },
                                    {
                                        xAxis: 1,
                                        y: 350,
                                        name: 'Bar',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/柱状图.png'
                                    },
                                    {
                                        xAxis: 2,
                                        y: 350,
                                        name: 'Scatter',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/散点图.png'
                                    },
                                    {
                                        xAxis: 3,
                                        y: 350,
                                        name: 'K',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/K线图.png'
                                    },
                                    {
                                        xAxis: 4,
                                        y: 350,
                                        name: 'Pie',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/饼状图.png'
                                    },
                                    {
                                        xAxis: 5,
                                        y: 350,
                                        name: 'Radar',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/雷达图.png'
                                    },
                                    {
                                        xAxis: 6,
                                        y: 350,
                                        name: 'Chord',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/和弦图.png'
                                    },
                                    {
                                        xAxis: 7,
                                        y: 350,
                                        name: 'Force',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/力导向图.png'
                                    },
                                    {
                                        xAxis: 8,
                                        y: 350,
                                        name: 'Map',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/地图.png'
                                    },
                                    {
                                        xAxis: 9,
                                        y: 350,
                                        name: 'Gauge',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/仪表盘.png'
                                    },
                                    {
                                        xAxis: 10,
                                        y: 350,
                                        name: 'Funnel',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/漏斗图.png'
                                    },
                                    {
                                        xAxis: 11,
                                        y: 350,
                                        name: 'Funnel',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/漏斗图.png'
                                    },
                                    {
                                        xAxis: 12,
                                        y: 350,
                                        name: 'Funnel',
                                        symbolSize: 20,
                                        symbol: 'image://../asset/ico/漏斗图.png'
                                    },
                                ]
                            }
                        }
                    ]
                    // color: Controller.randColorArr(),
                    // toolbox: {
                    //     show : true,
                    //     feature : {
                    //         mark : {show: true},
                    //         dataView : {show: true, readOnly: false},
                    //         magicType : {
                    //             show: true,
                    //             type: ['pie', 'funnel'],
                    //             option: {
                    //                 funnel: {
                    //                     x: '25%',
                    //                     width: '50%',
                    //                     funnelAlign: 'left',
                    //                     max: 1548
                    //                 }
                    //             }
                    //         },
                    //         restore : {show: true},
                    //         saveAsImage : {show: true}
                    //     }
                    // },
                    // calculable : true,
                    // series : [
                    //     {
                    //         name:'结果分布',
                    //         type:'pie',
                    //         radius : '55%',
                    //         center: ['50%', '60%'],
                    //         data:row.goodData
                    //     }
                    // ]
                };

                Echarts.init(document.getElementById('echart-top'), 'walden').setOption(option);
            }

            /**
             * 生成table
             *
             * @param data
             */
            function buildTable(data) {

                var counts = data.answer_num.length;
                var tHtml = '';
                tHtml += '<thead>';
                tHtml += '<tr>';
                tHtml += '<th>身体状况</th>';
                tHtml += '<th>跳出率</th>';
                tHtml += '</tr>';


                tHtml += '</thead>';

                tHtml += '<tbody>';


                for (var v = 0; v < counts; v++) {
                    tHtml += '<tr>';
                    tHtml += '<th>' + data.answer_num[v] + '</th>';
                    tHtml += '<th>' + data.ct[v] + '%</th>';
                    tHtml += '</tr>';
                }


                tHtml += '</tbody>';
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