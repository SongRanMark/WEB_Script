// ==UserScript==
// @name         12306 Helper
// @version      0.1
// @description  Automatic operation
// @author       S.R
// @require      file:///Web_Script/12306/helper.js
// @resource     helperCSS file:///Web_Script/12306/helper.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

// 添加样式表
var cssString = GM_getResourceText("helperCSS");
GM_addStyle(cssString);

var operationButtonHTML = "<button type='button' id='helper-query-button'>查询</button>";
$("#t-list").prepend(operationButtonHTML);
$("#helper-query-button").click(function () {
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
            // var record = result.data[0];

            // if ("Y" == record.queryLeftNewDTO.canWebBuy) {
            //     checkG1234(record.secretStr, record.queryLeftNewDTO.start_time, record.queryLeftNewDTO.train_no, record.queryLeftNewDTO.from_station_telecode, record.queryLeftNewDTO.to_station_telecode);
            // } else {
            //     $("#helper-query-button").click();
            // }
        },
        error: function(xhr, status, error) {
            // $("#helper-query-button").click();
        }
    });
});