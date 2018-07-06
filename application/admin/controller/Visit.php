<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:30
 */

namespace app\admin\controller;

use app\common\controller\Backend;
use app\admin\model\SessionUv;
use app\admin\model\AuthGroup;

class Visit extends Backend
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
        $params = $this->request->post();
        $start = strtotime($params['starttime']);
        $end = strtotime($params['endtime'] . "" . "23:59:59");
        $type = $params['type'] ? $params['type'] : 2; // 2 空为静心

        // 访客数
        $sql = "SELECT DISTINCT session_id FROM am_ada_session_uv WHERE group_id = {$type} AND date_time BETWEEN {$start} AND {$end}";
        $lists = SessionUv::query($sql);

        if (!empty($lists)) {
            $people = count($lists);
        } else {
            $people = 0;
        }

        // 有效访客数
        $qes2sql = "SELECT session_id  FROM am_ada_session_uv WHERE group_id = {$type} AND date_time BETWEEN {$start} AND {$end} GROUP BY session_id HAVING COUNT( session_id ) >2";
        $list_real = SessionUv::query($qes2sql);

        if (!empty($list_real)) {
            $real_people = count($list_real);
        } else {
            $real_people = 0;
        }

        // 触达率
        if ($real_people == 0 || $people == 0) {
            $option = 0;
        } else {
            $option = ($real_people / $people) * 100;
            $option = round($option, 2) . "%";
        }

        $date_start = date('m.d', $start);
        $date_end = date('m.d', $end);
        $time = $date_start . "~" . $date_end;
        $list = [
            'time' => $time,
            'people' => $people,
            'real_people' => $real_people,
            'option' => $option
        ];
        return json($list);
    }
}