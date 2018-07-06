<?php

namespace app\yjl\controller;

use app\common\controller\Frontend;
use app\yjl\model\YjlAbapAiLog;
use app\yjl\model\YjlAnswers;
use app\yjl\model\YjlClickSym;
use app\yjl\model\YjlKupperMan;
use app\yjl\model\YjlSymptom;
use think\Request;

class Yjl extends Frontend
{

    protected $noNeedLogin = '*';
    protected $noNeedRight = '*';
    protected $layout = '';

    public function _initialize()
    {
        parent::_initialize();
    }

    /**渲染视图
     * @return string
     */

    protected static $url = "https://api-aicp.baidu.com/api/v1/core/query?version=20170407";

    public function index()
    {
        isset($_REQUEST['ref']) ? $_REQUEST['ref'] : 0;

        if (!empty($_REQUEST['ref'])) {

            $ref = $_REQUEST['ref'];
            $where['cate'] = $ref;

            $ids = YjlSymptom::where($where)
                ->field('id')
                ->find();

            if ($ids) {

                $id = $ids->toArray();
                $data['click_sym'] = $id['id'];
                $data['creat_time'] = date("Y-m-d H:i:s", time());
                $ip = $_SERVER['REMOTE_ADDR'];
                $data['ipaddr'] = $ip;
                $res = file_get_contents("http://ip.taobao.com/service/getIpInfo.php?ip=" . $ip);

                $ru = json_decode($res, true);
                /** @var string $city */
                if ($ru['code'] == 0) {
                    $city = $ru['data']['city'];
                }
                $data['city'] = $city;
                YjlClickSym::create($data);

            } else {

                return $this->view->fetch();

            }

        }

        return $this->view->fetch();
    }

    public function share()
    {
        return $this->view->fetch();
    }


//    /** TODO 平安路由
//     * @param $params
//     * @return string
//     */
//    public function pingan($params)
//    {
//        switch ($params) {
//            case 'a':
//                $this->assign('url', 'pingan/a');
//                return $this->view->fetch('hayao@hayao/index');
//                break;
//            case 'b':
//                $this->assign('url', 'pingan/b');
//                return $this->view->fetch('hayao@hayao/index');
//                break;
//            case 'c':
//                $this->assign('url', 'pingan/c');
//                return $this->view->fetch('hayao@hayao/index');
//                break;
//            case 'd':
//                $this->assign('url', 'pingan/d');
//                return $this->view->fetch('hayao@hayao/index');
//                break;
//            case 'e':
//                $this->assign('url', 'pingan/e');
//                return $this->view->fetch('hayao@hayao/index');
//                break;
//            case 'f':
//                $this->assign('url', 'pingan/f');
//                return $this->view->fetch('hayao@hayao/index');
//                break;
//        }
//    }


    /**接收API返回数据
     * @return \think\response\Json
     */
    public function getIndexData()
    {

        if (!isset($_REQUEST['query_text'])) {
            $arr = array("query_text" => "");
        } else if (!empty($_REQUEST['query_text']) && !empty($_REQUEST['session_id'])) {
            $arr = array("query_text" => $_REQUEST['query_text'], 'session_id' => $_REQUEST['session_id']);

        } else if (!empty($_REQUEST['session_id']) && isset($_REQUEST['context'])) {

            $arr = array('session_id' => $_REQUEST['session_id'], 'context' => array($_REQUEST['k'] => $_REQUEST['v']));

        } else {
            $arr = array("query_text" => $_REQUEST['query_text']);
        }


        $data = json_encode($arr);
        $out_json = $this->getInfobyapi(self::$url, $data);
        $otput = '';
        $otput = json_decode($out_json, true);

        /**
         * 添加LOG日志
         */
        $data = array();
        $data['session_id'] = $otput['data']['session_id'];
        if (!empty($_REQUEST['query_text'])) {
            $data['query_text'] = @$_REQUEST['query_text'];
        } else {
            $data['query_text'] = @$_REQUEST['v'];
        }
        $data['suggest_answer'] = @$otput["data"]['suggest_answer'];
        $data['answer'] = $out_json;
        $data['create_at'] = date('Y-m-d H:i:s');
        $data['output_at'] = date(date('Y-m-d H:i:s'), $otput['time']);
        session_start();
        $data['user_session_id'] = session_id();


        YjlAbapAiLog::create($data);

        //file_put_contents ('lhy.txt',print_r($otput,true));

        if ($otput['code'] == 200 && $otput['msg'] == "ok") {

            @$result_num = count($otput['data']['answer']['answer']);

            $val = array();

            for ($i = 0; $i < $result_num; $i++) {

                array_push($val, $otput['data']['answer']['answer'][$i]);

            }

            return json(
                [
                    "result_num" => $result_num,
                    "session_id" => $otput['data']['session_id'],
                    "value" => $val
                ]
            );
        } else {

            return json('内部数据出错', 400);

        }
    }


