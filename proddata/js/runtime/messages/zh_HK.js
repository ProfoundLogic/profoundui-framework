//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------
//  Chinese (Traditional) - Hong Kong
// ----------------------------------
var zh_HK = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "這會結束你的階段作業";
            dictMsg["no connection message"]        = "無法連接服務器，請檢查您的連接並重試";
            dictMsg["upload file limit"]            = "超出&1個檔案的限制";
            dictMsg["upload size limit"]            = "超出每個檔案&1MB的限制";
            dictMsg["upload no files"]              = "沒有選上檔案";
            dictMsg["upload duplicate file"]        = "重複選上相同檔案";
            dictMsg["upload file exists"]           = "系統上已存在一個或多個相同檔案";
            dictMsg["upload prevented"]             = "退出程序已阻止上傳操作";
            dictMsg["upload input limit"]           = "超出總上傳檔案的容量限制";
            dictMsg["upload no session"]            = "沒有連上有效階段作業";
            dictMsg["upload timeout"]               = "超出上傳可用時間";
            dictMsg["upload invalid response"]      = "服務器沒有回應或回應無效";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "上傳已取消";
            dictMsg["close browser text"]           = "請關閉瀏覽器已完成登出程序";
            dictMsg["session ended text"]           = "你的階段作業已結束";
            dictMsg["outside ucs2"]                 = '字符已超出UCS-2範圍';
            dictMsg["invalid number"]               = '&1不是有效的號碼';
            dictMsg["invalid length"]               = '&1的數據長度或小數位數不正確';
            dictMsg["invalid decimal"]              = '&1已超出小數位數。 (最大： &2)';
            dictMsg["invalid choice"]               = '選擇" &1"無效,有效的選擇是：" &2" 或" &3"';
            dictMsg["invalid date"]                 = '"&1"不是有效日期格式.有效日期格式： &2';
            dictMsg["invalid time"]                 = '"&1"不是有效時間格式.有效時間格式： &2';
            dictMsg["invalid time stamp"]           = '"&1"不是有效的時間戳格式.有效時間戳格式： &2';
            dictMsg["invalid percent"]              = '&1 不是有效的小數';
            dictMsg["invalid digits"]               = '"&1" 包含太多數字.最大： &2';
            dictMsg["exceeds whole"]                = '"&1" 超過整數部分（ &2位）的最大位數';
            dictMsg["exceeds decimal"]              = '"&1" 超過了小數部分（ &2位）的最大位數';
            dictMsg["zip too long"]                 = '郵政編碼太長.（最大： &1 位數）';
            dictMsg["phone too long"]               = '電話號碼太長.（最大： &1 位數）';
            dictMsg["ssno too long"]                = '社會安全號碼太長.（最大： &1位數）';
            dictMsg["invalid custom val"]           = '自定驗證功能無效';
            dictMsg["error custom val"]             = '自定驗證功能有錯誤';
            dictMsg["ME"]                           = "必須輸入數據";
            dictMsg["MF"]                           = "您必須完成輸入框的數據輸入";
            dictMsg["required"]                     = "此欄位必須輸入";
            dictMsg["file required"]                = "您必須至少選擇一個檔案";
            dictMsg["signature overflow"]           = "簽名圖已超出了可儲存的最大容量,請清除簽名板並重試";
            dictMsg["validValues"]                  = "輸入的值無效，有效值為：";
            dictMsg["upload invalid type"]          = "一個或多個檔案的類型無效";
            dictMsg["invalid email"]                = "電子郵件地址無效";
            dictMsg["session timed out"]            = "您的階段作業已超時";
            dictMsg["invalid low range"]            = "值必須大於或等於 &1";
            dictMsg["invalid high range"]           = "值必須小於或等於 &1";
            dictMsg["invalid range"]                = "有效範圍是 &1到 &2";
            dictMsg["unmonitored exception"]        = "程式遇到了異常的問題，請聯絡系統管理員協助";
            dictMsg["loading x"]                    = "載入 &1...";
            dictMsg["data src not specfd x"]        = "數據源未指定給 &1…";
            dictMsg["name fld not specfd x"]        = "名稱欄位沒有指定給 &1…";
            dictMsg["val fld not specfd x"]         = "指定值欄位未指定給 &1…";
            dictMsg["failed to load x"]             = "未能載入 &1…";
            dictMsg["cannot rmv last col"]          = "你不能刪除最後一列";
            dictMsg["cannot find col"]              = "找不到特定的columnId";
            dictMsg["subfile deletion"]             = "你確定要刪除子檔案嗎？";
            dictMsg["downloading x"]                = "正在下載 &1";
            dictMsg["ie9 too low xlsxpics"]         = "不能在IE9或更低版本之下導出圖像";

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "已超出允許的階段作業總數";
            dictMsg["unable to load portal"]        = "不能載入入口設置或導航項目";
            dictMsg["unable to load macr act"]      = "不能載入巨集操作";
            dictMsg["unable to load macr var"]      = "不能載入巨集變數值";
            dictMsg["unable to load scrn lst"]      = "不能載入屏幕列表";
            dictMsg["unable to load new sett"]      = "不能載入新的設置";
            dictMsg["unable to load x"]             = "不能載入 &1";
            dictMsg["unable to add x"]              = "不能增加 &1";
            dictMsg["unable to rename x"]           = "不能重新命名 &1";
            dictMsg["unable to delete x"]           = "不能刪除 &1";
            dictMsg["unable to update x"]           = "不能更新 &1";
            dictMsg["unable to reassn x"]           = "不能重新分配 &1";
            dictMsg["unable to reorder items"]      = "不能重新排列項目";
            dictMsg["unable to save theme"]         = "不能儲存主題設置";
            dictMsg["unable eval script url"]       = "不能評估網絡應用程序URL";
            dictMsg["close browser text AT"]        = "未儲存的資料會在結束階段作業時而丟失";
            dictMsg["close all tabs"]               = "關閉所有標籤？";
            dictMsg["close tab"]                    = "你想關閉這個標籤嗎？";
            dictMsg["invalid script url"]           = "網絡應用程序URL的輸入值無效";
            dictMsg["unrecognized format"]          = "無法識別的格式";
            dictMsg["screen already defined"]       = "屏幕 \"&1\" 已被定義";
            dictMsg["macro already defined"]        = "巨集 \"&1\" 已被定義";
            dictMsg["no screen ids"]                = "沒有顯示屏幕標籤號碼";
            dictMsg["confirm delete"]               = "確認刪除";
            dictMsg["no actions"]                   = "沒有要顯示的動作";
            dictMsg["msg action input var"]         = "在行 &2列 &3的欄位中輸入變數\"&1\"的內值";
            dictMsg["msg action input user"]        = "在行 &1列 &2的欄位中輸入當前用戶帳號";
            dictMsg["msg action input js"]          = "在行 &2列 &3處輸入JavaScript表達式<strong>&1</strong>的結果";
            dictMsg["msg action input other"]       = "在行 &2列 &3的字段中輸入\"&1\"的內值";
            dictMsg["msg presskey var"]             = "請按下在變量\"&1\"已定義的鍵";
            dictMsg["msg presskey other"]           = "按下\"&1\"鍵";
            dictMsg["msg del scrn from macro"]      = "你確定要從這個巨集中刪除已選的屏幕？<br />所有相關的操作也將被刪除";
            dictMsg["choose scrn macro"]            = "選擇一個屏幕或巨集的屬性";
            dictMsg["choose a nav or toolbar"]      = "選擇導航或工具欄項目的屬性";
            dictMsg["confirm del sel x"]            = "你確定要刪除所選的 &1嗎？";
            dictMsg["permission settings"]          = "權限設置";
            dictMsg["adding x"]                     = "&1 增加中…";
            dictMsg["deleting x"]                   = "&1 刪除中…";
            dictMsg["reassigning x"]                = "&1 重新分配中…";
            dictMsg["loading"]                      = "正在載入中…";
            dictMsg["saving"]                       = "正在儲存中…";
            dictMsg["x added"]                      = "&1 已增加";
            dictMsg["x deleted"]                    = "&1 已刪除";
            dictMsg["x reassigned"]                 = "&1 已重新分配";
            dictMsg["x updated"]                    = "&1 已更新";
            dictMsg["x saved"]                      = "&1 已儲存";
            dictMsg["msg del group"]                = "你確定要刪除組別\"&1\"嗎？<br /><br />刪除組別也會刪除任何子組別和任何關聯的用戶。<br /><br />你確定要繼續嗎？";
            dictMsg["conf reassign users 1"]        = "你確定要重新分配嗎 ";
            dictMsg["conf reassign users 2a"]       = "用戶 \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "已選定的用戶 ";
            dictMsg["conf reassign users 3"]        = " 至組別 \"&1\"？";
            dictMsg["conf reassign group"]          = "你確定要將組別 \"&1\" 重新分配給組別 \"&2\" 嗎？";
            dictMsg["conf delete users 1"]          = "你確定要刪除嗎 ";
            dictMsg["conf delete users 2a"]         = "用戶 \"&1\"？";
            dictMsg["conf delete users 2b"]         = "已選定的用戶？";
            dictMsg["no users"]                     = "沒有用戶可以顯示";
            dictMsg["cannot delete own grp"]        = "你不能刪除自己的組別.";
            dictMsg["cannot delete own usr"]        = "您不能刪除自己的用戶帳號.";
            dictMsg["not auth reassign prf"]        = "您沒有允許可以重新分配帳號給自己.";
            dictMsg["typeselect macro name"]        = "輸入或選擇巨集名稱…";
            dictMsg["any child items will"]         = "所有子項目也將被刪除.";
            dictMsg["password must be"]             = "密碼必須至少為6個字符.";
            dictMsg["type or sel home page"]        = "輸入或選擇主頁…";
            dictMsg["x is already in list"]         = "\"&1\" 已經在列表中.";
            dictMsg["x is not valid libname"]       = "\"&1\" 不是有效的檔案庫名稱.";
            dictMsg["no libraries in list"]         = "沒有列出檔案庫";
            dictMsg["add libl entry"]               = "檔案庫列表添加內容";
            dictMsg["would you like add ano"]       = "你想添加另一個嗎？";
            dictMsg["already in suppl grp x"]       = "用戶已存在補充組別\"&1\".";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "選擇檔案";
            dictMsg["upload clear text"]            = "清除";
            dictMsg["upload remove text"]           = "刪除";
            dictMsg["upload upload text"]           = "上傳";
            dictMsg["upload drophere text"]         = "在此放下檔案";
            dictMsg["upload browser unsupported"]   = "拖/放檔案功能只適用在Internet Explorer 10或更高版本，Chrome或Firefox 瀏覽器上執行.";
            dictMsg["upload finished text"]         = "完成";
            dictMsg["excel export text"]            = "導出至Excel";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "導出至 &1";
            dictMsg["filter text"]                  = "篩選";
            dictMsg["find text"]                    = "尋找";
            dictMsg["reset data"]                   = "重置";
            dictMsg["remove filters text"]          = "移除所有篩選";
            dictMsg["displayed columns"]            = "顯示分欄";
            dictMsg["next link text"]               = "下一個";
            dictMsg["previous link text"]           = "上一個";
            dictMsg["sort ascending text"]          = "按由小而大順序";
            dictMsg["sort descending text"]         = "按由大而小順序";
            dictMsg["row"]                          = "一行";
            dictMsg["rows"]                         = "一排";
            dictMsg["page"]                         = "頁";
            dictMsg["collapseAll"]                  = "全部折回";
            dictMsg["expandAll"]                    = "全部展開";
            dictMsg["user"]                         = "用戶";
            dictMsg["password"]                     = "密碼";
            dictMsg["sign on"]                      = "登錄";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["pui"] + " " + dictMsg["sign on"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["pjs"] + " " + dictMsg["sign on"];
            dictMsg["message id"]                   = "訊息號碼";
            dictMsg["ctlr job"]                     = "控制器作業";
            dictMsg["app job"]                      = "應用程序作業";
            dictMsg["joblog download"]              = "下載工作日誌";
            dictMsg["curr user"]                    = "當前用戶";
            dictMsg["remote ip"]                    = "遠端IP地址";
            dictMsg["remote port"]                  = "遠端連接埠";
            dictMsg["severity"]                     = "嚴重性";
            dictMsg["date"]                         = "日期";
            dictMsg["time"]                         = "時間";
            dictMsg["program"]                      = "程式";
            dictMsg["procedure"]                    = "程序";
            dictMsg["lines"]                        = "線(S)";
            dictMsg["message"]                      = "訊息";
            dictMsg["new session"]                  = "新的階段作業";
            dictMsg["close"]                        = "關閉";
            dictMsg["current password"]             = "當前密碼";
            dictMsg["new password"]                 = "新密碼";
            dictMsg["repeat new password"]          = "重複新密碼";
            dictMsg["submit"]                       = "提交";
            dictMsg["exit"]                         = "退出";
            dictMsg["warning"]                      = "警告";
            dictMsg["change password"]              = "更改密碼";
            dictMsg["cancel"]                       = "取消";
            dictMsg["find text"]                    = "尋找";
            dictMsg["remove filter"]                = "移除篩選";
            dictMsg["chart"]                        = "圖表";
            dictMsg["section"]                      = "部份";
            dictMsg["version"]                      = "原版本";
            dictMsg["fixPack"]                      = "修復版";
            // Atrium only.
            dictMsg["yes"]                          = "是";
            dictMsg["no"]                           = "否";
            dictMsg["settings"]                     = "設置";
            dictMsg["favorites"]                    = "收藏夾";
            dictMsg["type query press en"]          = "鍵入查詢之後按下Enter鍵";
            dictMsg["add to favorites"]             = "添加到收藏夾";
            dictMsg["rmv from favorites"]           = "從收藏夾中移除";
            dictMsg["please wait"]                  = "請稍候…";
            dictMsg["control panel"]                = "控制面板";
            dictMsg["my settings"]                  = "我的設置";
            dictMsg["about atrium"]                 = "關於Atrium";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "版權 &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "警告：此計算機程序受版權法保護<br />"
                                                    + "和國際條約。未經授權的複製或<br />"
                                                    + "該程序任何部分的分發可能導致<br />"
                                                    + "嚴重的民事和刑事處罰，並可能根據專利法律規定被起訴<br />"
                                                    + "。<br /><br />"
                                                    + "。”美國專利號8,667,405 B2。";
            dictMsg["item"]                         = "項目";
            dictMsg["open selected item"]           = "打開已選的項目";
            dictMsg["of"]                           = "的";
            dictMsg["no results to dsp"]            = "沒有結果顯示";
            dictMsg["displaying results"]           = "結果顯示中";
            dictMsg["search results"]               = "搜索結果";
            dictMsg["new folder"]                   = "新建文件夾";
            dictMsg["rename"]                       = "重新命名";
            dictMsg["description"]                  = "說明";
            dictMsg["ok"]                           = "確定";
            dictMsg["add"]                          = "增加";
            dictMsg["add x"]                        = "增加 &1";
            dictMsg["delete"]                       = "刪除";
            dictMsg["screen"]                       = "屏幕";
            dictMsg["screens"]                      = "屏幕";
            dictMsg["macro"]                        = "巨集";
            dictMsg["macros"]                       = "巨集";
            dictMsg["screen id"]                    = "屏幕識別號碼";
            dictMsg["screen ids"]                   = "屏幕識別號碼";
            dictMsg["field row"]                    = "欄位行";
            dictMsg["field column"]                 = "欄位列";
            dictMsg["field value"]                  = "欄位值";
            dictMsg["value"]                        = "數值";
            dictMsg["action"]                       = "動作";
            dictMsg["actions"]                      = "動作";
            dictMsg["detect once"]                  = "檢測一次";
            dictMsg["delete screen"]                = "刪除屏幕";
            dictMsg["genie macros"]                 = "Genie 巨集";
            dictMsg["screen name"]                  = "屏幕名稱";
            dictMsg["identifier"]                   = "識別";
            dictMsg["identifiers"]                  = "識別";
            dictMsg["macro name"]                   = "巨集名稱";
            dictMsg["close browser wintab"]         = "關閉瀏覽器或瀏覽器標籤";
            dictMsg["select"]                       = "選擇";
            dictMsg["write value in field"]         = "在欄位中寫入數據值";
            dictMsg["press a key"]                  = "按一個鍵";
            dictMsg["a literal value"]              = "一個文字值";
            dictMsg["a variable value"]             = "一個可變數值";
            dictMsg["cur user profile"]             = "當前用戶";
            dictMsg["result js expr"]               = "JavaScript表示的結果";
            dictMsg["action data"]                  = "執行數據";
            dictMsg["data type"]                    = "數據類型";
            dictMsg["users"]                        = "用戶";
            dictMsg["all groups"]                   = "全部組別";
            dictMsg["supplemental groups"]          = "補充組別";
            dictMsg["users w primary grp"]          = "用戶的主要組別是\"&1\"";
            dictMsg["users w suppl grp"]            = "補充組別的用戶是為\"&1\"";
            dictMsg["group"]                        = "組別";
            dictMsg["groups"]                       = "組別";
            dictMsg["edit"]                         = "編輯";
            dictMsg["edit x"]                       = "編輯 &1";
            dictMsg["manager"]                      = "經理";
            dictMsg["administrator"]                = "管理員";
            dictMsg["primary group"]                = "主要組別";
            dictMsg["delete x"]                     = "刪除 &1";
            dictMsg["reassign x"]                   = "重新分配 &1";
            dictMsg["navigation item"]              = "導航項目";
            dictMsg["navigation items"]             = "導航項目";
            dictMsg["navigation panel"]             = "導航面板";
            dictMsg["home pages"]                   = "主頁";
            dictMsg["menu group"]                   = "菜單組別";
            dictMsg["menu item"]                    = "菜單項目";
            dictMsg["toolbar items"]                = "工具欄項目";
            dictMsg["toolbar"]                      = "工具欄";
            dictMsg["button"]                       = "按鈕";
            dictMsg["pulldown menu"]                = "下拉菜單";
            dictMsg["pulldown menu item"]           = "下拉菜單項目";
            dictMsg["separator bar"]                = "分隔欄";
            dictMsg["spacer"]                       = "分隔物";
            dictMsg["item details"]                 = "貨品明細";
            dictMsg["item number"]                  = "貨品號碼";
            dictMsg["item type"]                    = "貨品類型";
            dictMsg["genie macro"]                  = "Genie 巨集";
            dictMsg["rdf application"]              = "Rich Display 檔案應用";
            dictMsg["web application"]              = "網頁應用程式";
            dictMsg["pc command"]                   = "PC命令";
            dictMsg["dspf program library"]         = "顯示檔案的程式庫";
            dictMsg["dspf program"]                 = "顯示檔案程式";
            dictMsg["variable name x"]              = "變數名稱 &1";
            dictMsg["a tab in the portal"]          = "入口的標籤";
            dictMsg["a new browser wind"]           = "新的瀏覽器視窗或標籤";
            dictMsg["update"]                       = "更新";
            dictMsg["fill"]                         = "填入";
            dictMsg["permissions"]                  = "權限";
            dictMsg["user/group name"]              = "用戶/組別名稱";
            dictMsg["all users groups"]             = "所有用戶和組別";
            dictMsg["type"]                         = "類型";
            dictMsg["access"]                       = "進入";
            dictMsg["allow"]                        = "允許";
            dictMsg["disallow"]                     = "禁止";
            dictMsg["navigation"]                   = "導航";
            dictMsg["add usrgrp perm"]              = "添加用戶/組別的權限";
            dictMsg["membership"]                   = "會員";
            dictMsg["none"]                         = "沒有";
            dictMsg["remove"]                       = "移除";
            dictMsg["appearance"]                   = "外觀";
            dictMsg["home page"]                    = "主頁";
            dictMsg["tree"]                         = "樹";
            dictMsg["accordion"]                    = "折叠的";
            dictMsg["min search chars"]             = "最小搜索字符";
            dictMsg["libl for rdf apps"]            = "RICH Display 檔案所需要的檔案庫列表";
            dictMsg["library list"]                 = "檔案庫列表";
            dictMsg["library"]                      = "檔案庫";
            dictMsg["use atrium def libl"]          = "使用Atrium默認檔案庫";
            dictMsg["use jobd libl"]                = "使用來自JOBD的檔案庫";
            dictMsg["specify libl"]                 = "指定的檔案庫列表";
            dictMsg["up"]                           = "向上";
            dictMsg["down"]                         = "向下";
            dictMsg["move up"]                      = "移上";
            dictMsg["move down"]                    = "移下";
            dictMsg["global settings"]              = "綜合的設置";
            dictMsg["save"]                         = "儲存";
            dictMsg["add usr to supp grp"]          = "添加用戶到補充組別";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "成員";
            dictMsg["member of hlp"]                = "該用戶所屬的組別";
            dictMsg["group name"]                   = "組別名稱";
            dictMsg["group name hlp"]               = "該組別的顯示名稱";
            dictMsg["inherit settings"]             = "繼承設置";
            dictMsg["inherit settings hlp"]         = "當此選項成立，該用戶/組別將繼承其上一層設置。當此選項不成立，用戶/組別將擁有自己的設置數據";
            dictMsg["user name"]                    = "用戶名稱";
            dictMsg["user name hlp"]                = "此用戶的顯示名稱";
            dictMsg["access role"]                  = "訪問的身份";
            dictMsg["access role hlp"]              = "控制此用戶的訪問角色，管理員能夠管理所有組別和用戶，也可以控制應用程序權限，管理員能夠在自己的組別中配置用戶和組別設置，然而用戶是沒有此特權的.";
            dictMsg["can edit profile"]             = "能夠編輯用戶帳號";
            dictMsg["can edit profile hlp"]         = "允許用戶編輯\"外觀\"和\"導航\"的設置，並可更改密碼，但用戶不可編輯其他設置";
            dictMsg["user profile"]                 = "用戶帳號";
            dictMsg["user profile hlp"]             = "用戶名稱。用戶名稱有區分大小寫，除非使用IBM i帳號.。";
            dictMsg["password hlp"]                 = "設置/重置密碼。密碼有區分大小寫";
            dictMsg["conf password"]                = "確認密碼";
            dictMsg["conf password hlp"]            = "當設置/重置密碼時，確定密碼必須與新密碼完全相同，密碼有區分大小寫";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "瀏覽器標題";
            dictMsg["browser title hlp"]            = "設置將會在瀏覽器顯示的文字";
            dictMsg["show banner"]                  = "顯示標語";
            dictMsg["show banner hlp"]              = "如果你不希望在入口網站頂部顯示標語，請不要選此選項";
            dictMsg["banner height"]                = "標語高度";
            dictMsg["banner height hlp"]            = "以像素為單位設置入口網站頂部標語的高度,如果您選擇不顯示標語,則不用理會此設置.有效值為0-600像素";
            dictMsg["banner url"]                   = "標語網址";
            dictMsg["banner url hlp"]               = "設置標語內容所在的網址，可以是絕對或完全有效的網址";
            dictMsg["theme"]                        = "主題";
            dictMsg["theme hlp"]                    = "設置默認主題，如果\"<strong>允許用戶選擇主題\"</strong>已啟用，則個人用戶可以更改主題。";
            dictMsg["allow sel theme"]              = "允許用戶選擇主題";
            dictMsg["allow sel theme hlp"]          = "如果選此項目，用戶將能夠使用工具欄中的控制選項來選擇所需的主題。";
            dictMsg["show menu search"]             = "顯示菜單搜索";
            dictMsg["show menu search hlp"]         = "不選顯示菜單搜索選項,以使菜單中的搜索功能無效.";
            dictMsg["show fav sys"]                 = "顯示收藏夾系統";
            dictMsg["show fav sys hlp"]             = "取消彧禁用收藏夾系統";
            dictMsg["show fav start"]               = "在啟動時顯示收藏夾";
            dictMsg["show fav start hlp"]           = "如果選此項目，收藏夾面板會在啟動時顯示，否則會顯示導航面板（默認）。此選項僅在已啟用收藏夾系統時可用";
            dictMsg["limit num sessn"]              = "限制階段作數數量";
            dictMsg["limit num sessn hlp"]          = "此用戶/組別已給允許使用這個數量的Atrium階段作業，如數值為零表示允許無限制的階段作業，該限制適用於每個Web瀏覽器";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "在啟動時顯示主頁";
            dictMsg["show hmpg start hlp"]          = "如果選此項目，將在啟動時在入口網站執行自定義的主頁。";
            dictMsg["home page url"]                = "主頁網址";
            dictMsg["home page url hlp"]            = "設置主頁內容所在的網址，可以是絕對或完全有效的網址";
            dictMsg["navi pnl title"]               = "導航面板標題";
            dictMsg["navi pnl title hlp"]           = "設置將在導航面板標題欄中顯示的文字";
            dictMsg["navi pnl width"]               = "導航面板開始寬度";
            dictMsg["navi pnl width hlp"]           = "以像素為單位設置導航面板的起始寬度，用戶可根據需要調整面板大小或隱藏面板，有效值為0-2000像素";
            dictMsg["navi type"]                    = "導航類型";
            dictMsg["navi type hlp"]                = "控制導航面板中使用的菜單類型 \"樹\"或\"可折叠的\"。此設置不適用於工具欄";
            dictMsg["single click nav"]             = "單擊導航";
            dictMsg["single click nav hlp"]         = "如果選此項目，導航面板中的菜單項目將可單擊啟動，否則只會雙擊啟動，此設置不適用於工具欄";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "當前檔案庫";
            dictMsg["current library hlp"]          = "指定當前檔案庫，*USRPRF或*CRTDFT";
            dictMsg["job descr"]                    = "作業描述檔";
            dictMsg["job descr hlp"]                = "指定作業描述檔以設置檔案庫列表。*如果Atrium用戶是IBM i用戶，則可以指定用戶帳號";
            dictMsg["job descr lib"]                = "作業描述檔的檔案庫";
            dictMsg["job descr lib hlp"]            = "指定作業描述檔的檔案庫。*可以指定LIBL或*CURLIB。";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "項目名稱";
            dictMsg["item name hlp"]                = "設置導航或工具欄項目的顯示名稱";
            dictMsg["action type"]                  = "運作類型";
            dictMsg["action type hlp"]              = "設置此項目啟動時應用程序的類型";
            dictMsg["url"]                          = "網址";
            dictMsg["url hlp"]                      = "設置Web應用程序的網址，可以指定為絕對路徑或完全有效的網址，可以在網址中指定查詢字符的參數";
            dictMsg["genie url"]                    = "Genie 網址";
            dictMsg["genie url hlp"]                = "設置用於啟動Genie的網址，如果未指定，將使用默認的Genie 網址 /profoundui/auth/genie 。如果能提供備用Genie 網址或查詢字符的參數那就很有用了，例如：/profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "打開為";
            dictMsg["open as hlp"]                  = "設置是否在入口網站中以新的選項卡去啟動這個項目，或者作為新的瀏覽器視窗或選項卡。瀏覽器是否使用新視窗或選項卡取決於用戶的瀏覽器設置。";
            dictMsg["opens once only"]              = "僅打開一次";
            dictMsg["opens once only hlp"]          = "在默認情況下，如果用戶在入口網站中已經打開一個選項卡同事啟動此項目，那麼會打開另一個選項卡。由於對選項卡數量沒有限制,所以用戶可以用這種方式打開，當打開這個選項時，用戶將無法打開多個選項卡，如果用戶選擇該選項卡時已經打開了另一個選項卡，現有的選項卡將會在新的瀏覽器視窗或標籤中打開該項目時，該選項將被忽略。";
            dictMsg["icon"]                         = "圖標";
            dictMsg["icon hlp"]                     = "可選擇的: 設置導航或工具欄項目使用的圖標檔案，圖標檔案可以是GIF，JPG或PNG格式，推薦使用清楚易懂的GIF，路徑應該為Atrium安裝目錄的絕對路徑，如果沒有指定圖標，Atrium將使用導航項目的默認圖標，除非在此指定，否則工具欄項目不會顯示任何圖標。";
            dictMsg["parameter"]                    = "參數";
            dictMsg["parameter hlp"]                = "可選擇的: 指定在啟動時將傳遞給Rich Display程式的參數";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};