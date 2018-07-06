<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/6/5
 * Time: 09:57
 */

namespace app\hayao\controller;

use app\common\controller\Frontend;
use app\common\library\Token;
use app\hayao\model\TestHyaoAbapAiLog;
use app\hayao\model\TestHyaoAnswers;
use app\hayao\model\TestHyaoChildren;
use app\hayao\model\TestHyaoGrowup;
use app\hayao\model\TestHyaoKupperMan;
use think\Request;

class Testhayao extends Frontend
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
        return $this->view->fetch();
    }


    /** TODO 平安路由
     * @param $params
     * @return string
     */
    public function pingan($params)
    {
        switch ($params) {
            case 'a':
                $this->assign('url', 'pingan/a');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'b':
                $this->assign('url', 'pingan/b');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'c':
                $this->assign('url', 'pingan/c');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'd':
                $this->assign('url', 'pingan/d');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'e':
                $this->assign('url', 'pingan/e');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'f':
                $this->assign('url', 'pingan/f');
                return $this->view->fetch('hayao@testhayao/index');
                break;
        }
    }

    /** TODO 宝宝树路由
     * @param $params
     * @return string
     */
    public function baobaoshu($params)
    {
        switch ($params) {
            case 'a':
                $this->assign('url', 'baobaoshu/a');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'b':
                $this->assign('url', 'baobaoshu/b');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'c':
                $this->assign('url', 'baobaoshu/c');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'd':
                $this->assign('url', 'baobaoshu/d');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'e':
                $this->assign('url', 'baobaoshu/e');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'f':
                $this->assign('url', 'baobaoshu/f');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'g':
                $this->assign('url', 'baobaoshu/g');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'h':
                $this->assign('url', 'baobaoshu/h');
                return $this->view->fetch('hayao@testhayao/index');
                break;
        }
    }

    /** // TODO 百度路由
     * @param $params
     * @return string
     */
    public function baidu($params)
    {
        switch ($params) {
            case 'a':
                $this->assign('url', 'baidu/a');
                return $this->view->fetch('hayao@testhayao/index');
                break;
            case 'b':
                $this->assign('url', 'baidu/b');
                return $this->view->fetch('hayao@testhayao/index');
                break;
        }
    }


    /**接收API返回数据
     * @return \think\response\Json
     */
    public function getIndexData()
    {
        $typeurl = $_REQUEST['typeurl'];
        // TODO 判断 $typeurl
        if (!empty($typeurl)) {
            if ($typeurl == 'self') {
                $header = array(
                    'Content-Type: application/json',
                    'Authorization:AICP 46e39970-2c3e-4203-b642-d997c8885294');
            } else {
                $header = $this->getSwitch($typeurl);
            }

        } else {
            return json(array('数据出错'), 500);
        }

        if (!isset($_REQUEST['query_text'])) {
            $arr = array("query_text" => "");
        } else if (!empty($_REQUEST['query_text']) && !empty($_REQUEST['session_id'])) {
            $arr = array("query_text" => $_REQUEST['query_text'], 'session_id' => $_REQUEST['session_id']);

        } else if (!empty($_REQUEST['session_id']) && isset($_REQUEST['context'])) {

            $arr = array('session_id' => $_REQUEST['session_id'], 'context' => array($_REQUEST['k'] => $_REQUEST['v']));

        } else {
            $arr = array("query_text" => $_REQUEST['query_text']);
        }

        $arr['test_console'] = true;
        $arr['test_mode'] = true;


        $data = json_encode($arr);
        $out_json = $this->getInfobyapi(self::$url, $data, $header);
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
        $data['link_url'] = $typeurl;


        TestHyaoAbapAiLog::create($data);


        if ($otput['code'] == 200 && $otput['msg'] == "ok") {

            $result_num = count($otput['data']['answer']['answer']);
            $val = array();
            if (!empty($otput['data']['answer']['answer']['text'])) {
                $val[0]['value'] = $otput['data']['answer']['answer']['text'];
            } else {
                for ($i = 0; $i < $result_num; $i++) {
                    array_push($val, $otput['data']['answer']['answer'][$i]);
                }
            }
            return json(array("result_num" => $result_num,
                "session_id" => $otput['data']['session_id'],
                "value" => $val
            ));
        }
        return json(['code' => 200, 'msg' => '对接完成']);
    }


    /**
     * 答题逻辑
     */
    public function ajaxAction()
    {
        $params = $this->request->post();
        $data = json_decode($params['data'], true);

        $act = $data['act'];

        switch ($act) {

            case 'naire':  //问卷调查

                $da['session_id'] = $data['session_id'];
                $da['answer'] = $data['answer'];

                $ans = json_decode($data['answer'], true);

                foreach ($ans as &$an) {
                    $an = explode(',', $an);

                    $c = count($an);

                    for ($i = 0; $i < $c; $i++) {
                        if ($an[$i] == 'A-ZnCa' || $an[$i] == 'B-ZnCa' || $an[$i] == 'C-ZnCa' || $an[$i] == 'D-ZnCa' || $an[$i] == 'E-ZnCa') {
                            $an[$i] = str_replace('A-ZnCa', 1, $an[$i]);
                            $an[$i] = str_replace('B-ZnCa', 1, $an[$i]);
                            $an[$i] = str_replace('C-ZnCa', 1, $an[$i]);
                            $an[$i] = str_replace('D-ZnCa', 1, $an[$i]);
                            $an[$i] = str_replace('E-ZnCa', 1, $an[$i]);
                        }
                        if ($an[$i] == 'A-Ca' || $an[$i] == 'B-Ca' || $an[$i] == 'C-Ca' || $an[$i] == 'D-Ca' || $an[$i] == 'E-Ca') {
                            $an[$i] = str_replace('A-Ca', 1, $an[$i]);
                            $an[$i] = str_replace('B-Ca', 1, $an[$i]);
                            $an[$i] = str_replace('C-Ca', 1, $an[$i]);
                            $an[$i] = str_replace('D-Ca', 1, $an[$i]);
                            $an[$i] = str_replace('E-Ca', 1, $an[$i]);
                        }
                        if ($an[$i] == 'A' || $an[$i] == 'B' || $an[$i] == 'C' || $an[$i] == 'D') {
                            $an[$i] = str_replace('A', 1, $an[$i]);
                            $an[$i] = str_replace('B', 1, $an[$i]);
                            $an[$i] = str_replace('C', 1, $an[$i]);
                            $an[$i] = str_replace('D', 1, $an[$i]);
                        }
                        if ($an[$i] == 'F') {
                            $an[$i] = str_replace('F', 0, $an[$i]);
                        }
                    }
                }

                $sum1 = array_sum($ans[1]);
                $sum2 = array_sum($ans[2]);
                $sum3 = array_sum($ans[3]);
                $newSum = [$sum1, $sum2, $sum3]; // 症状出现次数 排序数组
                $c = count($newSum);

                $FlagF = 0; // F选项次数
                for ($i = 0; $i < $c; $i++) {
                    if ($newSum[$i] == 0) {
                        $FlagF += 1;
                    }
                }
                /** @var string $result */

                if ($FlagF == 3){
                    $result = '营养均衡';
                    $max = 0;
                }else{
                    $max = max($newSum);
                    $key = array_search($max,$newSum);
                    if ($key == 0){ // A-Ca
                        if (1 <= $max && $max <=2) {
                            $result = '钙-稍微缺乏';
                        }elseif (3 <= $max && $max <=4){
                            $result = '钙-较重缺乏';
                        }elseif ($max == 5){
                            $result = '钙-严重缺乏';
                        }
                    }elseif ($key == 1){ // A-ZnCa
                        if (1 <= $max && $max <=2) {
                            $result = '锌-稍微缺乏';
                        }elseif (3 <= $max && $max <=4){
                            $result = '锌-较重缺乏';
                        }elseif ($max == 5){
                            $result = '锌-严重缺乏';
                        }
                    }elseif ($key == 2){ // A 其他营养元素
                        if (1 <= $max && $max <=2) {
                            $result = 'other-稍微缺乏';
                        }elseif (3 <= $max && $max <=4){
                            $result = 'other-较重缺乏';
                        }elseif ($max == 5){
                            $result = '锌-严重缺乏';
                        }
                    }
                }

                $da['score'] = $max;
                $da['result'] = $result;
                $da['create_time'] = date('Y-m-d H:i:s');
                TestHyaoKupperMan::create($da);

                return json(array('code' => 1, 'msg' => $result), 200);

                break;
            case 'gailv':

                //写库

                $qai['session_id'] = $data['session_id'];
                $qai['num'] = $data['num'];
                $qai['answer'] = json_encode($data['answer']);
                $qai['create_ti'] = date('Y-m-d H:i:s');
                //查询是否已经做题
                $firstWhere['session_id'] = $data['session_id'];
                $hasOne = TestHyaoAnswers::where($firstWhere)->find();

                if ($hasOne) {

                    $qai2['answer'] = json_encode($data['answer']);
                    $qai2['num'] = $qai['num'];
                    $qai2['create_ti'] = date('Y-m-d H:i:s');

                    $upbool = TestHyaoAnswers::update($qai2, ["session_id" => $data['session_id']]);

                    if ($upbool) {

                        return json('修改成功');

                    } else {

                        return json('修改失败');

                    }

                } else {
                    $bool = TestHyaoAnswers::create($qai);
                    if ($bool) {

                        echo '添加成功';

                    } else {

                        echo '添加失败';

                    }

                }

                break;
            default:
                break;


        }
    }


    /**分发数据连接提交来源
     * @param $typeurl string 数据来源
     * @return array Header头
     */
    public function getSwitch($typeurl)
    {
        /** @var array $header */
        switch ($typeurl) {
            /**
             * 媒介部分
             */
            // TODO  平安（媒介）6个
            case 'pingan/a':
                $header = $this->getHeader('媒介');
                break;
            case 'pingan/b':
                $header = $this->getHeader('媒介');
                break;
            case 'pingan/c':
                $header = $this->getHeader('媒介');
                break;
            case 'pingan/d':
                $header = $this->getHeader('媒介');
                break;
            case 'pingan/e':
                $header = $this->getHeader('媒介');
                break;
            case 'pingan/f':
                $header = $this->getHeader('媒介');
                break;

            // TODO 宝宝树（媒介）8个
            case 'baobaoshu/a':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/b':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/c':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/d':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/e':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/f':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/g':
                $header = $this->getHeader('媒介');
                break;
            case 'baobaoshu/h':
                $header = $this->getHeader('媒介');
                break;
            // TODO 百度（媒介）2个
            case 'baidu/a':
                $header = $this->getHeader('媒介');
                break;
            case 'baidu/b':
                $header = $this->getHeader('媒介');
                break;
        }
        return $header;
    }

    public function getHeader($whichHeader)
    {
        /** @var string $header */
        switch ($whichHeader) {
            case '媒介':
                $header = array(
                    'Content-Type: application/json',
                    'Authorization:AICP 8663ab2a-3769-492d-9d49-cdd8359fe32a');
                break;
        }

        return $header;
    }

    /**
     * curl post请求api header中包含auth验证token
     * @param $url
     * @param $data
     * @return mixed
     */


    function getInfobyapi($url, $data, $header)
    {
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


    /**
     * TODO 身高自测
     */
    public function testFunc()
    {
        $request = Request::instance();

        if ($request->isAjax()) {
            $params = $request->post();
            $sex = $params['sex']; // 0 男 1 女
            $age = $params['age'];
            $height = $params['height'];
            $weight = $params['weight'];
            $session_id = $params['session_id'];
            if (!empty($age) && !empty($height) && !empty($weight)) {

                if ($age > 18 || $age < 0) {
                    return json(['msg' => '18岁以下的才是宝宝哦！', 'code' => 400]);
                }
                // 计算自身的MBI
                $m_height = $height / 100;
                $mbi = $weight / ($m_height * $m_height);
                $mbi = bcsub($mbi, 0, 1);
                // 查找该年龄段的 MBI症状值区间 中位值 身高正常值
                $ageWhere['age'] = $age;
                if ($sex == 0) {// 男

                    $field = 'bgoodwei_one as mbi_one, bgoodwei_two as mbi_two, boyfatwei as fat, boy_middle as middle, boy_height as height';

                } else {// 女

                    $field = 'ggoodwei_one as mbi_one, ggoodwei_two as mbi_two, girlfatwei as fat, girl_middle as middle, girl_height as height';

                }

                $listresult = TestHyaoGrowup::where($ageWhere)
                    ->field($field)
                    ->find();

                $result = $listresult->toArray();

                $mbi_one = $result['mbi_one'];
                $mbi_two = $result['mbi_two'];
                $fat = $result['fat'];
                $middle = $result['middle'];
                $good_height = $result['height'];

                // TODO 判断MBI值区间 得出症状
                $zz = '';
                if ($mbi < $mbi_one) {
                    $zz = '偏瘦';
                } elseif ($mbi >= $mbi_one && $mbi <= $mbi_two) {
                    $zz = '正常';
                } elseif ($mbi > $mbi_two && $mbi < $fat) {
                    $zz = '超重';
                } elseif ($mbi >= $fat) {
                    $zz = '肥胖';
                }

                // TODO 计算中位值&实际值的绝对比差值 & 添加数据库
                $abs_num = abs($mbi - $middle);
                // TODO 计算孩子的身高症状 偏矮
                $hei_num = $height - $good_height;
                /** @var string $zz_height 孩子身高症状 */
                if ($hei_num < 0) {
                    $zz_height = '偏矮';
                } else {
                    $zz_height = '正常';
                }
                $data['zz_height'] = $zz_height;
                $data['zz_mbi'] = $zz;
                $data['height'] = $height;
                $data['weight'] = $weight;
                $data['sex'] = $sex;
                $data['age'] = $age;

                // TODO 添加三项数据到数据库

                // TODO 查询是否已经插入过，没有插入继续插。插过了待会重插！
                /** 后期 变为可更改 即可显示出来
                 * $ress = "SELECT id FROM `abap_children` WHERE session_id = '" . $session_id . "'";
                 * $resu = $db->query($ress);
                 * if ($resu->hasNext()) {// 有值
                 * $sql = sqlUpdateUtil(array("session_id", $session_id), $data, "abap_children");
                 * $db->query($sql);
                 * } else {
                 * $data['session_id'] = $session_id;
                 * $res = $db->query(sqlInsertUtil($data, 'abap_children'));
                 * }
                 * */
                $data['session_id'] = $session_id;
                $data['create_at'] = date("Y-m-d H:i:s", time());
                //    $data['create_at'] = time();
                TestHyaoChildren::create($data);

                return json($this->getTop($zz, $zz_height, $mbi, $session_id, $sex, $age));

            } else {

                return json(['msg' => '必须全部写进去┗|｀O′|┛ 嗷~~', 'code' => '400']);

            }
        } else {

            return json(['msg' => '请求方式错误', 'code' => '400']);

        }


    }

    // 答题部分

    /**
     * @param $zz         string  体型症状
     * @param $zz_height  string  身高症状
     * @param $mbi        string  mbi值
     * @param $session_id string  session_id
     * @param $sex        integer 性别
     * @param $age        integer 年龄
     * @return mixed      array   数组
     */
    public function getTop($zz, $zz_height, $mbi, $session_id, $sex, $age)
    {

        /** @var string $sys_say */
        if ($zz == '正常' && $zz_height == '偏矮') {// 偏矮
            $sys_say = '偏矮';
        } elseif ($zz == '偏瘦' && $zz_height == '偏矮') {// 矮瘦
            $sys_say = '矮瘦';
        } elseif (($zz == '肥胖') && $zz_height == '偏矮') {// 矮胖
            $sys_say = '矮胖';
        } elseif ($zz == '偏瘦' && $zz_height == '正常') {// 偏瘦
            $sys_say = '偏瘦';
        } elseif ($zz == '超重' && ($zz_height == '正常' || $zz_height == '偏矮')) {// 超重
            $sys_say = '超重';
        } elseif ($zz == '肥胖' && $zz_height == '正常') {// 肥胖
            $sys_say = '肥胖';
        } elseif ($zz == '正常' && $zz_height == '正常') {// 正常
            $sys_say = '正常';
        }

        // 查询测试总人数的数据
        $field = 'session_id as sid,height,create_at';
        $where['sex'] = $sex;
        $where['age'] = $age;
        $testResult = TestHyaoChildren::where($where)
            ->field($field)
            ->order('height DESC')
            ->select();
        $testPeoples = collection($testResult)->toArray();

        $count_num = count($testPeoples); // 总参与人数
        // 循环查出本人排名
        /** @var array $top_sid */
        foreach ($testPeoples as $key => $value) {
            if ($session_id == $value['sid']) {

                $top_sid[$key + 1] = $value['create_at'];
            }
        }

        arsort($top_sid); // 按照值逆向排序 保留索引值
        $i = 0;
        /** @var array $arr */
        foreach ($top_sid as $k => $t) {
            $arr[$i] = $k;
            $i++;
        }

        $top = $arr[0];


//    if ($zz == '正常' && $zz_height == '正常') {
//        $returnMsg['code'] = 200;
//    } else {
//        $returnMsg['code'] = 201;
//    }
        $chao_num_bai = round(($count_num - $top) / $count_num, 1) * 100 . "%";// 超出总人数
        $returnMsg['code'] = 200;
        $returnMsg['mbi'] = $mbi;
        $returnMsg['zz'] = $sys_say;
        $returnMsg['tops'] = $top;
        $returnMsg['sex'] = $sex;
        $returnMsg['msgs'] = $chao_num_bai;
        return $returnMsg;
    }


    /**
     * 生长发育标准文件上传
     */
    public function file()
    {
        return $this->view->fetch();
    }

    /**
     * 生长发育标准文件上传
     */
    public function fileput()
    {
        header("Content-Type:text/html;charset=utf-8");
        $path = "./uploads/";
        $extArr = array("xlsx", "xls", "png", "gif", "jpg");
        if (isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST") {
            $name = $_FILES['photoimg']['name'];
            $size = $_FILES['photoimg']['size'];
            if (empty($name)) {
                return json(['msg' => '请选择要上传的文件'], 500);
            }
            $ext = $this->extend($name);
            /** @var string $type */
            if ($ext == 'xls') {
                $type = 'Excel5';
            } elseif ($ext == 'xlsx') {
                $type = 'Excel2007';
            }

            if (!in_array($ext, $extArr)) {
                return json(['msg' => '文件格式错误'], 500);
            }
            if ($size > (1000 * 4096)) {
                return json(['msg' => '文件大小不能超过4M!请联系管理员'], 500);
            }

            $tmp = $_FILES['photoimg']['tmp_name'];
            if (move_uploaded_file($tmp, $path . $name)) {
                if (TestHyaoGrowup::getExcel($path . $name, $type)) {
                    $this->success('上传成功');
                }
            } else {
                $this->error('上传文件失败.....failing');
            }

            exit;
        } else {
            $this->error('请上传文件');

        }
    }

    /** 获取文件类型后缀
     * @param $file_name string 文件名称
     * @return mixed|string 后缀名
     */
    public function extend($file_name)
    {
        $extend = pathinfo($file_name);
        $extend = strtolower($extend["extension"]);
        return $extend;
    }

}