    /**
     * 答题逻辑
     */
    public function ajaxAction()
    {
        $request = Request::instance();
        if ($request->isAjax()) {

            $params = $request->post();
            $data = json_decode($params['data'], true);


            $act = $data['act'];

            /** @var string $res */
            switch ($act) {
                case 'sh_sub_test':  //问卷调查

                    $ans = json_decode($data['answer'], true);
                    $count = $this->tab($ans);

                    /** @var string $result */
                    if ($count < 5) {
                        $res = 'ok';
                        $result = '没毛病';
                    } elseif ($count >= 5) {
                        $res = 'sorry';
                        $result = '甲减';
                    }
                    $da['session_id'] = $data['session_id'];
                    $da['answer'] = $data['answer'];
                    $da['score'] = $count;
                    $da['result'] = $result;
                    $da['create_time'] = date('Y-m-d H:i:s');

                    YjlKupperMan::create($da);
                    return json(['msg' => $res, 'code' => 200], 200);

                    break;
                case 'gailv':

                    //写库

                    $qai['session_id'] = $data['session_id'];
                    $qai['num'] = $data['num'];
                    $qai['answer'] = json_encode($data['answer']);
                    $qai['create_ti'] = date('Y-m-d H:i:s');
                    //查询是否已经做题
                    $where['session_id'] = $data['session_id'];
                    $sel_ress = YjlAnswers::where($where)
                        ->field('answer')
                        ->find();

                    if ($sel_ress) {
                        $sel_res = $sel_ress->toArray();
                        $sel_result = json_decode($sel_res['answer'], true);
                        $count = count($sel_result);
                        if ($count == 1) {
                            $sel_result = array($sel_result);
                        }
                        array_push($sel_result, $data['answer']);
                        $qai2['answer'] = json_encode($sel_result);
                        $qai2['num'] = $qai['num'];
                        $qai2['create_ti'] = date('Y-m-d H:i:s');
                        if (YjlAnswers::update($qai2, $where)) {

                            return json('修改成功', 201);

                        } else {

                            return json('修改失败', 405);

                        }

                    } else {

                        if (YjlAnswers::create($qai)) {
                            return json('添加成功', 201);
                        } else {

                            return json('添加失败', 405);

                        }

                    }

                    break;
                default:
                    break;


            }
        } else {
            return json('请求方式错误', 400);
        }
    }


    /**切换答案ABC 得出结果分数
     * @param $ans
     * @return int
     */
    public function tab($ans)
    {
        $num = 0;
        foreach ($ans as &$an) {
            if ($an == 'A') {
                $an = 1;
            } else {
                $an = 0;
            }
            $num += $an;
        }
        return $num;
    }

    /**
     * curl post请求api header中包含auth验证token
     * @param $url
     * @param $data
     * @return mixed
     */


    function getInfobyapi($url, $data)
    {
        $header = array(
            'Content-Type: application/json',
            'Authorization:AICP 55bee813-88c0-4220-86c7-60c9b374ce43');
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);//post传输的数据。

        $output = curl_exec($ch);
        curl_close($ch);

        return $output;
    }

}
