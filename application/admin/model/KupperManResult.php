<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/15
 * Time: 17:00
 */

namespace app\admin\model;


use think\Model;

class KupperManResult extends Model
{
    // 表名
    protected $name = 'ada_kupperman';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';

    /** 答题记录分析 处理逻辑
     * @param $goodData
     * @return array
     */
    public static function turnNumble($goodData, $group_id)
    {
        $crhc = array();
        $yc = array();
        $sm = array();
        $qxbd = array();
        $yyyc = array();
        $xy = array();
        $pf = array();
        $ggjt = array();
        $tt = array();
        $xj = array();
        $pfyzg = array();
        $sexlife = array();
        $mngr = array();

        foreach ($goodData as $g) {
            $va = json_decode($g['answer'], true);
            foreach ($va as $tpk => $answer) {
                switch ($tpk) {
                    case 0:
                        array_push($crhc, $answer);
                        break;
                    case 1:
                        array_push($yc, $answer);
                        break;
                    case 2:
                        array_push($sm, $answer);
                        break;
                    case 3:
                        array_push($qxbd, $answer);
                        break;
                    case 4:
                        array_push($yyyc, $answer);
                        break;
                    case 5:
                        array_push($xy, $answer);
                        break;
                    case 6:
                        array_push($pf, $answer);
                        break;
                    case 7:
                        array_push($ggjt, $answer);
                        break;
                    case 8:
                        array_push($tt, $answer);
                        break;
                    case 9:
                        array_push($xj, $answer);
                        break;
                    case 10:
                        array_push($pfyzg, $answer);
                        break;
                    case 11:
                        array_push($sexlife, $answer);
                        break;
                    case 12:
                        array_push($mngr, $answer);
                        break;
                }
            }
        }

        /** @var array $newArray */
        switch ($group_id) {
            case 2:
                /**
                 * 潮热汗出 效果 [152, 100, 56, 34]
                 */
                $newCrhc = array_count_values($crhc);
                ksort($newCrhc);
                $crhc = array_values($newCrhc);

                /**
                 * 感觉异常 效果 [152, 100, 56, 34]
                 */
                $newYc = array_count_values($yc);
                ksort($newYc);
                $yc = array_values($newYc);

                /**
                 * 失眠 效果 [152, 100, 56, 34]
                 */
                $newSm = array_count_values($sm);
                ksort($newSm);
                $sm = array_values($newSm);

                /**
                 * 情绪波动 效果 [152, 100, 56, 34]
                 */
                $newQxbd = array_count_values($qxbd);
                ksort($newQxbd);
                $qxbd = array_values($newQxbd);

                /**
                 * 抑郁疑心 效果 [152, 100, 56, 34]
                 */
                $newYYYc = array_count_values($yyyc);
                ksort($newYYYc);
                $yyyc = array_values($newYYYc);

                /**
                 * 眩晕 效果 [152, 100, 56, 34]
                 */
                $newXy = array_count_values($xy);
                ksort($newXy);
                $xy = array_values($newXy);

                /**
                 * 疲乏 效果 [152, 100, 56, 34]
                 */
                $newPf = array_count_values($pf);
                ksort($newPf);
                $pf = array_values($newPf);

                /**
                 * 骨关节痛 效果 [152, 100, 56, 34]
                 */
                $newGgjt = array_count_values($ggjt);
                ksort($newGgjt);
                $ggjt = array_values($newGgjt);

                /**
                 * 头疼 效果 [152, 100, 56, 34]
                 */
                $newTt = array_count_values($tt);
                ksort($newTt);
                $tt = array_values($newTt);

                /**
                 * 心悸 效果 [152, 100, 56, 34]
                 */
                $newXj = array_count_values($xj);
                ksort($newXj);
                $xj = array_values($newXj);

                /**
                 * 皮肤蚁走感 效果 [152, 100, 56, 34]
                 */
                $newPfyzg = array_count_values($pfyzg);
                ksort($newPfyzg);
                $pfyzg = array_values($newPfyzg);

                /**
                 * 性生活 效果 [152, 100, 56, 34]
                 */
                $newSexlife = array_count_values($sexlife);
                ksort($newSexlife);
                $sexlife = array_values($newSexlife);

                /**
                 * 泌尿感染 效果 [152, 100, 56, 34]
                 */
                $newMngr = array_count_values($mngr);
                ksort($newMngr);
                $mngr = array_values($newMngr);

                $value = [$crhc, $yc, $sm, $qxbd, $yyyc, $xy, $pf, $ggjt, $tt, $xj, $pfyzg, $sexlife, $mngr];
                /**
                 * 前台JS json data数据
                 */
                $one = [];
                $two = [];
                $three = [];
                $four = [];
                foreach ($value as $lv) {
                    foreach ($lv as $k => $v) {
                        switch ($k){
                            case 0:
                                array_push($one,$v);
                                break;
                            case 1:
                                array_push($two,$v);
                                break;
                            case 2:
                                array_push($three,$v);
                                break;
                            case 3:
                                array_push($four,$v);
                                break;
                        }
                    }
                }

                // Json 格式 {name: '重度', type: 'bar', itemStyle: {normal: {barBorderColor: '#87CEFA'}}, data: [6311.9, 1902]}
                $oneObject = ['name' => '正常','type' => 'bar','itemStyle' => ['normal' => ['barBorderColor' => '#87CEFA']],'data' => $one];
                $twoObject = ['name' => '轻度','type' => 'bar','itemStyle' => ['normal' => ['barBorderColor' => '#87CEFA']],'data' => $two];
                $threeObject = ['name' => '中度','type' => 'bar','itemStyle' => ['normal' => ['barBorderColor' => '#87CEFA']],'data' => $three];
                $fourObject = ['name' => '重度','type' => 'bar','itemStyle' => ['normal' => ['barBorderColor' => '#FF92BC']],'data' => $four];
                $barValue = [$oneObject,$twoObject,$threeObject,$fourObject];

                $newArray = [
                    'column' => ['潮热汗出', '感觉异常', '失眠', '情绪波动', '抑郁疑心', '眩晕', '疲乏', '骨关节痛', '头疼', '心悸', '皮肤蚁走感', '性生活', '泌尿感染'],
                    'value' => $value,
                    'group_id' => $group_id,
                    'barvalue' => $barValue
                ];
                break;
            case 3:
                $newArray = '未有数据';
                break;
            case 4:
                $newArray = '未有数据';
                break;
            case 5:
                $newArray = '未有数据';
                break;
            case 6:
                $newArray = '未有数据';
                break;
        }

        return $newArray;
    }

}