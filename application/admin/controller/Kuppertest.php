<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:28
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\TestAnswer;
use app\common\controller\Backend;
use app\admin\model\SessionUv;
use think\Db;

class Kuppertest extends Backend
{
    protected $model = null;

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

    /**访问基本数据
     * @return \think\response\Json
     */
    public function getData()
    {
        header('Content-type:application/json;charset=utf-8;');
        $params = $this->request->post();

        $start = strtotime($params['starttime']);
        $end = strtotime($params['endtime'] . "" . "23:59:59");
        $group_id = $params['type'] ? $params['type'] : 2; // 2 空为静心
        $where['create_time'] = ['>', $start];
        $seconeWhere['create_time'] = ['<', $end];
        $where['group_id'] = $group_id;
        $where['status'] = 1;

        $twhere['date_time'] = ['>', $start];
        $tseconeWhere['date_time'] = ['<', $end];
        $twhere['group_id'] = $group_id;
        $twhere['status'] = 1;


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

        // a）	完成测试的人数：测试题结果文档中，字段“session_id”的个数；$doallpeople

        /** @var array $data */

        $data = TestAnswer::where($where)
            ->field("FROM_UNIXTIME(create_time,'%m月%d日') as columns, count(CASE WHEN answer_num={$real_num} THEN answer_num END) as doallpeople")
            ->where($seconeWhere)
            ->group('columns')
            ->select();

        $newData = collection($data)->toArray();

        // b） 有效访客数

        $list_sql = SessionUv::where($twhere)
            ->field("FROM_UNIXTIME(date_time,'%m月%d日') as time, count(session_id) as ctsid,session_id")
            ->where($tseconeWhere)
            ->group('time, session_id')
            ->having('count( session_id ) >2')
            ->buildSql();

        /** @var array $list_real */

        $list_real = Db::table($list_sql . ' a')
            ->field('a.time, SUM(ctsid) as sum')
            ->group('a.time')
            ->select();

        $goodData = collection($list_real)->toArray();


        // 循环时间
        $num = 24 * 3600;
        for ($i = $start; $i <= $end; $i += $num) {

            $newTime = date('m月d日', $i);
            $DoAllColumn = array_column($newData, 'columns');

            if (!in_array($newTime, $DoAllColumn)) {

                $doData = ['columns' => $newTime, 'doallpeople' => 0];
                array_push($newData, $doData);

            }
            $goodCloumn = array_column($goodData, 'time');

            if (!in_array($newTime, $goodCloumn)) {

                $data = ['time' => $newTime, 'sum' => 0];
                array_push($goodData, $data);

            }
        }

        sort($newData);
        sort($goodData);

        $finalData = [];
        try {
            foreach ($newData as $key => $newDatum) {

                $finalData[$key]['time'] = $newDatum['columns'];

                if ($goodData[$key]['sum'] != 0) {

//                    $value = round($newDatum['doallpeople'] / $goodData[$key]['sum'], 2) * 100 . '%';
                    $value = round($newDatum['doallpeople'] / $goodData[$key]['sum'], 2) * 100;

                } else {

                    $value = 0;

                }

                $finalData[$key]['value'] = $value;
            }
        } catch (\Exception $e) {

            $this->error('错误信息：' . $e->getMessage());

        }

        $time = array_column($finalData,'time');
        $value = array_column($finalData,'value');
        $finalData = array('time' => $time,'value' => $value);
        return json($finalData);
    }
}