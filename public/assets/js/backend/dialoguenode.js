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
      $('.datepicker').datetimepicker({
        format: 'YYYY-MM-DD'
      });

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
        var options = [];
        $('input[name="options"]:checked').each(function () {
          options.push($(this).val());
        });
        $.ajax({
          url: 'dialoguenode/getdata',
          data: {
            'starttime': starttime,
            'endtime': endtime,
            'type': type,
            'options': options,
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
        tHtml += '<th>节点名称</th>';
        for (var i in data.column) {
          tHtml += '<th>' + data.column[i] + '</th>';
        }
        tHtml += '</tr>';
        tHtml += '</thead>';
        tHtml += '<tbody>';
        tHtml += '<tr>';
        if (type == 'rate') {
          tHtml += '<th>退出率</th>';
        } else if (type == 'dialogue_pv') {
          tHtml += '<th>触发次数</th>';
        } else if (type == 'exit_pv') {
          tHtml += '<th>退出次数</th>';
        }
        for (var j in data.data) {
          if (type == 'rate') {
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
       * 生成图表
       *
       * @param row
       */
      function lineChart(row) {
        //顶部不动 曲线图
        var option_top = {
          title: {
            text: ''
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
            data: ['数据']
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
              name: '搜索引擎',
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

        var option_tops = {
          title: {
            x: 'center',
            text: '统计',
            // subtext: 'Rainbow bar example',
            // link: 'http://echarts.baidu.com/doc/example.html'
          },
          tooltip: {
            trigger: 'item'
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
              show: false,
              // data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
              data: row.column
            }
          ],
          yAxis: [
            {
              type: 'value',
              show: false
            }
          ],
          series: [
            {
              name: '数据统计',
              type: 'bar',
              itemStyle: {
                normal: {
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                      '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                      '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0',
                      '#0CA9EE', '#0CA9EE', '#8848D5', '#8888D5', '#09B7F6',
                    ];
                    return colorList[parseInt(20 * Math.random())];
                    // return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: 'top',
                    formatter: '{b}\n{c}'
                  }
                }
              },
              // data: [12,21,10,4,12,5,6,5,25,23,7],
              data: row.data,
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
                  // {xAxis:0, y: 350, name:'Line', symbolSize:20, symbol: 'image://../asset/ico/折线图.png'},
                  // {xAxis:1, y: 350, name:'Bar', symbolSize:20, symbol: 'image://../asset/ico/柱状图.png'},
                  // {xAxis:2, y: 350, name:'Scatter', symbolSize:20, symbol: 'image://../asset/ico/散点图.png'},
                  // {xAxis:3, y: 350, name:'K', symbolSize:20, symbol: 'image://../asset/ico/K线图.png'},
                  // {xAxis:4, y: 350, name:'Pie', symbolSize:20, symbol: 'image://../asset/ico/饼状图.png'},
                  // {xAxis:5, y: 350, name:'Radar', symbolSize:20, symbol: 'image://../asset/ico/雷达图.png'},
                  // {xAxis:6, y: 350, name:'Chord', symbolSize:20, symbol: 'image://../asset/ico/和弦图.png'},
                  // {xAxis:7, y: 350, name:'Force', symbolSize:20, symbol: 'image://../asset/ico/力导向图.png'},
                  // {xAxis:8, y: 350, name:'Map', symbolSize:20, symbol: 'image://../asset/ico/地图.png'},
                  // {xAxis:9, y: 350, name:'Gauge', symbolSize:20, symbol: 'image://../asset/ico/仪表盘.png'},
                  // {xAxis:10, y: 350, name:'Funnel', symbolSize:20, symbol: 'image://../asset/ico/漏斗图.png'},
                ]
              }
            }
          ]
        };

        Echarts.init(document.getElementById('echart-top'), 'walden').setOption(option_tops);
      }

      /**
       * 搜索高亮
       * @param pat
       */
      $.fn.highlight = function (pat) {
        function innerHighlight(node, pat) {
          var skip = 0;
          if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            if (pos >= 0) {
              var spannode = document.createElement('span');
              spannode.className = 'highlight';
              var middlebit = node.splitText(pos);
              var endbit = middlebit.splitText(pat.length);
              var middleclone = middlebit.cloneNode(true);
              spannode.appendChild(middleclone);
              middlebit.parentNode.replaceChild(spannode, middlebit);
              skip = 1;
            }
          }
          else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
              i += innerHighlight(node.childNodes[i], pat);
            }
          }
          return skip;
        }

        return this.each(function () {
          innerHighlight(this, pat.toUpperCase());
        });

      };
      $.fn.removeHighlight = function () {
        function newNormalize(node) {
          for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
            var child = children[i];
            if (child.nodeType == 1) {
              newNormalize(child);
              continue;
            }
            if (child.nodeType != 3) { continue; }
            var next = child.nextSibling;
            if (next == null || next.nodeType != 3) { continue; }
            var combined_text = child.nodeValue + next.nodeValue;
            new_node = node.ownerDocument.createTextNode(combined_text);
            node.insertBefore(new_node, child);
            node.removeChild(child);
            node.removeChild(next);
            i--;
            nodeCount--;
          }
        }

        return this.find('span.highlight').each(function () {
          var thisParent = this.parentNode;
          thisParent.replaceChild(this.firstChild, this);
          newNormalize(thisParent);
        }).end();
      };

      $('.search-options').bind('keyup change', function (ev) {
        var searchTerm = $(this).val();
        $('body').removeHighlight();
        if (searchTerm) {
          $('body').highlight(searchTerm);
        }
      });

    },
    add: function () {
      Form.api.bindevent($('form[role=form]'));
    },
  };
  return Controller;
});