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
                    url: 'kuppertest/getdata',
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
                console.log(row.value)
                var option = {
                    title: {
                        text: 'KupperMan完成数与有效访客数占比',
                        subtext: '完成率',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['比率']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            data: row.time,
                            axisLabel: {
                                interval: 0,//横轴信息全部显示
                                rotate: 90,//倾斜显示
                            },
                        }
                    ],
                    yAxis: [{
                        type: 'value',
                        name: '占比: %',
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
                            name: '百分比',
                            type: 'line',
                            smooth: true,
                            itemStyle: {
                                normal:
                                    {
                                        areaStyle:
                                            {
                                                type: 'default'
                                            },
                                        label: {
                                            show: true,
                                            position: 'inside',//数据在中间显示
                                            formatter: '{c}%'//百分比显示
                                        }
                                    }
                            },
                            data: row.value
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
                var counts = data.time.length;
                console.log(counts)
                var tHtml = '';
                tHtml += '<thead>';
                tHtml += '<tr>';
                tHtml += '<th>日期</th>';
                tHtml += '<th>kupperman完成率</th>';
                tHtml += '</tr>';
                tHtml += '</thead>';

                tHtml += '<tbody>';

                for (var i = 0; i < counts; i++) {

                    tHtml += '<tr>';

                    tHtml += '<th>' + data.time[i] + '</th>';
                    tHtml += '<th>' + data.value[i] + '%</th>';

                    tHtml += '</tr>';

                }


                tHtml += '</tbody>';
                $('#t-table').html(tHtml);
            }

        },
        add: function () {
            Form.api.bindevent($('form[role=form]'));
        },
    };
    return Controller;
});