// ==UserScript==
// @name         12306 Confirm Passenger Helper
// @version      0.1
// @description  12306 Confirm Passenger Helper
// @author       S.R
// @include      https://kyfw.12306.cn/otn/confirmPassenger/initDc
// @require      file://Web_Script/12306/confirm_passenger_helper.js
// ==/UserScript==

// 监听常用联系人加载完成后，选择联系人并提交订单。
$("#normal_passenger_id").one('DOMNodeInserted', function(e) {
    /*
    在事件响应中，执行其他元素的点击操作没有反应，测试发现在 click 事件的响应中同样的代码会正常执行，猜测可能跟特殊事件
    DOMNodeInserted 有关。后测试发现通过 setTimeout 函数使代码在响应方法后执行，可正常工作。该问题待继续研究，暂时
    通过这种方式实现。
    */
    setTimeout(function() {
        $("[id^='normalPassenger_']").first().click();
        $("#submitOrder_id").click();
    }, 0);
});

// 添加空格键为提交订单的快捷键。
$(document).keydown(function(e) {
    if(e.keyCode == 32){
        $("#qr_submit_id").click();
    }
});