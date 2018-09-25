<?php

    // 配置参数
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "";
    // 实例化
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8');
    // 检测是否连接成功
    if($conn->connect_error){
        die("连接失败：" . $conn->$connect_error);
    }
?>