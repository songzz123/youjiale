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
                    url: 'kupperresult/getdata',
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
                var option = {
                    title: {
                        text: 'Kupperman测试结果程度分布',
                        subtext: '统计用户测试结果分布',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient : 'vertical',
                        x : 'left',
                        data:row.name
                    },
                    color: Controller.randColorArr(),
                    toolbox: {
                        show : true,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {
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
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    series : [
                        {
                            name:'结果分布',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:row.goodData
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

                var counts = data.name.length;
                var tHtml = '';
                tHtml += '<thead>';
                tHtml += '<tr>';
                tHtml += '<th>身体状况</th>';
                tHtml += '<th>目标人数</th>';
                tHtml += '</tr>';


                tHtml += '</thead>';

                tHtml += '<tbody>';


                for (var v = 0; v < counts; v++) {
                    tHtml += '<tr>';
                    tHtml += '<th>' + data.name[v] + '</th>';
                    tHtml += '<th>' + data.value[v] + '</th>';
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