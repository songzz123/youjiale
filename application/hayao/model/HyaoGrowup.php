<?php
/**
 * Created by PhpStorm.
 * User: zhangkun
 * Date: 2018/5/23
 * Time: 10:22
 */

namespace app\hayao\model;


use think\Model;
use PHPExcel_IOFactory;

class HyaoGrowup extends Model
{
    // 表名
    protected $name = 'hyao_growup';


    /** 上传excel到数据库
     * @param $file_name string 文件路径
     * @param $type string 上传文件类型
     * @return int|string 返回值
     */
    public static function getExcel($file_name, $type)
    {
        $reader = PHPExcel_IOFactory::createReader($type); //设置以Excel5格式(Excel2007工作簿)
        $objPHPExcel = $reader->load($file_name, 'utf-8');//加载文件
        $sheet = $objPHPExcel->getSheet(0);//取得sheet(0)表
        $highestRow = $sheet->getHighestRow(); // 取得总行数
        $highestColumn = $sheet->getHighestColumn(); // 取得总列数
        try {
            for ($i = 2; $i <= $highestRow; $i++) {
                $age = $objPHPExcel->getActiveSheet()->getCell("A" . $i)->getValue();
                $bgoodwei_one = $objPHPExcel->getActiveSheet()->getCell("B" . $i)->getValue();
                $bgoodwei_two = $objPHPExcel->getActiveSheet()->getCell("C" . $i)->getValue();
                $boyfatwei = $objPHPExcel->getActiveSheet()->getCell("D" . $i)->getValue();
                $ggoodwei_one = $objPHPExcel->getActiveSheet()->getCell("E" . $i)->getValue();
                $ggoodwei_two = $objPHPExcel->getActiveSheet()->getCell("F" . $i)->getValue();
                $girlfatwei = $objPHPExcel->getActiveSheet()->getCell("G" . $i)->getValue();
                $boy_middle = $objPHPExcel->getActiveSheet()->getCell("H" . $i)->getValue();
                $girl_middle = $objPHPExcel->getActiveSheet()->getCell("I" . $i)->getValue();
                $boy_height = $objPHPExcel->getActiveSheet()->getCell("J" . $i)->getValue();
                $girl_height = $objPHPExcel->getActiveSheet()->getCell("K" . $i)->getValue();
                $data['age'] = $age;
                $data['bgoodwei_one'] = $bgoodwei_one;
                $data['bgoodwei_two'] = $bgoodwei_two;
                $data['boyfatwei'] = $boyfatwei;
                $data['ggoodwei_one'] = $ggoodwei_one;
                $data['ggoodwei_two'] = $ggoodwei_two;
                $data['girlfatwei'] = $girlfatwei;
                $data['boy_middle'] = $boy_middle;
                $data['girl_middle'] = $girl_middle;
                $data['boy_height'] = $boy_height;
                $data['girl_height'] = $girl_height;
                self::create($data);
            }
            return true;
        } catch (\Exception $e) {
            return $e->getMessage();
        }

    }
}