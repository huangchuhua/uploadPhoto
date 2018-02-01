<?php
    header("content-type:text/html;charset=utf-8");
    var_dump($_FILES);
    // 上传图片
    move_uploaded_file($_FILES[0]["tmp_name"],"./images/".$_FILES[0]["name"]);
?>