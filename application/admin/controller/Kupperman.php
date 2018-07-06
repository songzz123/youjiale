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
use think\Db;

class Kupperman extends Backend
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

        // a）对应时间段中完成测试题的人数：测试结果文档中，字段“测试时间”对应时间段中的“session_id”的个数；

        $list_sql = KupperManResult::where($twhere)
            ->field("FROM_UNIXTIME(create_time,'%H:00') as time, count(session_id) as ctsid,ANY_VALUE(session_id) as session_id")
            ->where($tseconeWhere)
            ->group('time, session_id')
            ->buildSql();
        /** @var array $list_real */

        $list_real = Db::table($list_sql . ' a')
            ->field('a.time, SUM(ctsid) as sum')
            ->group('a.time')
            ->select();

        $goodData = collection($list_real)->toArray();

        // 循环时间
        for ($i = 0; $i <= 23; $i++) {

            if ($i<10){
                $i = "0" . $i;
            }
            $newTime = $i.':00';

            $goodCloumn = array_column($goodData, 'time');

            if (!in_array($newTime, $goodCloumn)) {

                $data = ['time' => $newTime, 'sum' => 0];
                array_push($goodData, $data);

            }
        }
        sort($goodData);

        $time = array_column($goodData, 'time');
        $value = array_column($goodData, 'sum');
        $finalData = array('time' => $time, 'value' => $value);
        return json($finalData);
    }

}