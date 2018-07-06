define(['jquery', 'bootstrap', 'backend', 'table', 'form', 'moment', 'bootstrap-datetimepicker'], function ($, undefined, Backend, Table, Form, Moment) {
    var Controller = {

        index: function () {
            //点击保存到数据库 状态
            $('.btn-status').click(function () {
                var data = {
                    'status': 1
                };
                var action = $(this).attr('action');
                var url = 'dialoguenode/' + action;
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: data,
                    async: false,
                    success: function (res) {
                        Layer.alert(res.msg);
                        location.reload();
                    },
                    dataType: 'json'
                });
            });
            //列表页面
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'dialoguelist/index',
                    add_url: 'dialoguelist/add',
                    del_url: 'dialoguelist/del',
                }
            });
            var table = $('#table');
            // // 初始化表格
            table.bootstrapTable({
                // url: $.fn.bootstrapTable.defaults.extend.index_url,
                // columns: [
                    // columns,
                    // [],
                // ],
                // pageSize: 30,
                //禁用默认搜索
                search: false,
                // //启用普通表单搜索
                commonSearch: false,
                // //可以控制是否默认显示搜索单表,false则隐藏,默认为false 提交按钮
                searchFormVisible: false,
            });
            // 为表格绑定事件
            Table.api.bindevent(table);
            $("#table").css('display','none');
        },
        add: function () {
            Form.api.bindevent($('form[role=form]'));
        },
    };
    return Controller;
});