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
            console.log($('.endtime').val());
            $('.starttime').val(Moment().subtract(1,'days').hours(0).minutes(0).seconds(0).format('YYYY-MM-DD'));
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
                    url: 'visit/getdata',
                    data: {
                        'starttime': starttime,
                        'endtime': endtime,
                        'type': type,
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (row) {
                        // lineChart(row);
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
                tHtml += '<th>日期</th>';
                tHtml += '<th>访客数</th>';
                tHtml += '<th>有效访客数</th>';
                tHtml += '<th>有效触达率</th>';
                tHtml += '</tr>';
                tHtml += '</thead>';

                tHtml += '<tbody>';
                tHtml += '<tr>';

                tHtml += '<th>' + data.time + '</th>';
                tHtml += '<th>' + data.people + '</th>';
                tHtml += '<th>' + data.real_people + '</th>';
                tHtml += '<th>' + data.option + '</th>';

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