<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/4/25
 * Time: 10:54
 */

namespace app\admin\model;


use think\Model;

class FlowData extends Model
{
    // 表名
    protected $name = 'ada_flow_data';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    // 更新时间字段
    protected $updateTime = 'updatetime';
}