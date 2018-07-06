<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:26
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\admin\model\Tag;
use app\admin\model\TagMap;
use app\common\controller\Backend;
use think\Collection;
use think\config as Configs;

use app\admin\controller\Tag as TagController;
use think\Model;
use Spatie\PdfToImage\Pdf;

use app\admin\model\DialogueNode as DialogueNodeModel;

class Dialoguenode extends Backend
{
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->group_id = $_SESSION['think']['admin']['id'];
        $this->model = model('DialogueNode');
    }

    /**
     * 项目列表页面
     *
     * @author      guoweibo
     */
    public function index()
    {
        //获取节点名称
        $options = DialogueNodeModel::where(['status' => 1,'group_id' => $this->group_id])
            ->field('ANY_VALUE(dialogue_node_name) as dialogue_node_name,ANY_VALUE(dialogue_node_id) as dialogue_node_id,SUM(exit_pv) as sum')
            ->group('dialogue_node_name')
            ->order('sum DESC')
            ->select();

        $this->view->assign([
            'options' => $options
        ]);
        return $this->view->fetch();
    }

    /**
     * @return \think\response\Json
     * @author      guoweibo
     */
    public function update()
    {
        $res = DialogueNodeModel::where('status', 0)->update(['status' => 1]);
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
        $res = DialogueNodeModel::where('status', 0)->delete();
        if ($res) {
            return json(['msg' => '成功']);
        }
        return json(['msg' => '数据异常']);
    }


    /**ajax获取对话节点数据
     * @return \think\response\Json
     * @throws \think\db\exception\BindParamException
     * @throws \think\exception\PDOException
     */
    public function getData()
    {
        $params = $this->request->post();
        $where = "status=1 AND group_id = {$this->group_id}";
        //开始时间
        if ($params['starttime']) {
            if ($starttime = strtotime($params['starttime'])) {
                $where .= " AND date_time>" . $starttime;
            }
        }
        //结束时间
        if ($params['endtime']) {
            if ($endtime = strtotime($params['endtime'] . "" . "23:59:59")) {
                $where .= " AND date_time<" . $endtime;
            }
        }
        //选项
        if (isset($params['options'])) {
            foreach ($params['options'] as &$v) {
                $v = '"' . $v . '"';
            }
            $in = implode(',', $params['options']);
            $where .= " AND dialogue_node_id IN ({$in})";
        }
        //排序
        $orderBy = $params['type'] ? $params['type'] : 'dialogue_pv';
        //拼装sql
        $sql = "SELECT
                  sum(exit_pv) exit_pv,
                  sum(dialogue_pv) dialogue_pv,
                  sum(exit_pv)/sum(dialogue_pv) rate,
                  dialogue_node_name
                FROM
                  am_ada_dialogue_node
                WHERE 
                  $where
                GROUP BY
                  dialogue_node_name
                ORDER BY
                  $orderBy
                DESC";
        $list = DialogueNodeModel::query($sql);

        $newArr = [];
        if ($list) {
            foreach ($list as $v) {
                $newArr['column'][] = $v['dialogue_node_name'];
                if ($orderBy == 'rate') {
                    $newArr['data'][] = sprintf("%.2f", $v[$orderBy] * 100);
                } else {
                    $newArr['data'][] = sprintf("%.2f", $v[$orderBy]);
                }
            }
        }
        return json($newArr);
    }


}