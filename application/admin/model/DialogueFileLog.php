<?php
/**
 * 企业营销
 *
 * Created by guoweibo.
 * Date: 2/11/18
 * Time: 3:04 PM
 */

namespace app\admin\model;


use think\Model;

class DialogueFileLog extends Model
{
    // 表名
    protected $name = 'ada_dialogue_file_log';
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';

}