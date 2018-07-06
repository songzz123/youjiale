<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:29
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\KupperManResult;
use app\common\controller\Backend;

class Selectresult extends Backend
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

        // a）	每道测试题不同选项的选择次数：测试数据（全部）文档中，每道测试题，被用户选择的次数；

        $answer = KupperManResult::where($twhere)
            ->field("answer")
            ->where($tseconeWhere)
            ->select();

        $goodData = collection($answer)->toArray();

        // 调取 Model turnNumble 方法 处理想要的数据结构
        $newData = KupperManResult::turnNumble($goodData, $group_id);
        return json($newData);
    }

}