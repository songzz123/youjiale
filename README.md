AI数据平台Backend数据分析项目
===============

##目前项目线上地址格式为：
        aicp.jkbk.cn/yjl/yjl
        aicp.jkbk.cn/hayao/hayao
    
##目前项目线上测试地址（test project防止数据污染，PM测试备用）格式为：
        aicp.jkbk.cn/yjl/testyjl
        aicp.jkbk.cn/hayao/testhayao

### ***主要目的***
#### **主要进行百度AICP每自然月返回的用户数据以及自平台的数据统计进行整理，进行项目管理的优化**
#### ***具体用到的数据Excel | mysql表***
##### Aicp后台的数据上传部分 /Application/admin/controller/Dialoguelist.php

        节点效果 ----------------- 节电效果.xlsx
        原始数据 ----------------- 原始数据.xlsx
        流量效果 ----------------- 流量效果.xlsx
        测试题答题记录------------- 79 服务器 jxchat.abap_answers表
        Kupperman测试结果 -------- 79 服务器 jxchat.abap_kupperman表
        
##### 目前围绕这五个操作 进行分析



```
     /Application/project_name/*
         controller
         model
         view
```
    
```
     后台静态资源
         AdminJs /public/assets/js/backend/对应控制器名称的js
         AdminCss /public/assets/css/(可以设置backend|frontend Css Dictory)
         AdminFronts /public/assets/fronts/(可以设置backend| Css Dictory)
```

```
     前台静态资源
         FrontendJs /public/assets/js/backend/对应控制器名称的js
         FrontendCss /public/assets/css/(可以设置Frontend Css Dictory)
         FrontendFronts /public/assets/fronts/(可以设置Frontend| Css Dictory)
```

```
    后期在加
```
