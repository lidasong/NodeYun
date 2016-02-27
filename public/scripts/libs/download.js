/**
 * Javascript 多文件下载
 * @author Barret Lee
 * @email  barret.china@gmail.com
 */
define(function() {
    var Downer = (function(files) {
        /**
         * 在支持 download 属性的情况下使用该方法进行单个文件下载
         * 目前 FF 还不支持 download 属性，所以 FF 必须另觅他法！
         * @param  {String} fileName
         * @param  {String|FileObject} contentOrPath
         * @return {Null}
         */
        function downloadFile(fileName, contentOrPath) {
            var aLink = document.createElement("a"),
                evt = document.createEvent("HTMLEvents"),
                isData = contentOrPath.slice(0, 5) === "data:",
                isPath = contentOrPath.lastIndexOf(".") > -1;
            // 初始化点击事件
            // 注：initEvent 不加后两个参数在FF下会报错
            evt.initEvent("click", false, false);

            // 添加文件下载名
            aLink.download = fileName;

            // 如果是 path 或者 dataURL 直接赋值
            // 如果是 file 或者其他内容，使用 Blob 转换
            aLink.href = isPath || isData ? contentOrPath : URL.createObjectURL(new Blob([contentOrPath]));

            aLink.dispatchEvent(evt);
        }

        function fireFoxDownload(fileName, contentOrPath) {
            var alink = document.createElement('a');
            alink.href = contentOrPath + '?attname=' + fileName;
            alink.className = 'link';
            document.body.appendChild(alink);
            alink.click();
            alink.remove();
        }

        /**
         * [IEdownloadFile description]
         * @param  {String} fileName
         * @param  {String|FileObject} contentOrPath
         */
        function IEdownloadFile(fileName, contentOrPath, bool) {
            var isImg = contentOrPath.slice(0, 10) === "data:image",
                ifr = document.createElement('iframe');
            ifr.style.display = 'none';
            ifr.src = contentOrPath;
            document.body.appendChild(ifr);

            // dataURL 的情况
            isImg && ifr.contentWindow.document.write("<img src='" +
                contentOrPath + "' />");

            // 保存页面 -> 保存文件
            // alert(ifr.contentWindow.document.body.innerHTML)
            if (bool) {
                ifr.contentWindow.document.execCommand('SaveAs', false, fileName);
                document.body.removeChild(ifr);
            } else {
                setTimeout(function() {
                    ifr.contentWindow.document.execCommand('SaveAs', false, fileName);
                    document.body.removeChild(ifr);
                }, 0);
            }
        }

        /**
         * [parseURL description]
         * @param  {String} str [description]
         * @return {String}     [description]
         */
        function parseURL(str) {
            return str.lastIndexOf("/") > -1 ? str.slice(str.lastIndexOf("/") + 1) : str;
        }

        return function(files) {
            var ua = navigator.userAgent.toLowerCase(),
                IEDown = /trident|msie/.test(ua),
                FFDown = /firefox\/([\d.]+)/.test(ua),
                downer = IEDown ? IEdownloadFile : FFDown ? fireFoxDownload : downloadFile;
            // 判断类型，处理下载文件名
            if (files instanceof Array) {
                for (var i = 0, l = files.length; i < l; i++)
                // bug 处理
                    downer(files[i].name, files[i].url, true);
            } else if (typeof files === "string") {
                downer(parseURL(files), files);
            } else {
                // 对象
                for (var file in files) downer(file, files[file]);
            }
        }

    })();
    return Downer;
});
