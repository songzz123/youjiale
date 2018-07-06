<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/11
 * Time: 14:37
 */

namespace app\admin\model;


use think\Model;

class TestAnswer extends Model
{
    // 表名
    protected $name = 'ada_test_answer';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';


    /** 答题跳出 逻辑处理
     * @param $group_id integer 分组ID
     * @param $answer_num integer 题目索引 例：1 代表 潮热汗出 2 代表 感觉异常 ...... 13 代表 泌尿感染
     * @param $ctsid integer 代表 做到的第几题 3 代表做到第3题离开了页面 12 代表12题离开了页面
     * @param $sum_ctsid integer 代表 参加做题的总共多少人
     * @return \think\response\Json 反馈 1症状索引值 2以及跳出率
     */
    public static function getSwitch($group_id, $answer_num, $ctsid, $sum_ctsid)
    {
        switch ($group_id) {
            case 2: // 静心

                foreach ($answer_num as &$item) {
                    $item = self::getSwitchJx($item);
                }
                foreach ($ctsid as &$ct) {
//                    $ct = round($ct / $sum_ctsid, 3) * 100 . "%";
                    $ct = round($ct / $sum_ctsid, 3) * 100;
                }

                return json(['answer_num' => $answer_num, 'ct' => $ctsid]);

                break;
            // TODO 此后添加 其他项目的逻辑
        }
    }

    public static function getSwitchJx($con_type)
    {
        switch ($con_type) {
            case 1:
                $condition = '潮热汗出';
                break;
            case 2:
                $condition = '感觉异常';
                break;
            case 3:
                $condition = '失眠';
                break;
            case 4:
                $condition = '情绪波动';
                break;
            case 5:
                $condition = '抑郁疑心';
                break;
            case 6:
                $condition = '眩晕';
                break;
            case 7:
                $condition = '疲乏';
                break;
            case 8:
                $condition = '骨关节痛';
                break;
            case 9:
                $condition = '头痛';
                break;
            case 10:
                $condition = '心悸';
                break;
            case 11:
                $condition = '皮肤蚁走感';
                break;
            case 12:
                $condition = '性生活';
                break;
            case 13:
                $condition = '泌尿感染';
                break;
        }
        return $condition;
    }
}