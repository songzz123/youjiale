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
                    url: 'sessionuv/getdata',
                    data: {
                        'starttime': starttime,
                        'endtime': endtime,
                        'type': type,
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (row) {
                        lineChart(row);
                        buildTable(row, type);
                    }
                });
            }

            /**
             * 生成table
             *
             * @param data
             */
            function buildTable(data, type) {
                var tHtml = '';
                tHtml += '<thead>';
                tHtml += '<tr>';
                tHtml += '<th>轮数</th>';
                for (var i in data.column) {
                    tHtml += '<th>' + data.column[i] + '</th>';
                }
                tHtml += '</tr>';
                tHtml += '</thead>';
                tHtml += '<tbody>';
                tHtml += '<tr>';
                if (type == 'rate_uv') {
                    tHtml += '<th>UV占比</th>';
                } else {
                    tHtml += '<th>UV数</th>';
                }
                for (var j in data.data) {
                    if (type == 'rate_uv') {
                        tHtml += '<th>' + data.data[j] + '%</th>';
                    } else {
                        tHtml += '<th>' + data.data[j] + '</th>';
                    }
                }
                tHtml += '</tr>';
                tHtml += '</tbody>';
                $('#t-table').html(tHtml);
            }

            /**
             * 生成曲线
             *
             * @param row
             */
            function lineChart(row) {
                //顶部不动 曲线图
                var option_tops = {
                    title: {
                        text: '占比',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['占比']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: row.column
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            areaStyle: {normal: {}},
                            // data: [820, 932, 901, 934, 1290, 1330, 1320]
                            data: row.data
                        }
                    ]
                };

                Echarts.init(document.getElementById('echart-top'), 'walden').setOption(option_tops);
            }

        },
        add: function () {
            Form.api.bindevent($('form[role=form]'));
        },
    };
    return Controller;
});