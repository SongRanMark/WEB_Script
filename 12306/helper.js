// ==UserScript==
// @name         12306 Helper
// @version      0.1
// @description  12306 Helper
// @author       S.R
// @include      https://kyfw.12306.cn/otn/leftTicket/init
// @require      file:///Web_Script/12306/helper.js
// @resource     helperCSS file:///Web_Script/12306/helper.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

// 添加样式表
var cssString = GM_getResourceText("helperCSS");
GM_addStyle(cssString);

// 记录列表中用户选择将要抢票的列车索引，在请求到的最新数据中通过该索引获取对应列车数据，检查是否可以下单。
var selectedTrainIndex = 0;
var operationButtonHTML = "<button type='button' id='helper-query-button'>自动预定</button>";
$("#t-list").prepend(operationButtonHTML);
$("#helper-query-button").click(function() {
    if (!isThereTrainList()) {
        alert("请先查询车次列表，并选择要自动预定的车次");
        return;
    };

    canSelectedTrainTicketBuy(selectedTrainIndex);
});

function isThereTrainList() {
    return $("#queryLeftTable").html() != "";
}

function canSelectedTrainTicketBuy(index) {
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
        success: function(result, status, xhr) {
            var record = result.data[index];

            if ("Y" == record.queryLeftNewDTO.canWebBuy) {
                buyTrainTicket(record);
            } else {
                canSelectedTrainTicketBuy(index);
            }
        },
        error: function(xhr, status, error) {
            canSelectedTrainTicketBuy(index);
        }
    });
}

function buyTrainTicket(record) {
    checkG1234(record.secretStr, record.queryLeftNewDTO.start_time, record.queryLeftNewDTO.train_no, record.queryLeftNewDTO.from_station_telecode, record.queryLeftNewDTO.to_station_telecode);
}

$("#t-list").bind('DOMNodeInserted', function(e) {
    if ("queryLeftTable" != e.target.id) {
        return;
    }

    var trainList = $("#queryLeftTable").children("[id^='ticket_']");
    var index = 0;
    trainList.each(function() {
        var radioHTML = "<input type='radio' name='trainList' ";
        radioHTML += index == 0 ? "checked = 'checked' " : "";
        radioHTML += "value='"+ index +"'/>";
        var otherItem = $(this).children("[id^='QT_']");
        otherItem.html(radioHTML);
        otherItem.removeAttr("onclick");
        index++;
    });
    $("input[name='trainList']").change(function() {
        selectedTrainIndex = Number($(this).val());
    });
});