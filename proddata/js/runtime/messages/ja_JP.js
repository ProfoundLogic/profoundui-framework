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
//  Japanese
// ----------------------------------
var ja_JP = function(dict) {

    var dictMsg = {};

    switch (dict) {

        case "runtimeMsg":
            dictMsg["closeMessage"]                 = "セッションを終了";
            dictMsg["no connection message"]        = "サーバーに到達できません。接続を確認し、もう一度お試しください。";
            dictMsg["upload file limit"]            = "&1ファイルの制限を超えました。";
            dictMsg["upload size limit"]            = "1ファイルあたり&1MBの制限を超えました。";
            dictMsg["upload no files"]              = "ファイルが選択されていません。";
            dictMsg["upload duplicate file"]        = "重複したファイルが選択されました。";
            dictMsg["upload file exists"]           = "1つ以上のファイルが既にシステム上に存在します。";
            dictMsg["upload prevented"]             = "EXITプログラムにより操作が中断されました。";
            dictMsg["upload input limit"]           = "合計入力サイズの制限を超えました。";
            dictMsg["upload no session"]            = "有効なセッションに接続されていません。";
            dictMsg["upload timeout"]               = "トランザクションがタイムアウトしました。";
            dictMsg["upload invalid response"]      = "サーバーの応答が無いか、無効です。";  //Also used in Atrium for Ajax error.
            dictMsg["upload cancelled"]             = "アップロードが中断されました。";
            dictMsg["close browser text"]           = "ログオフプロセスを完了するには、ブラウザウィンドウを閉じてください。";
            dictMsg["session ended text"]           = "セッションが終了しました。";
            dictMsg["outside ucs2"]                 = '文字はUCS-2の範囲外です。';
            dictMsg["invalid number"]               = '&1は有効な番号ではありません。';
            dictMsg["invalid length"]               = '&1のデータ長または小数点位置が正しくありません。';
            dictMsg["invalid decimal"]              = '&1は小数点以下桁数が多すぎます。(最大:&2)';
            dictMsg["invalid choice"]               = '"&1"は無効です。有効な選択肢は"&2"か"&3"です。';
            dictMsg["invalid date"]                 = '"&1"は無効な日付です。フォーマット例 : &2';
            dictMsg["invalid time"]                 = '"&1"は無効な時刻です。フォーマット例 : &2';
            dictMsg["invalid time stamp"]           = '"&1"は無効なタイムスタンプです。フォーマット例 : &2';
            dictMsg["invalid percent"]              = '&1は有効な小数ではありません。';
            dictMsg["invalid digits"]               = '"&1"には数字が多すぎます。最大 : &2';
            dictMsg["exceeds whole"]                = '"&1"は整数部分の最大桁数(&2桁)を超えています。';
            dictMsg["exceeds decimal"]              = '"&1"は小数点部分の上限(&2桁)を超えています。';
            dictMsg["zip too long"]                 = '郵便番号が長すぎます。(最大:&2桁)';
            dictMsg["phone too long"]               = '電話番号が長すぎます。(最大:&2桁)';
            dictMsg["ssno too long"]                = '社会保障番号が長すぎます。(最大:&1桁)';
            dictMsg["invalid custom val"]           = 'カスタム検証機能が無効です。';
            dictMsg["error custom val"]             = 'カスタム検証機能でエラーが発生しました。';
            dictMsg["ME"]                           = "入力必須項目です。データを入力してください。";
            dictMsg["MF"]                           = "選択必須項目です。ボックスに値を入力してください。";
            dictMsg["required"]                     = "空白を入力できません。入力必須項目です。";
            dictMsg["file required"]                = "少なくとも一つのファイルを選択してください。";
            dictMsg["signature overflow"]           = "署名の描画サイズが格納できるサイズを超えています。署名欄をクリアしてもう一度お試しください。";
            dictMsg["validValues"]                  = "入力された値は無効です。有効な値は次の通りです : ";
            dictMsg["upload invalid type"]          = "1つ以上のファイルが無効なタイプです。";
            dictMsg["invalid email"]                = "無効なメールアドレスです。";
            dictMsg["session timed out"]            = "セッションがタイムアウトしました。";
            dictMsg["invalid low range"]            = "値は&1以上でなければいけません。";
            dictMsg["invalid high range"]           = "値は&1以下でなければいけません。";
            dictMsg["invalid range"]                = "有効な範囲は&1から&2です。";
            dictMsg["unmonitored exception"]        = "プログラムで監視されていない例外が発生しました。システム管理者に問い合わせてください。";
            dictMsg["loading x"]                    = "Loading &1...";
            dictMsg["data src not specfd x"]        = "&1のデータソースが指定されていません...";
            dictMsg["name fld not specfd x"]        = "&1の名前フィールドが指定されていません...";
            dictMsg["val fld not specfd x"]         = "&1の値フィールドが指定されていません...";
            dictMsg["failed to load x"]             = "&1のロードに失敗しました。";
            dictMsg["cannot rmv last col"]          = "最後の列は削除できません。";
            dictMsg["cannot find col"]              = "指定されたカラムIDを見つけることができません。";
            dictMsg["subfile deletion"]             = "サブファイルを削除しても良いですか？";
            dictMsg["downloading x"]                = "Downloading &1";
            dictMsg["ie9 too low xlsxpics"]         = "IE9以下では画像を書き出すことはできません。";

            // Atrium only.
            dictMsg["num sessions exceeded"]        = "許可されたセッションの上限を超えました。";
            dictMsg["unable to load portal"]        = "ポータル設定、またはナビゲーション項目を読み込めません。";
            dictMsg["unable to load macr act"]      = "マクロアクションを読み込めません。";
            dictMsg["unable to load macr var"]      = "マクロ変数を読み込めません。";
            dictMsg["unable to load scrn lst"]      = "画面リストを読み込めません。";
            dictMsg["unable to load new sett"]      = "新しい設定を読み込めません。";
            dictMsg["unable to load x"]             = "&1を読み込めません。";
            dictMsg["unable to add x"]              = "&1を追加できません。";
            dictMsg["unable to rename x"]           = "&1をリネームできません。";
            dictMsg["unable to delete x"]           = "&1を削除できません。";
            dictMsg["unable to update x"]           = "&1を更新できません。";
            dictMsg["unable to reassn x"]           = "&1を再割り当てできません。";
            dictMsg["unable to reorder items"]      = "アイテムを並び替えることができません。";
            dictMsg["unable to save theme"]         = "テーマ設定を保存できません。";
            dictMsg["unable eval script url"]       = "スクリプト化されたWebアプリのURLを評価できません。";
            dictMsg["close browser text AT"]        = "セッションに保存されていない変更は失われます。";
            dictMsg["close all tabs"]               = "全てのタブを閉じますか？";
            dictMsg["close tab"]                    = "このタブを閉じますか？";
            dictMsg["invalid script url"]           = "スクリプト化されたWebアプリのURLの値が無効です。";
            dictMsg["unrecognized format"]          = "認識できない形式です。";
            dictMsg["screen already defined"]       = "画面 \"&1\" は既に定義されています。";
            dictMsg["macro already defined"]        = "マクロ \"&1\" は既に定義されています。";
            dictMsg["no screen ids"]                = "表示する画面識別子はありません。";
            dictMsg["confirm delete"]               = "削除の確認";
            dictMsg["no actions"]                   = "表示するアクションはありません。";
            dictMsg["msg action input var"]         = "行&2列&3のフィールドに変数 \"&1\" の値を入力します。";
            dictMsg["msg action input user"]        = "行&1列&2のフィールドに現在のユーザープロファイルを入力します。";
            dictMsg["msg action input js"]          = "行&2列&3のフィールドにJavaScript式<strong>&1</strong>の結果を入力します。";
            dictMsg["msg action input other"]       = "行&2列&3のフィールドに値 \"&1\" を入力します。";
            dictMsg["msg presskey var"]             = "変数 \"&1\" で定義されているキーを押します。";
            dictMsg["msg presskey other"]           = "\"&1\" キーを押します。";
            dictMsg["msg del scrn from macro"]      = "このマクロから選択した画面を削除しても良いですか？<br /> 関連する全てのアクションも削除されます。";
            dictMsg["choose scrn macro"]            = "そのプロパティを操作する画面またはマクロを選択します。";
            dictMsg["choose a nav or toolbar"]      = "そのプロパティを操作するナビゲーションまたはツールバー項目を選択します。";
            dictMsg["confirm del sel x"]            = "選択した&1を削除しても良いですか？";
            dictMsg["permission settings"]          = "許可設定";
            dictMsg["adding x"]                     = "&1を追加中...";
            dictMsg["deleting x"]                   = "&1を削除中 ...";
            dictMsg["reassigning x"]                = "&1を再割り当て中...";
            dictMsg["loading"]                      = "読み込み中...";
            dictMsg["saving"]                       = "保管中...";
            dictMsg["x added"]                      = "&1を追加しました。";
            dictMsg["x deleted"]                    = "&1を削除しました。";
            dictMsg["x reassigned"]                 = "&1を再割り当てしました。";
            dictMsg["x updated"]                    = "&1を更新しました。";
            dictMsg["x saved"]                      = "&1を保管しました。";
            dictMsg["msg del group"]                = "グループ \"&1\"を削除しても良いですか？?<br /><br />グループを削除すると、サブグループや関連するユーザーも削除されます。<br /><br />続行しても良いですか？";
            dictMsg["conf reassign users 1"]        = "再割り当てしても良いですか。";
            dictMsg["conf reassign users 2a"]       = "ユーザー \"&1\" ";
            dictMsg["conf reassign users 2b"]       = "選択されたユーザー ";
            dictMsg["conf reassign users 3"]        = "\"&1\"をグループ化する？";
            dictMsg["conf reassign group"]          = "グループ\"&1\"をグループ\"&2\"に再割り当てしても良いですか？";
            dictMsg["conf delete users 1"]          = "削除しても良いですか。";
            dictMsg["conf delete users 2a"]         = "ユーザー \"&1\"？";
            dictMsg["conf delete users 2b"]         = "選択されたユーザーですか・";
            dictMsg["no users"]                     = "表示するユーザーはありません。";
            dictMsg["cannot delete own grp"]        = "自身のグループを削除できません。";
            dictMsg["cannot delete own usr"]        = "自身のユーザープロファイルを削除できません。";
            dictMsg["not auth reassign prf"]        = "自身のプロファイルを再割り当てする権限はありません。";
            dictMsg["typeselect macro name"]        = "マクロ名を入力または選択...";
            dictMsg["any child items will"]         = "全ての子アイテムも削除されます。";
            dictMsg["password must be"]             = "パスワードは6文字以上でなければなりません。";
            dictMsg["type or sel home page"]        = "ホームページを入力または選択...";
            dictMsg["x is already in list"]         = "\"&1\" は既にリストに存在します。";
            dictMsg["x is not valid libname"]       = "\"&1\" はライブラリ名として正しくありません。";
            dictMsg["no libraries in list"]         = "リストにライブラリがありません。";
            dictMsg["add libl entry"]               = "ライブラリリストエントリーに追加";
            dictMsg["would you like add ano"]       = "別のものを追加しますか？";
            dictMsg["already in suppl grp x"]       = "ユーザーは既に補足グループ \"&1\"にあります。";

            break;

        case "runtimeText":
            dictMsg["upload select text"]           = "ファイルを選択";
            dictMsg["upload clear text"]            = "クリア";
            dictMsg["upload remove text"]           = "移動";
            dictMsg["upload upload text"]           = "アップロード";
            dictMsg["upload drophere text"]         = "ここにファイルをドロップ";
            dictMsg["upload browser unsupported"]   = "ドラッグ/ドロップｗするにはInternet Explorer 10以降、Chrome、Firefoxが必要です。";
            dictMsg["upload finished text"]         = "終了しました";
            dictMsg["excel export text"]            = "Excelへエクスポート";    //Replaces "csv export text".
            dictMsg["export to x"]                  = "&1へエクスポート";
            dictMsg["filter text"]                  = "フィルター";
            dictMsg["find text"]                    = "検索";
            dictMsg["reset data"]                   = "リセット";
            dictMsg["remove filters text"]          = "全てのフィルターの除去";
            dictMsg["displayed columns"]            = "Displayed Columns";
            dictMsg["next link text"]               = "次へ";
            dictMsg["previous link text"]           = "前へ";
            dictMsg["sort ascending text"]          = "昇順に並び替え";
            dictMsg["sort descending text"]         = "降順に並び替え";
            dictMsg["row"]                          = "行";
            dictMsg["rows"]                         = "行";
            dictMsg["page"]                         = "ページ";
            dictMsg["collapseAll"]                  = "全てを折りたたむ";
            dictMsg["expandAll"]                    = "全てを展開する";
            dictMsg["user"]                         = "ユーザー";
            dictMsg["password"]                     = "パスワード";
            dictMsg["sign on"]                      = "サインオン";
            dictMsg["pui"]                          = "Profound UI";
            dictMsg["pui sign on"]                  = dictMsg["pui"] + " " + dictMsg["sign on"];
            dictMsg["pjs"]                          = "Profound.js";
            dictMsg["pjs sign on"]                  = dictMsg["pjs"] + " " + dictMsg["sign on"];
            dictMsg["message id"]                   = "メッセージID";
            dictMsg["ctlr job"]                     = "制御ジョブ";
            dictMsg["app job"]                      = "アプリケーションジョブ";
            dictMsg["joblog download"]              = "ダウンロードジョブのログ";
            dictMsg["curr user"]                    = "現行ユーザー";
            dictMsg["remote ip"]                    = "リモートIPアドレス";
            dictMsg["remote port"]                  = "リモートポート";
            dictMsg["severity"]                     = "重大度";
            dictMsg["date"]                         = "日付";
            dictMsg["time"]                         = "時刻";
            dictMsg["program"]                      = "プログラム";
            dictMsg["procedure"]                    = "プロシージャ";
            dictMsg["lines"]                        = "行";
            dictMsg["message"]                      = "メッセージ";
            dictMsg["new session"]                  = "新規セッション";
            dictMsg["close"]                        = "閉じる";
            dictMsg["current password"]             = "現行パスワード";
            dictMsg["new password"]                 = "新規パスワード";
            dictMsg["repeat new password"]          = "新規パスワード(再入力)";
            dictMsg["submit"]                       = "投入";
            dictMsg["exit"]                         = "Exit";
            dictMsg["warning"]                      = "警告";
            dictMsg["change password"]              = "パスワードを変更";
            dictMsg["cancel"]                       = "取り消し";
            dictMsg["find text"]                    = "検索";
            dictMsg["remove filter"]                = "フィルターの除去";
            dictMsg["chart"]                        = "チャート";
            dictMsg["section"]                      = "セクション";
            dictMsg["version"]                      = "Version";
            dictMsg["fixPack"]                      = "Fix Pack";
            // Atrium only.
            dictMsg["yes"]                          = "Yes";
            dictMsg["no"]                           = "No";
            dictMsg["settings"]                     = "設定";
            dictMsg["favorites"]                    = "お気に入り";
            dictMsg["type query press en"]          = "クエリを入力しEnterキーを押す";
            dictMsg["add to favorites"]             = "お気に入りに追加";
            dictMsg["rmv from favorites"]           = "お気に入りから除去";
            dictMsg["please wait"]                  = "お待ちください...";
            dictMsg["control panel"]                = "コントロールパネル";
            dictMsg["my settings"]                  = "設定";
            dictMsg["about atrium"]                 = "Atriumについて";
            dictMsg["about atrium msg"]             = dictMsg["version"] + " " + window["pui"]["baseVersion"] + ", " + dictMsg["fixPack"] + " " + window["pui"]["fixPackVersion"] + "<br /><br />"
                                                    + "Copyright &copy 1999-" + new Date().getFullYear() + " Profound Logic Software, Inc.<br /><br />"
                                                    + "Warning: This computer program is protected by copyright law<br />"
                                                    + "and international treaties. Unauthorized reproduction or<br />"
                                                    + "distribution of this program, or any portion of it, may result in<br />"
                                                    + "severe civil and criminal penalties, and will be prosecuted to the<br />"
                                                    + "maximum extent possible under the law.<br /><br />"
                                                    + "Patented. &nbsp;U.S. Patent No. 8,667,405 B2.";
            dictMsg["item"]                         = "アイテム";
            dictMsg["open selected item"]           = "選択されたアイテムを開く";
            dictMsg["of"]                           = "of";
            dictMsg["no results to dsp"]            = "表示する結果がありません。";
            dictMsg["displaying results"]           = "結果の表示";
            dictMsg["search results"]               = "結果の検索";
            dictMsg["new folder"]                   = "新規フォルダ";
            dictMsg["rename"]                       = "リネーム";
            dictMsg["description"]                  = "説明";
            dictMsg["ok"]                           = "OK";
            dictMsg["add"]                          = "追加";
            dictMsg["add x"]                        = "&1を追加";
            dictMsg["delete"]                       = "削除";
            dictMsg["screen"]                       = "画面";
            dictMsg["screens"]                      = "画面";
            dictMsg["macro"]                        = "マクロ";
            dictMsg["macros"]                       = "マクロ";
            dictMsg["screen id"]                    = "画面識別子";
            dictMsg["screen ids"]                   = "画面識別子";
            dictMsg["field row"]                    = "フィールド行";
            dictMsg["field column"]                 = "フィールド列";
            dictMsg["field value"]                  = "フィールド値";
            dictMsg["value"]                        = "値";
            dictMsg["action"]                       = "アクション";
            dictMsg["actions"]                      = "アクション";
            dictMsg["detect once"]                  = "一度だけ検出";
            dictMsg["delete screen"]                = "画面の削除";
            dictMsg["genie macros"]                 = "Genie マクロ";
            dictMsg["screen name"]                  = "画面名";
            dictMsg["identifier"]                   = "識別子";
            dictMsg["identifiers"]                  = "識別子";
            dictMsg["macro name"]                   = "マクロ名";
            dictMsg["close browser wintab"]         = "ブラウザまたはタブを閉じます。";
            dictMsg["select"]                       = "選択";
            dictMsg["write value in field"]         = "フィールドに値を書き込む";
            dictMsg["press a key"]                  = "キーを押す";
            dictMsg["a literal value"]              = "固定値";
            dictMsg["a variable value"]             = "可変値";
            dictMsg["cur user profile"]             = "現行ユーザープロファイル";
            dictMsg["result js expr"]               = "JavaScript式の結果";
            dictMsg["action data"]                  = "アクションデータ";
            dictMsg["data type"]                    = "データタイプ";
            dictMsg["users"]                        = "ユーザー";
            dictMsg["all groups"]                   = "全てのグループ";
            dictMsg["supplemental groups"]          = "補足グループ";
            dictMsg["users w primary grp"]          = "プライマリグループが\"&1\"のユーザー";
            dictMsg["users w suppl grp"]            = "補足グループ\"&1\"を持つユーザー";
            dictMsg["group"]                        = "グループ";
            dictMsg["groups"]                       = "グループ";
            dictMsg["edit"]                         = "編集";
            dictMsg["edit x"]                       = "&1を編集";
            dictMsg["manager"]                      = "マネージャー";
            dictMsg["administrator"]                = "アドミニストレーター";
            dictMsg["primary group"]                = "プライマリグループ";
            dictMsg["delete x"]                     = "&1を削除";
            dictMsg["reassign x"]                   = "&1を再割り当て";
            dictMsg["navigation item"]              = "ナビゲーションアイテム";
            dictMsg["navigation items"]             = "ナビゲーションアイテム";
            dictMsg["navigation panel"]             = "ナビゲーションパネル";
            dictMsg["home pages"]                   = "ホームページ";
            dictMsg["menu group"]                   = "メニューグループ";
            dictMsg["menu item"]                    = "メニューアイテム";
            dictMsg["toolbar items"]                = "ツールバーアイテム";
            dictMsg["toolbar"]                      = "ツールバー";
            dictMsg["button"]                       = "ボタン";
            dictMsg["pulldown menu"]                = "プルダウンメニュー";
            dictMsg["pulldown menu item"]           = "プルダウンメニューアイテム";
            dictMsg["separator bar"]                = "セパレーターバー";
            dictMsg["spacer"]                       = "スペーサー";
            dictMsg["item details"]                 = "アイテム詳細";
            dictMsg["item number"]                  = "アイテム番号";
            dictMsg["item type"]                    = "アイテムタイプ";
            dictMsg["genie macro"]                  = "Genieマクロ";
            dictMsg["rdf application"]              = "リッチ画面ファイルアプリケーション";
            dictMsg["web application"]              = "Webアプリケーション";
            dictMsg["pc command"]                   = "PCコマンド";
            dictMsg["dspf program library"]         = "画面ファイルプログラムライブラリ";
            dictMsg["dspf program"]                 = "画面ファイルプログラム";
            dictMsg["variable name x"]              = "変数名 &1";
            dictMsg["a tab in the portal"]          = "ポータル内のタブ";
            dictMsg["a new browser wind"]           = "新規ブラウザウィンドウまたはタブ";
            dictMsg["update"]                       = "更新";
            dictMsg["fill"]                         = "塗りつぶし";
            dictMsg["permissions"]                  = "アクセス許可";
            dictMsg["user/group name"]              = "ユーザー/グループ名";
            dictMsg["all users groups"]             = "全てのユーザーとグループ";
            dictMsg["type"]                         = "タイプ";
            dictMsg["access"]                       = "アクセス";
            dictMsg["allow"]                        = "許可";
            dictMsg["disallow"]                     = "禁止";
            dictMsg["navigation"]                   = "ナビゲーション";
            dictMsg["add usrgrp perm"]              = "ユーザー/グループのアクセス許可を追加";
            dictMsg["membership"]                   = "メンバーシップ";
            dictMsg["none"]                         = "無し";
            dictMsg["remove"]                       = "移動";
            dictMsg["appearance"]                   = "外観";
            dictMsg["home page"]                    = "ホームページ";
            dictMsg["tree"]                         = "ツリー";
            dictMsg["accordion"]                    = "アコーディオン";
            dictMsg["min search chars"]             = "最小検索文字";
            dictMsg["libl for rdf apps"]            = "リッチ画面ファイルアプリケーションのライブラリリスト";
            dictMsg["library list"]                 = "ライブラリリスト";
            dictMsg["library"]                      = "ライブラリ";
            dictMsg["use atrium def libl"]          = "Atriumのデフォルトライブラリリストを使用";
            dictMsg["use jobd libl"]                = "JOBDのライブラリリストを使用";
            dictMsg["specify libl"]                 = "ライブラリリストを指定";
            dictMsg["up"]                           = "Up";
            dictMsg["down"]                         = "Down";
            dictMsg["move up"]                      = "Move Up";
            dictMsg["move down"]                    = "Move Down";
            dictMsg["global settings"]              = "全体設定";
            dictMsg["save"]                         = "保管";
            dictMsg["add usr to supp grp"]          = "補足グループにユーザーを追加";
            // Atrium.help tool-tip titles and texts. (Some are used for other fields than just tool-tips.)
            dictMsg["member of"]                    = "メンバー";
            dictMsg["member of hlp"]                = "このユーザー/グループが所属するグループ";
            dictMsg["group name"]                   = "グループ名";
            dictMsg["group name hlp"]               = "このグループの表示名";
            dictMsg["inherit settings"]             = "設定を継承する";
            dictMsg["inherit settings hlp"]         = "このオプションをONにすると、ユーザー/グループはその親から設定を継承します。このチェックボックスをOFFにすると、ユーザー/グループに個別の設定があります。";
            dictMsg["user name"]                    = "ユーザー名";
            dictMsg["user name hlp"]                = "このユーザープロファイルの表示名";
            dictMsg["access role"]                  = "アクセスロール";
            dictMsg["access role hlp"]              = "このユーザーのアクセスロールを制御します。管理者は全てのグループとユーザーを管理でき、アプリケーション権限も制御できます。マネージャーは、自分のグループ内でユーザーとグループの設定を構成できます。ユーザーに特別な権限はありません。";
            dictMsg["can edit profile"]             = "プロファイルを編集できます";
            dictMsg["can edit profile hlp"]         = "ユーザーが \"外観\" 及び \"ナビゲーション\"設定を編集できるようにします。他の全ての設定はユーザーが編集することはできません。";
            dictMsg["user profile"]                 = "ユーザープロファイル";
            dictMsg["user profile hlp"]             = "ユーザープロファイル名。ユーザープロファイル名はIBMiプロファイルが使用されない限り、大文字小文字が区別されます。";
            dictMsg["password hlp"]                 = "パスワードをセット/リセットします。パスワードは大文字と小文字が区別されます。";
            dictMsg["conf password"]                = "パスワードの確認";
            dictMsg["conf password hlp"]            = "パスワードをセット/リセットする場合、このフィールドは指定された新しいパスワードと正確に一致する必要があります。パスワードは大文字と小文字が区別されます。";
            // Atrium.help tool-tip - User/group Appearance preferences.
            dictMsg["browser title"]                = "ブラウザタイトル";
            dictMsg["browser title hlp"]            = "ブラウザのタイトルバーに表示されるテキストを設定します。";
            dictMsg["show banner"]                  = "バナーを表示";
            dictMsg["show banner hlp"]              = "ポータルの上部にバナーを表示したくない場合は、このオプションのチェックを外します。";
            dictMsg["banner height"]                = "バナーの高さ";
            dictMsg["banner height hlp"]            = "ポータルの上部にあるバナーの高さをピクセル単位で設定します。この設定は、バナーを表示しないように選択した場合は無視されます。有効な値は0から600ピクセルです。";
            dictMsg["banner url"]                   = "バナーURL";
            dictMsg["banner url hlp"]               = "バナーコンテンツが配置されているURLを設定します。絶対URLでも完全修飾職URLでも構いません。";
            dictMsg["theme"]                        = "テーマ";
            dictMsg["theme hlp"]                    = "デフォルトのテーマを設定します。<strong>\"ユーザーがテーマを選択できるようにする\"</strong>が有効になっている場合、個々のユーザーがこれを上書きできます。";
            dictMsg["allow sel theme"]              = "ユーザーがテーマを選択できるようにする";
            dictMsg["allow sel theme hlp"]          = "ONにすると、ツールバーのコントロールを使用して、テーマを選択することができます。";
            dictMsg["show menu search"]             = "検索の表示";
            dictMsg["show menu search hlp"]         = "メニューの検索機能を無効にする場合はチェックを外します。";
            dictMsg["show fav sys"]                 = "お気に入りシステムの表示";
            dictMsg["show fav sys hlp"]             = "チェックを外すとお気に入りシステムが無効になります。";
            dictMsg["show fav start"]               = "起動時のお気に入りの表示";
            dictMsg["show fav start hlp"]           = "ONにすると、起動時にお気に入りパネルが表示されます。それ以外の場合あ、ナビゲーションパネルが表示されます(デフォルト)。このオプションはお気に入りシステムが有効な場合にのみ使用できます。";
            dictMsg["limit num sessn"]              = "セッション数を制限";
            dictMsg["limit num sessn hlp"]          = "このユーザー/グループに許可されているAtriumセッションの数。0は無制限を表します。Webブラウザ毎に制限が適用されます。";
            // Atrium.help tool-tip - User/Group navigation preferences.
            dictMsg["show hmpg start"]              = "スタートアップホームページの表示";
            dictMsg["show hmpg start hlp"]          = "ONにすると、起動時にポータルでカスタマイズ可能なホームページが表示されます。";
            dictMsg["home page url"]                = "ホームページURL";
            dictMsg["home page url hlp"]            = "ホームページのコンテンツが配置されているURLを設定します。絶対URLでもk安全修飾URLでもかまいません。";
            dictMsg["navi pnl title"]               = "ナビゲーションパネルタイトル";
            dictMsg["navi pnl title hlp"]           = "ナビゲーションパネルのタイトルバーに表示されるテキストを設定します。";
            dictMsg["navi pnl width"]               = "ナビゲーションパネルの開始幅";
            dictMsg["navi pnl width hlp"]           = "ナビゲーションパネルの開始幅をピクセル単位で設定します。ユーザーはパネルのサイズを変更したり必要に応じて非表示にすることもできます。有効な値は0～2000ピクセルです。";
            dictMsg["navi type"]                    = "ナビゲーションタイプ";
            dictMsg["navi type hlp"]                = "ナビゲーションパネルで使されるメニューのタイプを制御します。\"ツリー\"または\"アコーディオン\"です。この設定はツールバーには適用されません。";
            dictMsg["single click nav"]             = "シングルクリックナビゲーション";
            dictMsg["single click nav hlp"]         = "ONにすると、ナビゲーションパネルのメニュー項目がワンクリックで起動します。それ以外の場合は、ダブルクリックでのみ起動します。この設定はツールバーには適用されません。";
            // Atrium.help tool-tip - Library list.
            dictMsg["current library"]              = "現行ライブラリ";
            dictMsg["current library hlp"]          = "現行ライブラリを*USRPRF、もしくは*CRTDFTのいずれかで指定します。";
            dictMsg["job descr"]                    = "ジョブ記述";
            dictMsg["job descr hlp"]                = "ライブラリリストを設定するジョブ記述を指定します。AtriumユーザーがIBM iプロファイルの場合、*USRPRFを指定できます。";
            dictMsg["job descr lib"]                = "ジョブ記述ライブラリ";
            dictMsg["job descr lib hlp"]            = "ジョブ記述のライブラリを指定します。*LIBLまたは*CURLIBを指定できます。";
            // Atrium.help tool-tip - Navigation / Toolbar items.
            dictMsg["item name"]                    = "アイテム名";
            dictMsg["item name hlp"]                = "ナビゲーションまたはツールバー項目の表示名を設定します。";
            dictMsg["action type"]                  = "アクションタイプ";
            dictMsg["action type hlp"]              = "このアイテムが起動するアプリケーションのタイプを設定します。";
            dictMsg["url"]                          = "URL";
            dictMsg["url hlp"]                      = "WebアプリケーションのURLを設定します。これは絶対パスまたは完全修飾パスとして指定できます。クエリ文字列パラメータはURLで指定することが出来ます。";
            dictMsg["genie url"]                    = "Genie URL";
            dictMsg["genie url hlp"]                = "Genieを起動するために使用されるURLを設定します。指定しない場合、デフォルトのGenie URL /profoundui/auth/genieが使用されます。このフィールドは代替のGenie URLまたはクエリ文字列パラメータが必要な場合には便利です。例 : /profoundui/auth/genie?skin=MyCompany";
            dictMsg["open as"]                      = "開く";
            dictMsg["open as hlp"]                  = "アイテムをポータルの新しいタブとして起動するか、新しいブラウザとして起動するかを設定します。ブラウザが新しいウィンドウまたはタブを使用するかはユーザーのブラウザ設定によって異なります。";
            dictMsg["opens once only"]              = "1回のみ開く";
            dictMsg["opens once only hlp"]          = "デフォルトでは、ポータルですでにタブが開いているときにユーザーがこのアイテムを起動すると、アイテムの別のタブが開きます。このようにして開くことができるタブの数に制限があります。このアイテムの複数のタブを開くことはできません。ユーザーがアイテムを選択したときにこのアイテムのタブが既に開いている場合は、既存のタブが有効になります。ウィンドウまたはタブ。";
            dictMsg["icon"]                         = "アイコン";
            dictMsg["icon hlp"]                     = "オプション。ナビゲーションまたはツールバー項目に使用するアイコンファイルを設定します。アイコンファイルは GIF、JPG、またはPNG形式にすることができます。透過GIFを推奨します。パスはAtrium導入のルートから絶対パスとして指定する必要があります。アイコンが指定されていない場合、Atriumはナビゲーション項目のデフォルトアイコンを使用します。ここに指定されていない限り、ツールバー項目のアイコンは表示されません。";
            dictMsg["parameter"]                    = "パラメータr";
            dictMsg["parameter hlp"]                = "オプション: リッチ画面プログラムが起動されたときにリッチ画面プログラムに渡されるパラメータを指定します。";

            break;

        default:
            console.log("Unknown Dictionary Type : '" + dict + "'");
    }

    return dictMsg;
};