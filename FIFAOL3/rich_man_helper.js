// ==UserScript==
// @name         FIFA online3 rich man helper
// @version      0.1
// @description  FIFA online3 rich man helper
// @author       S.R
// @include      http://eafifa.qq.com/cp/a20170106dfwzp/index.htm*
// @require      file://Web_Script/FIFAOL3/rich_man_helper.js
// @resource     helperCSS file://Web_Script/FIFAOL3/rich_man_helper.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

// 添加操作按钮的样式表
var cssString = GM_getResourceText("helperCSS");
GM_addStyle(cssString);

// 确保在页面只执行一次，避免重复加载
if (!window.hasOwnProperty('didInitialize')) {
    init();
    window.didInitialize = {};
};

function init () {
    // 添加操作按钮并注册点击事件回调方法
    var shouldGoOn = false;
    var operationButtonHTML = "<div id='dashboard'>";
    operationButtonHTML += "<input id='startButton' class='operationButton' type='button' value='开始'/>";
    operationButtonHTML += "<input id='stopButton' class='operationButton' type='button' value='停止'/>";
    operationButtonHTML += "</div>";
    $(".main_top").prepend(operationButtonHTML);
    $("#startButton").click(start);
    $("#stopButton").click(stop);
    disable($("#stopButton"));
}

function start() {
    shouldGoOn = true;
    setButtonInStartState();

    // 判断用户是否已登录
    if(didDisplay($("#unlogin"))) {
        setButtonInStopState();
        LoginManager.login();
        return;
    }

    throwDice();
}

function stop() {
    shouldGoOn = false;
}

function throwDice() {
    // 判断用户是否点击停止按钮
    if (!shouldGoOn) {
        setButtonInStopState();
        return;
    }

    // 判断是否还有剩余次数
    var leftTimes = parseInt($("#iLeftNum").text());

    if(leftTimes <= 0) {
        setButtonInStopState();
        alert("对不起，您该角色当前没有投掷次数了。");
        return;
    }

    // 执行 flash 文件中投掷骰子按钮点击后触发的全局函数
    gameOne();
    // 设置循环检查获取道具提示的弹框是否显示的 timer
    var timer = setInterval(checkPropPopUpDisplay, 1000);

    function checkPropPopUpDisplay(){
        // 判断动画是否完成(展示获得道具的弹框是否显示)
        if(didDisplay($("#pop1"))) {
            // 停止 timer
            clearInterval(timer);
            // 关闭弹框
            closeDialog();
            throwDice();
        }
    }
}

function setButtonInStartState() {
    disable($("#startButton"));
    enable($("#stopButton"));  
}

function setButtonInStopState() {
    enable($("#startButton"));
    disable($("#stopButton"));
}

function didDisplay(element) {
    return element.css("display") == "block";
}

function enable(element) {
    element.removeAttr("disabled");
}

function disable(element) {
    element.attr("disabled", true);
}