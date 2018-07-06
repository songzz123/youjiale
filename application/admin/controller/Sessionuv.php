<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:29
 */

namespace app\admin\controller;


use app\common\controller\Backend;

use app\admin\model\SessionUv as SessionUvModel;

class Sessionuv extends Backend
{
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->group_id = $_SESSION['think']['admin']['id'];
        $this->model = model('SessionUv');
    }

    /**
     * 项目列表页面
     *
     * @author      guoweibo
     */
    public function index()
    {
        //获取节点名称
//        $options = SessionUvModel::where('status', 1)
//            ->field('dialogue_node_name,dialogue_node_id')
//            ->group('dialogue_node_name')
//            ->order('SUM(exit_pv) DESC')
//            ->select();
//        $this->view->assign([
//            'options' => $options
//        ]);
        return $this->view->fetch();
    }

    /**
     * @return \think\response\Json
     * @author      guoweibo
     */
    public function update()
    {
        $res = SessionUvModel::where('status', 0)->update(['status' => 1]);
        if ($res) {
            return json(['msg' => '成功']);
        }
        return json(['msg' => '数据异常']);
    }


    /**
     * @return \think\response\Json
     * @author      guoweibo
     */
    public function delete()
    {
        $res = SessionUvModel::where('status', 0)->delete();
        if ($res) {
            return json(['msg' => '成功']);
        }
        return json(['msg' => '数据异常']);
    }



    /** ajax获取对话节点数据
     * @return \think\response\Json
     * @throws \think\db\exception\BindParamException
     * @throws \think\exception\PDOException
     */
    public function getData()
    {
        $params = $this->request->post();
        $where = "session.status=1 AND session.group_id={$this->group_id}";

        $type = $params['type'] ? $params['type'] : 'sum_uv';
        //开始时间
        if ($params['starttime']) {
            if ($starttime = strtotime($params['starttime'])) {
                $where .= " AND session.date_time>" . $starttime;
            }
        }
        //结束时间
        if ($params['endtime']) {
            if ($endtime = strtotime($params['endtime'] . "" . "23:59:59")) {
                $where .= " AND session.date_time<" . $endtime;
            }
        }
        //获取所有用户次数
        $uvsql = "SELECT 
                    session.stimes AS dtimes,count(session.stimes) AS uvcount
                  FROM 
                    (
                        SELECT
                            count(session_id) AS stimes,
                            ANY_VALUE (session_id) as session_id,
                            ANY_VALUE (date_time) AS date_time,
                            ANY_VALUE (status) AS  status,
                            ANY_VALUE (group_id) AS  group_id
                        FROM
                         am_ada_session_uv
                        GROUP BY
                         session_id
                    ) 
                  session 
                  WHERE 
                  $where
                  GROUP BY dtimes 
                  ORDER BY dtimes ASC";
        $allUser = SessionUvModel::query($uvsql);
        $newArr = [];
        foreach ($allUser as $k => $v) {
            switch ($type) {
                case 'sum_uv':
                    $newArr['column'][] = $v['dtimes'] - 1;
                    $newArr['data'][] = $v['uvcount'];
                    break;
                case 'rate_uv':
                    $newArr['column'][] = $v['dtimes'] - 1;
                    $newArr['data'][] = number_format(($v['uvcount'] / sum_array_value($allUser, 'uvcount'))*100,2);
                    break;
            }
        }
        return json($newArr);
    }

}