<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/4
 * Time: 09:35
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\FlowData;
use app\common\controller\Backend;
use app\admin\model\SessionUv;

class Alterdata extends Backend
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

    /**
     * @return \think\response\Json
     */
    public function getData()
    {
        $params = $this->request->post();
        $start = strtotime($params['starttime']);
        $end = strtotime($params['endtime'] . "" . "23:59:59");
        $type = $params['type'] ? $params['type'] : 2; // 2 空为静心
        $where['date'] = ['>', $start];
        $seconeWhere['date'] = ['<', $end];
        $where['group_id'] = $type;

        // a) AI 对话数
        $data = FlowData::where($where)
            ->field('sum(dialogue_during) as durings, sum(dialogue_pv) as sums')
            ->where($seconeWhere)
            ->find();
        if (!empty($data['sums']))
            $sums_talk = $data['sums'];
        else
            $sums_talk = 0;

        // b) AI 对话时长

        if (!empty($data['durings']))
            $durings = $data['durings'];
        else
            $durings = 0;

        // 有效访客数
        $session_uv_where['date_time'] = ['>', $start];
        $session_uvseconeWhere['date_time'] = ['<', $end];
        $session_uv_where['group_id'] = $type;

        $real_people = SessionUv::where($session_uv_where)
            ->where($session_uvseconeWhere)
            ->group('session_id')
            ->having('COUNT( session_id ) >2')
            ->count();

        if ($real_people == 0) {
            $avg_real_people = 0;
        } else {
            // c) 平均有效对话数  总对话数/有效访客数
            $avg_real_people = round($sums_talk / $real_people);
        }


        // d) 平均有效对话时长  总对话时长/有效访客数
        $avg_durings_real_people = round($durings / $real_people);
        $avgs = [
            'sums' => $sums_talk,
            'durings' => $durings,
            'avg_real_people' => $avg_real_people, //平均有效对话数
            'avg_durings_real_people' => $avg_durings_real_people, //平均有效对话时长
            'time' => date('m.d', $start) . '~' . date('m.d', $end)
        ];
        return json($avgs);
    }
}