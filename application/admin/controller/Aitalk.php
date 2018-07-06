<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/4
 * Time: 17:30
 */

namespace app\admin\controller;


use app\admin\model\AuthGroup;
use app\common\controller\Backend;
use app\admin\model\SessionUv;

class Aitalk extends Backend
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
        $type = $params['type'] ? $params['type'] : 2; // 2 空为静心
        $where['date_time'] = ['>', $start];
        $seconeWhere['date_time'] = ['<', $end];
        $where['group_id'] = $type;
        $where['status'] = 1;

        // a) AI 区间查询 相对时间段的对话数
        $object = SessionUv::where($where)
            ->field("FROM_UNIXTIME(date_time,'%H') as columns, count(session_id) as data")
            ->where($seconeWhere)
            ->group('columns')
            ->select();
        $data = collection($object)->toArray();
        $column = array_column(collection($data)->toArray(), 'columns');
        $count = count($data);
        if ($count != 24) {

            for ($i = 0; $i <= 23; $i++) {
                if ($i < 10) {
                    $i = "0" . $i;
                }
                if (!in_array($i, $column)) {
                    $data[] = ['columns' => $i, 'data' => 0];
                }
            }
            sort($data);
            $newArray = self::getColumn($data);
            return json($newArray);
        } else {
            $newArray = self::getColumn($data);
            return json($newArray);
        }

    }

    /** 设置 返回数据索引column data 列
     * @param $data
     * @return array
     */
    public static function getColumn($data)
    {
        $column = array_column($data, 'columns');
        foreach ($column as &$col) {
            $col = $col.":00";
        }
        $data = array_column($data, 'data');
        $newArray = ['column' => $column, 'data' => $data];
        return $newArray;
    }
}