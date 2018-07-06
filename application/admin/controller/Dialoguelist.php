<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/25
 * Time: 14:25
 */

namespace app\admin\controller;

use app\common\controller\Backend;
use PHPExcel_IOFactory;
use app\admin\model\DialogueNode as DialogueNodeModel;
use PHPExcel_Shared_Date;
use think\config as Configs;
use app\admin\model\Admin as AdminModel;

class Dialoguelist extends Backend
{
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('DialogueFileLog');
    }


    /**
     * 针对百度AICP返回数据，其中有些数据是错误的，需要进行导入部分优化，直到发现全部BUG
     */

    /**
     * 项目列表页面
     *
     * @author      guoweibo
     */
    public function index($data = [])
    {
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            //标签查询
            $total = DialogueNodeModel::where($where)
                ->where('status', 0)
                ->order($sort, $order)
                ->count();
            $list = DialogueNodeModel::where($where)
                ->where('status', 0)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            foreach ($list as $k => &$v) {
            }
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }

        if (!empty($data)) {
            echo 1;
            die;
        }
        return $this->view->fetch();
    }

    /**
     * 添加
     *
     * @return string
     * @author      guoweibo
     */
    public function add()
    {
        set_time_limit(90);
        ini_set("memory_limit", "1024M");
        if ($this->request->isPost()) {
            $params = $this->request->post();
            if ($params) {
                $result = $this->model->save($params);
                if ($result === false) {
                    $this->error($this->model->getError());
                }
                //上传类型判断
                switch (pathinfo($params['path'])['extension']) {
                    case 'csv':
                        $data = $this->addCvs($params['path'], 0, $params['group_id']);
                        break;
                    case 'xlsx':
                        $data = $this->addExcel($params['path'], '', 'xlsx');
                        break;
                    case 'xls':
                        $data = $this->addExcel($params['path'], '', 'xls');
                        break;
                    default:
                        $this->error('文件格式不存在', null, []);
                }

                //数据库 1对话效果 2uv占比
                switch ($params['type']) {
                    case 0: // 对话节点效果
                        $this->addDialogueNode($data, $params['group_id']);
                        break;
                    case 1: // UV 占比 UV 数
                        $this->addSessionUv($data, $params['group_id']);
                        break;
                    case 2: // 交互基本数据
                        $this->adddialogue_PV($data, $params['group_id']);
                        break;
                    case 3: // 测试答题跳出
                        $this->exitTest($data, $params['group_id']);
                        break;
                    case 4: // 测试结果kupperman
                        $this->addKupperMan($data, $params['group_id']);
                        break;
                }
                $this->success();
            }
            $this->error();
        }
        return $this->view->fetch();
    }


    /**
     * 对话效果添加数据库
     *
     * @param $data
     * @author      guoweibo
     */
    public function addDialogueNode($data, $grop_id)
    {
        try {

            foreach ($data as $k => $v) {
                if ($k != 1) {
                    $newData[] = [
                        'agentid' => $v['A'],
//                        'date_time' => strtotime($this->excelDate($v['B'], $this->excelTime($v['B']))),
                        'date_time' => PHPExcel_Shared_Date::ExcelToPHP($v['B']),
                        'dialogue_node_id' => $v['C'],
                        'dialogue_node_name' => $v['D'],
                        'uv' => $v['E'],
                        'entry_pv' => $v['F'],
                        'exit_pv' => $v['G'],
                        'dialogue_pv' => $v['H'],
                        'group_id' => $grop_id
                    ];
                }
            }

            unset($data);
            model('DialogueNode')->saveAll($newData);

        } catch (\Exception $e) {

//            $this->error('文件异常,上传文件字段正确', null, []);
            $this->error($e->getMessage(), null, []);

        }
    }

    /**
     * UV数添加数据库
     *
     * 字段
     * ["A"] => string(4) "date"
     * ["B"] => string(4) "time"
     * ["C"] => string(7) "agentid"
     * ["D"] => string(10) "session_id"
     * ["E"] => string(10) "query_text"
     * ["F"] => string(14) "dialog_node_id"
     * ["G"] => string(16) "dialog_node_name"
     * ["H"] => string(5) "value"
     * ["I"] => string(7) "webhook"
     * ["J"] => string(12) "last_node_id"
     * ["K"] => string(7) "context"
     * ["L"] => string(4) "hour"
     * ["M"] => string(8) "chat_seq"
     * ["N"] => string(6) "bounce"
     * ["O"] => string(8) "node_seq"
     *
     * @param $data
     * @author      guoweibo
     */
    public function addSessionUv($data, $group_id)
    {
        try {
            $newData = [];
            foreach ($data as $k => $v) {
                if ($k != 1) {
                    $newData[] = [
                        'date_time' => strtotime(date('Y-m-d', PHPExcel_Shared_Date::ExcelToPHP($v['A'])) . " " . $this->excelTime($v['B'])),
                        'agentid' => $v['C'],
                        'session_id' => $v['D'],
//                        'query_text' => mb_convert_encoding($v['E'], 'UTF-8'), //字节问题
                        'dialog_node_id' => $v['F'],
                        'dialog_node_name' => $v['G'],
                        'value' => $v['H'] ? $v['H'] : '',
                        'webhook' => $v['I'],
                        'last_node_id' => $v['J'],
                        'chat_seq' => $v['M'],
                        'bounce' => $v['N'],
                        'node_seq' => $v['O'],
                        'group_id' => $group_id
                    ];
                }
            }

            unset($data);
            model('SessionUv')->saveAll($newData);
        } catch (\Exception $e) {
            $this->error('数据库字段异常:' . $e->getMessage(), null, []);
        }
    }

    /** 测试答题 跳出
     * @param $data
     * @param $group_id
     */
    public function exitTest($data, $group_id)
    {
        /** @var integer $real_num */
        // TODO 判断 GROUP_ID 分组
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

        try {
            $newData = [];

            foreach ($data as $k => $v) {
                if ($k != 1) {
                    $newData[] = [
                        'session_id' => $v['A'],
                        'answer_num' => $v['B'],
                        'real_num' => $real_num,
                        'create_time' => strtotime($v['D']),
                        'group_id' => $group_id
                    ];
                }
            }

            unset($data);
            model('TestAnswer')->saveAll($newData);
        } catch (\Exception $e) {
            $this->error('数据库字段异常', null, []);
        }
    }

    public function addKupperMan($data, $group_id)
    {
        /** @var integer $real_num */
        // TODO 判断 GROUP_ID 分组
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

        try {
            $newData = [];

            foreach ($data as $k => $v) {
                $counts = count(json_decode($v['B'], true));

                if ($k != 1) {
                    if (!empty($v['A']) && !empty($v['B']) && ($counts == $real_num)) {

                        $newData[] = [
                            'session_id' => $v['A'],
                            'answer' => $v['B'],
                            'result' => $v['D'],
                            'create_time' => strtotime($v['E']),
                            'status' => 1,
                            'group_id' => $group_id
                        ];

                    }
                }
            }

            unset($data);
            model('KupperManResult')->saveAll($newData);
        } catch (\Exception $e) {
            $this->error('数据库字段异常:' . $e->getMessage(), null, []);
        }
    }

    /** dialogue_PV 用户交互基本数据
     * @param $data
     */
    public function adddialogue_PV($data, $group_id)
    {
        try {
            $newData = [];
            foreach ($data as $k => $v) {
                if ($k != 1) {
                    if ($v['F'] == 'NULL')
                        $dialogue_during = 0;
                    else
                        $dialogue_during = $v['F'];
                    $newData[] = [
                        'agentid' => $v['A'],
                        'date' => PHPExcel_Shared_Date::ExcelToPHP($v['B']),
                        'uv' => $v['C'],
                        'dialogue_pv' => $v['D'],
                        'bounce_uv' => $v['E'],
                        'dialogue_during' => $dialogue_during,
                        'group_id' => $group_id
                    ];
                }
            }

            unset($data);
            model('FlowData')->saveAll($newData);
        } catch (\Exception $e) {
            $this->error('数据库字段异常', null, []);
        }
    }


    /**
     * 获取cvs读取
     *
     * @author      guoweibo
     */
    public function addCvs($filePath = '', $type = 0, $group_id)
    {
        if ($filePath) {
            try {
                $data = read_csv_lines('.' . $filePath, '', '', $type, $group_id);
            } catch (\Exception $e) {
                $this->error('文件异常,请确定上传文件正确', null, []);
            }
            if ($data) {
                return $data;
            }
            return false;
        }
        return false;
    }


    /**
     * 上传excel
     *
     * @param string $filePath
     * @return array
     * @author      guoweibo
     */
    public function addExcel($filePath = '', $column = [], $type)
    {
        if (!$filePath) {
            return false;
        }
        try {
            /** @var string $excel */

            switch ($type) {
                case 'xlsx':
                    $excel = 'Excel2007';
                    break;
                case 'xls':
                    $excel = 'Excel5';
                    break;

            }

            $reader = PHPExcel_IOFactory::createReader($excel); //设置以Excel5格式(Excel2007工作簿)
            $PHPExcel = $reader->load('.' . $filePath); // 载入excel文件

            $sheet = $PHPExcel->getSheet(0); // 读取第一個工作表
            $highestRow = $sheet->getHighestRow(); // 取得总行数
            $highestColumm = $sheet->getHighestColumn(); // 取得总列数
            /** 循环读取每个单元格的数据 */
            $data = [];
            for ($row = 2; $row <= $highestRow; $row++) {//行数是以第1行开始
                for ($column = 'A'; $column <= $highestColumm; $column++) {//列数是以A列开始
                    $data[$row][$column] = $sheet->getCell($column . $row)->getValue();
                }
            }
            return $data;
        } catch (\Exception $e) {
//            $this->error('文件异常,请确定上传文件正确', null, []);
            $this->error($e->getMessage(), null, []);
        }
    }


    public function test()
    {
        $reader = PHPExcel_IOFactory::createReader('Excel2007'); //设置以Excel5格式(Excel97-2003工作簿)
        $PHPExcel = $reader->load('./1.xlsx'); // 载入excel文件
        $sheet = $PHPExcel->getSheet(0); // 读取第一個工作表
        $highestRow = $sheet->getHighestRow(); // 取得总行数
        $highestColumm = $sheet->getHighestColumn(); // 取得总列数
        /** 循环读取每个单元格的数据 */
        $data = [];
        for ($row = 1; $row <= $highestRow; $row++) {//行数是以第1行开始
            for ($column = 'A'; $column <= $highestColumm; $column++) {//列数是以A列开始
                $data[$row][$column] = $sheet->getCell($column . $row)->getValue();
            }
        }

        $newData = [];
        foreach ($data as $k => $v) {
            if ($k != 1) {
                $newData[] = [
                    'data_time' => strtotime($this->excelDate($v['A'], $this->excelTime($v['B']))),
                    'agentid' => $v['C'],
                    'session_id' => $v['D'],
//                    'query_text' => $v['E'] ? $v['E'] : '',
                    'dialog_node_id' => $v['F'],
                    'dialog_node_name' => $v['G'],
                    'value' => $v['H'] ? $v['H'] : '',
                    'webhook' => $v['I'],
                    'last_node_id' => $v['J'],
                    'chat_seq' => $v['M'],
                    'bounce' => $v['N'],
                    'node_seq' => $v['O'],
                ];
            }
        }
//        model('SessionUv')->saveAll($newData);
//        unset($data);
        dump($newData);
        exit;

    }


    /**
     * 格式化excel日期
     *
     * @param $date
     * @param bool $time
     * @return array|int|string
     * @author      guoweibo
     */
    public function excelDate($date, $time = false)
    {
        if (function_exists('GregorianToJD')) {
            if (is_numeric($date)) {
                $jd = GregorianToJD(1, 1, 1970);
                $gregorian = JDToGregorian($jd + intval($date) - 25569);
                $date = explode('/', $gregorian);
                $date_str = str_pad($date [2], 4, '0', STR_PAD_LEFT)
                    . "-" . str_pad($date [0], 2, '0', STR_PAD_LEFT)
                    . "-" . str_pad($date [1], 2, '0', STR_PAD_LEFT)
                    . ($time ? $time : '00:00:00');
                return $date_str;
            }
        } else {
            $date = $date > 25568 ? $date + 1 : 25569;
            /*There was a bug if Converting date before 1-1-1970 (tstamp 0)*/
            $ofs = (70 * 365 + 17 + 2) * 86400;
            $date = date("Y-m-d", ($date * 86400) - $ofs) . ($time ? $time : '00:00:00');
        }
        return $date;
    }

    function exceltimtetophp($days, $time = false)
    {
        if (is_numeric($days)) {
            $jd = GregorianToJD(1, 1, 1970);
            $gregorian = JDToGregorian($jd + intval($days) - 25569);
            $myDate = explode('/', $gregorian);
            $myDateStr = str_pad($myDate[2], 4, '0', STR_PAD_LEFT)
                . "-" . str_pad($myDate[0], 2, '0', STR_PAD_LEFT)
                . "-" . str_pad($myDate[1], 2, '0', STR_PAD_LEFT)
                . ($time ? "00:00:00" : '');
            return $myDateStr;
        }
        return $days;
    }


    /**
     * 格式化excel时间
     *
     * @param $time
     * @return bool|string
     * @author      guoweibo
     */
    public function excelTime($time)
    {
        if ($time) {
            $second = round($time * 86400);
            return (new \DateTime('@0'))->diff(new \DateTime("@$second"))->format(' %H:%I:%S');
        }
        return false;
    }

}