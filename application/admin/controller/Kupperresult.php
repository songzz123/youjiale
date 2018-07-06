<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:28
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\KupperManResult;
use app\common\controller\Backend;

class Kupperresult extends Backend
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

    /** 测试结果获取数据
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

        // TODO a)	测试结果：测试题结果文档中，字段“病情状况”中，正常、轻度、中度、重度，四种症状分别出现的次数；

        $list_real = KupperManResult::where($twhere)
            ->field("count(session_id) as value,result as name")
            ->where($tseconeWhere)
            ->group('name')
            ->select();

        $goodData = collection($list_real)->toArray();
        $name = array_column($goodData, 'name');
        $value = array_column($goodData, 'value');

        $finalData = array('name' => $name, 'value' => $value, 'goodData' => $goodData);
        return json($finalData);
    }
}