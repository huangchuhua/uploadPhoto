/**
 * @description 使用fileReader和formData来上传图片,实现多图上传、图片展示、点击放大功能；
 * @argument{
 * 参数：
 * 1、imgBox---展示图片的div的id；
 * 2、input---input标签的id,监听选择图片的事件；
 * 3、uploading---上传按钮的id，用来监听上传事件；
 * 4、url---上传图片的服务器地址；
 * 5、callback---图片上传成功后的操作（回调）；
 * }
 */
function uploadImg(imgBox,input,uploading,url,callback){
    var file;
    var data = new FormData();
    var $uploadImgBox = $("#"+imgBox);
    /*读取图片*/
    $("#"+input).on("change", function () {
        //存储图片的数组
        var fileArr = [];
        //获取上传的图片
        file = this.files;
        console.log(file);
        //遍历file对象拿到所有上传图片
        for (var key in file) {
            fileArr.push(file[key]);
            data.append(file[key].name, file[key]);
        }
        console.log(fileArr);
        fileArr.forEach(function (value, index, arr) {
            //创建实例对象
            var fr = new FileReader();
            //用base64方式读取图片数据
            fr.readAsDataURL(value);
            fr.onload = function (e) {
                $uploadImgBox.append("<div class='uploadList' data-name='"+value.name+"'><p></p><img src='" + fr.result + "'></div>");
                /**删除图片 */
                $uploadImgBox.on("mouseenter","div",function(){
                    var $this=$(this);
                    var $del=$(this)[0].children[0];
                    var $key=$this[0].getAttribute("data-name");
                    console.log($key)
                    //已成功上传的去除鼠标事件
                    if($this[0].children[2]){
                        return;
                    }
                    $del.classList.add('deleteImg');
                    
                    $del.onclick=function(){
                        //删除预览图
                        $this.remove();
                        //删除队列中对应的文件(根据数据索引来删除）,有个bug:删除后不能再选择上传???
                        data.delete($key);
                    }
                });
                $uploadImgBox.on("mouseleave","div",function(){
                    var $del=$(this)[0].children[0];
                    $del.classList.remove('deleteImg');
                })
            }
        });

    });
    /*上传图片*/
    $("#"+uploading).on("click", function () {
        //data为空时上传无效
        var i=data.entries();
        var obj=i.next();
        console.log(obj,obj.value[0]);
        if(obj.done||obj.value[0]==='undefined'){
            return;
        }
        $.ajax({
            type: "post",
            data: data,
            url: url,
            processData: false,
            contentType: false,
            success: function (result) {
                var $list=$(".uploadList");
                for(var i=0;i<$list.length;i++){
                    if(!$list[i].children[2]){
                        console.log("toLoaded");
                        //添加上传成功标志
                        $(".uploadList").eq(i).append("<p class='imgLoaded'></p>");
                    }
                }
                
                //清除鼠标事件
                $uploadImgBox.off("mouseenter","div");
                // 清空data数据
                data=new FormData();
                console.log(result);
                callback();
            }
        })
    });
    /*点击图片放大*/
    $uploadImgBox.on("click", "img", function () {
        // console.log($(this));
        /*获取图片的宽高*/
        var w=$(this).width();
        var h=$(this).height();
        console.log(w,h);
        layer.open({
            type: 1,
            // skin: 'layui-layer-rim', //加上边框
            area: [w*5+"px",h*5+"px"], //宽高
            title: false,
            content: $(this)
        })
    })
}