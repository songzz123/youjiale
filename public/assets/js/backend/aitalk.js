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
                    url: 'aitalk/getdata',
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
                console.log(row.column)
                var option = {
                    title : {
                        text: 'AI对话趋势图',
                        subtext: '统计每天时间段UV',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['对话量']
                    },
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : true,
                            data : row.column,
                            axisLabel:{
                                interval:0,//横轴信息全部显示
                                rotate:60,//倾斜显示
                            },
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'对话量',
                            type:'line',
                            smooth:true,
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:row.data
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
                var tHtml = '';
                tHtml += '<thead>';
                tHtml += '<tr>';
                var counts = data.column.length;
                for (var i = 0; i < counts; i++) {
                    tHtml += '<th>' + data.column[i] + '</th>';
                }
                tHtml += '</tr>';
                tHtml += '</thead>';

                tHtml += '<tbody>';
                tHtml += '<tr>';

                for (var v = 0; v < counts; v++) {
                    console.log(i);
                    tHtml += '<th>' + data.data[v] + '</th>';
                }

                tHtml += '</tr>';

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