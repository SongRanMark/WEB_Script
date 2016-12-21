// ==UserScript==
// @name         12306 Left Ticket Helper
// @version      0.1
// @description  12306 Left Ticket Helper
// @author       S.R
// @include      https://kyfw.12306.cn/otn/leftTicket/init*
// @require      file://Web_Script/12306/left_ticket_helper.js
// @resource     helperCSS file://Web_Script/12306/left_ticket_helper.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

// 添加样式表
var cssString = GM_getResourceText("helperCSS");
GM_addStyle(cssString);

// 记录列表中用户选择将要抢票的列车 ID。
var selectedTrainID = "";
// 标记当前工作状态，是否正在尝试预定，用于开始与停止的切换
var isBuying = false;
var operationButtonHTML = "<button type='button' id='helper-query-button'>自动预定</button>";
$("#sear-result").append(operationButtonHTML);
// 开始或停止根据用户选择的列车自动预定车票。
$("#helper-query-button").click(function() {
    isBuying = !isBuying;

    if (isBuying) {
        if (selectedTrainID == "") {
            isBuying = false;
            alert("请先查询车次列表，并在其他一栏中选择要自动预定的车次");

            return;
        }

        $(this).text("停止预定");
        tryToBuyTicket();
    } else {
        $(this).text("自动预定");
    }
});
// 在列车列表的其他项一栏增加单选按钮供用户选择要预定的列车。
$("#t-list").bind('DOMNodeInserted', function(e) {
    if ("queryLeftTable" != e.target.id) {
        return;
    }

    addRadioButonInTrainList();
});

function tryToBuyTicket() {
    if (isBuying) {
        checkTrainList(function(result, status, xhr) {
            for (var i = 0; i < result.data.length; i++) {
                var record = result.data[i];
                if (record.queryLeftNewDTO.train_no != selectedTrainID) {
                    continue;
                }

                if (record.queryLeftNewDTO.canWebBuy != "Y") {
                    break;
                }

                buyTrainTicket(record);
                return;
            };

            tryToBuyTicket();
        }, function(xhr, status, error) {
            tryToBuyTicket();
        });
    }
}

function checkTrainList(success, error) {
        var parameters = {
        "leftTicketDTO.train_date": $.trim($("#train_date").val()),
        "leftTicketDTO.from_station": $("#fromStation").val(),
        "leftTicketDTO.to_station": $("#toStation").val(),
        purpose_codes: $("#sf2").is(":checked") ? "0X00" : "ADULT"
    };
    $.ajax({
        type: "get",
        isTakeParam: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader("If-Modified-Since", "0");
            xhr.setRequestHeader("Cache-Control", "no-cache")
        },
        url: ctx + CLeftTicketUrl,
        data: parameters,
        timeout: 10000,
        success: success,
        error: error
    });
}

function buyTrainTicket(record) {
    checkG1234(record.secretStr, record.queryLeftNewDTO.start_time, record.queryLeftNewDTO.train_no, record.queryLeftNewDTO.from_station_telecode, record.queryLeftNewDTO.to_station_telecode);
}

function addRadioButonInTrainList() {
    var trainOtherItemList = $("#queryLeftTable").children("[id^='ticket_']").children("[id^='QT_']");
    trainOtherItemList.each(function(index, element) {
        var trainID = element.id.substr(3);
        var radioHTML = "<input type='radio' name='trainList' value='"+ trainID +"'/>";
        $(this).html(radioHTML);
        $(this).removeAttr("onclick");

        if (index == 0) {
            selectedTrainID = trainID;
            $(this).children().attr("checked", "checked");
        }
    });
    $("input[name='trainList']").change(function() {
        selectedTrainID = $(this).val();
    });
}