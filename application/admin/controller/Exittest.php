<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:27
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\TestAnswer;
use app\common\controller\Backend;
use think\Db;

class Exittest extends Backend
{
    /** 主页显示
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

    /** 获取数据
     * @return \think\response\Json
     */
    public function getData()
    {
        header('Content-type:application/json;charset=utf-8;');
        $params = $this->request->post();

        $start = strtotime($params['starttime']);
        $end = strtotime($params['endtime'] . "" . "23:59:59");
        $group_id = $params['type'] ? $params['type'] : 2; // 2 空为静心

        $twhere['create_time'] = ['>', $start];
        $tseconeWhere['create_time'] = ['<', $end];
        $twhere['group_id'] = $group_id;
        $twhere['status'] = 1;


        // a）答题跳出

        $answer = TestAnswer::where($twhere)
            ->field("answer_num, count(session_id) as ctsid")
            ->where($tseconeWhere)
            ->group('answer_num')
            ->select();

        $answer = collection($answer)->toArray();
        $answer_num = array_column($answer, 'answer_num'); // 第N题跳出的数字索引
        $ctsid = array_column($answer, 'ctsid'); // 第N题 跳出的总人数

        $sum_ctsid = array_sum($ctsid); // 参加测试的总人数

        $newJson = TestAnswer::getSwitch($group_id, $answer_num, $ctsid, $sum_ctsid);
        return $newJson;

    }

}