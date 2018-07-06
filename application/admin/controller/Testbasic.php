<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:30
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\TestAnswer;
use app\common\controller\Backend;
use app\admin\model\SessionUv;

class Testbasic extends Backend
{
    /**
     * @return string
     */
    public function index()
    {
        $category = AuthGroup::where(['pid' => 1])->select();

        $this->view->assign([
            'cate' => $category
        ]);
        return $this->view->fetch();
    }

    /**
     * @return \think\response\Json
     */
    public function getData()
    {
        $params = $this->request->post();
        $start = strtotime($params['starttime']);
        $end = strtotime($params['endtime'] . "" . "23:59:59");
        $group_id = $params['type'] ? $params['type'] : 2; // 2 空为静心
        $where['create_time'] = ['>', $start];
        $seconeWhere['create_time'] = ['<', $end];
        $where['group_id'] = $group_id;
        $where['status'] = 1;


        switch ($group_id) {
            case 2:
                $real_num = 13; // 静心
                break;
            case 3:
                $real_num = 15; // 哈药
                break;
            case 4:
                $real_num = 9; // 优甲乐
                break;
            case 5:
                $real_num = 13; // 植发
                break;
            case 6:
                $real_num = 13; //
                break;
        }

        // a）	进入测试的人数：测试数据（全部）文档中，字段“session_id”的个数；$allpeople
        // b）	完成测试的人数：测试题结果文档中，字段“session_id”的个数；$doallpeople
        $data = TestAnswer::where($where)
            ->field('count(session_id) as allpeople,  count(CASE WHEN answer_num='.$real_num.' THEN answer_num END) as doallpeople')
            ->where($seconeWhere)
            ->find();
//        Collection($data)->toArray()  select 对象 2维对象 专属组
//        $data->toArray() find 单个查找 1维对象 转数组
        $newData = $data->toArray();
        $allpeople = $newData['allpeople'];
        $doallpeople = $newData['doallpeople'];
        // c）	完成率：完成测试的人数/进入测试的人数 * 100%
        $do_random = round($doallpeople / $allpeople, 2) * 100 . "%";

        $date_start = date('m.d', $start);
        $date_end = date('m.d', $end);
        $time = $date_start . "~" . $date_end;
        $list = [
            'time' => $time,
            'allpeople' => $allpeople,
            'doallpeople' => $doallpeople,
            'dorandom' => $do_random
        ];
        return json($list);
    }
}