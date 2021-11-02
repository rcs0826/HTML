var globalurl = "/";
function fileDownloadCB(e, t) {
    "function" != typeof saveAs
        ? $.loadScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js", function () {
              saveAs(e, t);
          })
        : saveAs(e, t);
}
function loadJqueryUI(e, t) {
    var o = jQuery("<link>");
    o.attr({ rel: "stylesheet", type: "text/css", href: "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" }),
        $("head").append(o),
        $.loadScript("https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js", function () {
            e(t);
        });
}
function msieversion() {
    return !!(window.navigator.userAgent.indexOf("MSIE ") > 0 || navigator.userAgent.match(/Trident.*rv\:11\./));
}
function showProgress() {
    $(".some_other_box").css({ width: 0, display: "block" }), $(".some_other_box").animate({ width: "90%", display: "block" }, 500);
}
function hideProgress() {
    $(".some_other_box").animate({ width: "100%", display: "none" }, 500, function () {
        $(this).hide();
    });
}
function openFile(e, t) {
    new AjaxUpload($("#" + e), {
        action: globalurl + "readfile/uploadFile",
        name: "userfile",
        onSubmit: function (e, o) {
            var i = o[0];
            if ("Excel" == t) {
                if (!i.trim().startsWith("xls")) return openErrorDialog("Selected file is not Excel File"), !1;
            } else if ("Word" == t) {
                if (!i.trim().startsWith("doc")) return openErrorDialog("Selected file is not Word File"), !1;
            } else {
                if ("any" != t && t != i && "txt" != i.trim()) return openErrorDialog("Selected file is not " + t + " and txt file"), !1;
                if ("any" == t && ("jpeg" == i || "png" == i || "jpg" == i || "gif" == i || "bmp" == i || "pdf" == i || "pptx" == i || "ppt" == i)) return openErrorDialog("Selected file is not supported"), !1;
            }
            showProgress();
        },
        onComplete: function (t, o) {
            "error" != o ? readFile(o, e) : openErrorDialog("Error in Loading File."), hideProgress();
        },
    });
}
function readFile(e, t) {
    var o = "readfile/readFile";
    "excelTohtml" == t || "excelToxml" == t || "excelTojson" == t ? ((o = "readfile/convertHTML"), $("#fName").text(e)) : "wordTohtml" == t && ((o = "readfile/WordToHTML"), $("#fName").text(e)),
        $.ajax({
            type: "post",
            url: globalurl + o,
            data: { fileName: e, btnID: t },
            success: function (o) {
                if ("error" != o) {
                    if ("excelToxml" == t) return excelTOXml(o), !1;
                    if ("excelTojson" == t) return excelToJson(o), !1;
                    if ("excelTohtml" == t || "wordTohtml" == t) return htmlOutput(o), !1;
                    if ("F2" == t) return setFileName(2, e), setToEditor2(o), !1;
                    "F1" == t && setFileName(1, e), setToEditor(o);
                } else openErrorDialog("Error in Loading File."), $("#fName").text("");
            },
            error: function (e, t, o) {
                openErrorDialog("Failed to load data=" + t), console.log(e), $("#fName").text("");
            },
        });
}
function getDataFromUrlId(e) {
    $.ajax({
        type: "post",
        url: globalurl + "service/getDataFromID",
        dataType: "text",
        data: { urlid: e },
        success: function (e) {
            setToEditor(e.trim()), $(".sharelinkurl").attr("st_url", window.location), $(".sharelinkurl").attr("st_title", $("#save_link_title").val());
        },
        error: function (e, t, o) {
            openErrorDialog("Failed to load data=" + t);
        },
    });
}
function clearEditorInput() {
    var e;
    if (
        ($("#jsData").val(""),
        $("#cssData").val(""),
        $("#tData").val(""),
        "undefined" != typeof editorAce && editorAce.setValue(""),
        "undefined" != typeof editorResult ? editorResult.setValue("") : ($("#result1").html(""), $("#result").text("")),
        $("#result1").html(""),
        "undefined" != typeof editor && void 0 !== editor.set && editor.set(),
        null != e)
    ) {
        var t = document.getElementById("result1").contentWindow.document;
        (e = ""), t.open(), t.write(""), t.close();
    }
    $("#outputMsg").html("Result");
}
function setOutputMsg(e) {
    $("#outputMsg").html("Result : " + e);
}
function openErrorDialog(e) {
    void 0 !== jQuery.ui
        ? $("<div></div>")
              .appendTo("#openError")
              .html("<div>" + e + "</h5></div>")
              .dialog({
                  modal: !0,
                  title: "Message",
                  zIndex: 1e4,
                  autoOpen: !0,
                  width: "400",
                  resizable: !1,
                  buttons: {
                      Ok: function () {
                          $(this).dialog("destroy");
                      },
                  },
              })
        : loadJqueryUI(openErrorDialog, e);
}
$(document).ready(function () {
    $(".btn").addClass("span11"),
        $("textarea").on("change paste keyup", function () {
            updateCounter(this);
        }),
        $(".navtoggle").click(function () {
            $(".mainnav").toggle("slow"), $(".navtoggle").toggle("slow"), $(".navtoggleclose").toggle("slow"), $(".navbutton").toggle("slow");
        }),
        $(".navtoggleclose").click(function () {
            $(".mainnav").toggle("slow"), $(".navtoggle").toggle("slow"), $(".navbutton").toggle("slow"), $(".navtoggleclose").toggle("slow");
        }),
        (msieversion() || navigator.userAgent.toLowerCase().indexOf("firefox") > -1 || /Edge\/\d./i.test(navigator.userAgent)) && $(".cblogoimage").prepend('<img src="/img/codebeautify_logo.png" alt="Code Beautify" />'),
        $(".close1").click(function () {
            $(".ui-dialog-content").dialog("destroy");
        }),
        $(".btn,.span11").on("click", function () {
            1 == fsr1 ? fullScreenRight() : 1 == fsr && fullScreenLeft();
        }),
        $("#more").click(function () {
            $("html, body").animate({ scrollTop: $(".footer_container").offset().top }, 1e3);
        }),
        $("#back-top").hide(),
        $(function () {
            $(window).scroll(function () {
                $(this).scrollTop() > 100 ? $("#back-top").fadeIn() : $("#back-top").fadeOut();
            }),
                $("#back-top a").click(function () {
                    return $("body,html").animate({ scrollTop: 0 }, 800), !1;
                });
        });
}),
    (jQuery.loadScript = function (e, t) {
        $.ajaxSetup({ cache: !0 }), jQuery.ajax({ url: e, dataType: "script", success: t, async: !0 }), $.ajaxSetup({ cache: !1 });
    }),
    $(document).ajaxSend(function (e, t, o) {
        "/service/check_url" != o.url && ("/service/wordcount" != o.url && "/service/saveKeywordHistory" != o.url ? showProgress() : $("#counterLoader").show());
    }),
    $(document).ajaxComplete(function (e, t, o) {
        "/service/wordcount" != o.url ? (hideProgress(), $("#path").val("")) : $("#counterLoader").hide();
    });
var fsr = 0;
function fullScreenLeft() {
    return $(".leftThum").hide(), $(".rightThum").hide(), fullScreenBoth(), $("html, body").animate({ scrollTop: $("#mainLeftDiv").offset().top - 30 }, 500), !1;
}
function fullScreenBoth() {
    if (0 == fsr)
        (fsr = 1),
            $("#fsimg").attr("title", "Small Screen"),
            $("#mainLeftDiv").addClass("mainDivLeft"),
            $("#editor").css({ width: "100%" }),
            $("#buttonDiv").css({ float: "right" }),
            "undefined" != typeof editorResult && editorResult.getSession().setUseWrapMode(!1),
            $("#fs1img1").attr("title", "Small Screen"),
            $("#mainRightDiv").addClass("mainDivLeft"),
            $("#result").css({ width: "100%" }),
            $("#mainRightDiv").css({ float: "right" }),
            "undefined" != typeof editorResult && editorResult.getSession().setUseWrapMode(!1),
            hideOtherArea(!0);
    else {
        if (((fsr = 0), $("#fsimg").attr("title", "Full Screen"), $("#mainLeftDiv").removeClass("mainDivLeft"), $("#editor").css({ width: "100%" }), $("#buttonDiv").css({ float: "left" }), "undefined" != typeof editorResult)) {
            editorResult.getSession().setUseWrapMode(!0);
            var e = editorResult.getValue();
            editorResult.setValue(e);
        }
        $("#fs1img").attr("title", "Full Screen"),
            $("#mainRightDiv").removeClass("mainDivLeft"),
            $("#result").css({ width: "100%" }),
            $("#mainRightDiv").css({ float: "right" }),
            "undefined" != typeof editorResult && editorResult.getSession().setUseWrapMode(!0),
            hideOtherArea(!1);
    }
    "undefined" != typeof editorResult && editorResult.resize(), "undefined" != typeof editorAce && editorAce.resize();
}
function hideOtherArea(e) {
    1 == e
        ? ($(".infoSection").hide(), $(".footerpart").hide(), $(".footerSection").hide(), $("#buttonDiv").hide(), $(".buttonSection").hide())
        : ($(".infoSection").show(), $(".footerpart").show(), $(".footerSection").show(), $("#buttonDiv").show(), $(".buttonSection").show());
}
var fsr1 = 0;
function fullScreenRight() {
    return $(".leftThum").hide(), $(".rightThum").hide(), fullScreenBoth(), $("html, body").animate({ scrollTop: $("#mainRightDiv").offset().top - 30 }, 500), !1;
}
var aefsr = 0;
function fullScreen() {
    0 == aefsr
        ? ((aefsr = 1),
          $("#aefsimg").attr("title", "Small Screen"),
          $("#editorAll").removeClass("span10"),
          $("#editorAll").addClass("span12"),
          "undefined" != typeof editorAce && editorResult.getSession().setUseWrapMode(!1),
          hideOtherArea(!0))
        : ((aefsr = 0),
          $("#aefsimg").attr("title", "Full Screen"),
          $("#editorAll").removeClass("span12"),
          $("#editorAll").addClass("span10"),
          "undefined" != typeof editorAce && editorResult.getSession().setUseWrapMode(!0),
          hideOtherArea(!1)),
        "undefined" != typeof editorResult && editorResult.resize(),
        "undefined" != typeof editorAce && editorAce.resize();
}
function decodeSpecialCharacter(e) {
    return e
        .replace(/\&amp;/g, "&")
        .replace(/\&gt;/g, ">")
        .replace(/\&lt;/g, "<")
        .replace(/\&quot;/g, '"');
}
function loadFromURL(e) {
    if (void 0 !== jQuery.ui) {
        $("#path").val("");
        var t = $("#sampleurl").val();
        t
            ? $("#loadUrlPathDiv a").click(function () {
                  $("#path").val(t);
              })
            : $("#sampleurlindialog").hide(),
            $("#loadUrlPathDiv").removeClass("hide"),
            $("#loadUrlPathDiv").dialog({
                modal: !0,
                title: "Enter Url",
                zIndex: 1e4,
                autoOpen: !0,
                width: "400",
                resizable: !1,
                buttons: {
                    Load: function () {
                        var t = $("#path").val();
                        t.trim().length > 5 && loadUrl(t, e), $(this).dialog("destroy"), $("#loadUrlPathDiv").addClass("hide");
                    },
                    Cancel: function (e, t) {
                        $("#openError").html(""), $(this).dialog("destroy"), $("#loadUrlPathDiv").addClass("hide");
                    },
                },
            });
    } else loadJqueryUI(loadFromURL, e);
}
function loadUrl(e, t) {
    $.ajax({
        type: "post",
        url: "//codebeautify.com/URLService",
        dataType: "text",
        data: { path: e },
        success: function (o) {
            try {
                "RSS" == t && processRSS(o), setToEditor(o), updateTitleForURL("URL: " + e);
            } catch (e) {
                openErrorDialog("Invalid " + t + " Data Or Invalid " + t + " URL.");
            }
        },
        error: function (e, t, o) {
            openErrorDialog("Failed to load data=" + t);
        },
    });
}
function save(e, t) {
    var o = $("#save_link_title").val(),
        i = $("#save_link_description").val(),
        a = $("#save_link_tags").val().trim();
    if (o.toLowerCase().includes("href=") || i.toLowerCase().includes("href=") || a.toLowerCase().includes("href=")) alert("This data form doest not support URL input:");
    else if (o.toLowerCase().includes("crack") || i.toLowerCase().includes("crack") || a.toLowerCase().includes("crack")) alert("This data form doest not support this input, Please update the text and try again:");
    else {
        var n = $("#viewName").val().trim();
        "jsonvalidate" == n ? (n = "jsonvalidator") : "xmlvalidate" == n && (n = "xmlvalidator"),
            $.ajax({
                url: "/service/save",
                dataType: "text",
                type: "post",
                data: { content: e, viewname: n, title: o, desc: i, tags: a },
                success: function (e) {
                    var t = "https://" + location.host + "/" + n + "/" + e;
                    (t = t.replace(" ", "")),
                        $("#subTitle").find("h4").remove(),
                        $("#permalink").find("a").remove(),
                        $("#subTitle").append("<h4 style='padding-left:10px'>" + o + "</h4>"),
                        $("#permalink").append("<a href=" + t + " style='float:left;width:100%;'>" + t + "</a>"),
                        $(".sharelinkurl").attr("st_url", t),
                        $(".sharelinkurl").attr("st_title", o),
                        $("#permalink").parent().show();
                },
                error: function (e, t, o) {
                    openErrorDialog("Error in data saving");
                },
            });
    }
}
function update(e, t) {
    $.ajax({
        url: "/service/update",
        dataType: "text",
        type: "post",
        data: {
            id: $("#edit_link_id").val(),
            content: e,
            viewname: $("#viewName").val().trim(),
            title: $("#save_link_title").val(),
            desc: $("#save_link_description").val(),
            tags: $("#save_link_tags").val().trim(),
            urlid: $("#fContent").val(),
        },
        success: function (e) {
            $("#subTitle").find("h4").remove(),
                $("#permalink").find("a").remove(),
                $("#subTitle").append("<h4 style='padding-left:10px'>" + $("#save_link_title").val() + "</h4>"),
                $("#permalink").append("<a href=" + location.href + ">" + location.href + "</a>"),
                $(".sharelinkurl").attr("st_url", location.href),
                $(".sharelinkurl").attr("st_title", $("#save_link_title").val()),
                $("#permalink").parent().show(),
                t && shareLink(location.href);
        },
        error: function (e, t, o) {
            openErrorDialog("Error in data updating");
        },
    });
}
function shareLink(e) {
    "google" == getProvider() ? (window.location.href = "https://plus.google.com/share?url=" + e) : (window.location.href = "https://www.facebook.com/sharer/sharer.php?u=" + e);
}
function openSavedialog(e) {
    if (void 0 !== jQuery.ui) {
        var t = $("#isLogin").val(),
            o = "";
        if ("cssvalidate" == $("#viewName").val().trim()) o = $("#cssData").val();
        else if ("jsvalidate" == $("#viewName").val().trim()) o = $("#jsData").val();
        else if ("wordcounter" == $("#viewName").val().trim()) o = $("#tData").val();
        else if ("alleditor" == $("#viewName").val().trim()) {
            if (null == editorAce.getValue() && 0 == editorAce.getValue().trim().length) return (flag = !1), !1;
            o = editorAce.getValue() + "|" + $("#editorLanguage").val();
        } else o = "undefined" != typeof JSONEditor ? editor.getText() : "undefined" != typeof editorAce ? editorAce.getValue() : $("#input").val();
        null != o && "" != o && o.trim().length > 0
            ? ($("#savedialog").removeClass("hide"),
              $("#savedialog").dialog({
                  modal: !0,
                  title: "Save Online / Download as File",
                  zIndex: 1e4,
                  autoOpen: !1,
                  width: "30%",
                  resizable: !1,
                  buttons: {
                      Download: function () {
                          downloadData(), $(this).dialog("destroy");
                      },
                      "Save Online": function () {
                          var i = $("#save_link_title").val();
                          null != i && 0 != i.trim().length
                              ? ($("#savedialog").dialog("close"),
                                $("#openError").html(""),
                                "" == $("#edit_link_id").val() || "0" == $("#edit_link_id").val()
                                    ? (save(o, e), $(this).dialog("destroy"))
                                    : "1" == t
                                    ? ($("#savedialog").dialog("option", "disabled", !0),
                                      $("<div></div>")
                                          .appendTo("#openError")
                                          .html("<div>Do you want to save as new file..?</h5></div>")
                                          .dialog({
                                              modal: !0,
                                              title: "Confirm",
                                              zIndex: 1e4,
                                              autoOpen: !0,
                                              width: "30%",
                                              resizable: !1,
                                              buttons: {
                                                  Yes: function () {
                                                      $("#openError").html(""), save(o, e), $(this).dialog("destroy"), $("#savedialog").dialog("destroy");
                                                  },
                                                  No: function (t, i) {
                                                      $("#openError").html(""), update(o, e), $(this).dialog("destroy"), $("#savedialog").dialog("destroy"), $("#savedialog").removeClass("hide");
                                                  },
                                                  Close: function (e, t) {
                                                      $("#openError").html(""), $(this).dialog("destroy"), $("#savedialog").dialog("open");
                                                  },
                                              },
                                          }))
                                    : ($("#openError").html(""), save(o, e), $(this).dialog("destroy")))
                              : openErrorDialog("Please Enter Title");
                      },
                      Cancel: function (e, t) {
                          $("#openError").html(""), $(this).dialog("destroy"), $("#savedialog").addClass("hide");
                      },
                  },
              }),
              $("#savedialog").dialog("open"))
            : openErrorDialog("No Data in Input view");
    } else loadJqueryUI(openSavedialog, e);
}
function createEditor(e, t) {
    null != e &&
        null != e &&
        ((editorAce = ace.edit("editor")),
        editorAce.getSession().setMode("ace/mode/" + e),
        editorAce.getSession().setUseWrapMode(!0),
        editorAce.on("change", function () {
            var e = editorAce.getValue(),
                t = e.trim().replace(/\s+/gi, " ").split(" ").length;
            $("#editor1TC").text(e.length), $("#editor1TW").text(t);
            var o = e.split(/\r\n|\r|\n/).length;
            $("#editor1TL").text(o);
            var i = countBytes(e);
            $("#editor1Size").text(formateByteCount(i)), "tableizer" == $("#viewName").val() && hideTableizer(), savetoLocalStorage(e);
        }),
        $(".editorCounterSection").show()),
        null != t &&
            null != t &&
            ((editorResult = ace.edit("result")),
            editorResult.getSession().setMode("ace/mode/" + t),
            editorResult.getSession().setUseWrapMode(!0),
            editorResult.on("change", function () {
                var e = editorResult.getValue(),
                    t = e.trim().replace(/\s+/gi, " ").split(" ").length;
                $("#editor2TC").text(e.length), $("#editor2TW").text(t);
                var o = e.split(/\r\n|\r|\n/).length;
                $("#editor2TL").text(o);
                var i = countBytes(e);
                $("#editor2Size").text(formateByteCount(i));
            }),
            $(".editorCounterSection").show());
}
function updateCounter(e) {
    var t = $(e).val(),
        o = t.trim().replace(/\s+/gi, " ").split(" ").length;
    $("#editor1TC").text(t.length), $("#editor1TW").text(o);
    var i = t.split(/\r\n|\r|\n/).length;
    $("#editor1TL").text(i);
    var a = countBytes(t);
    $("#editor1Size").text(formateByteCount(a)), $(".editorCounterSection").show();
}
function countBytes(e, t) {
    ((t = t || {}).lineBreaks = t.lineBreaks || 1), (t.ignoreWhitespace = t.ignoreWhitespace || !1);
    var o = e.length,
        i = o - e.replace(/[\u0100-\uFFFF]/g, "").length,
        a = o - e.replace(/(\r?\n|\r)/g, "").length;
    return t.ignoreWhitespace ? (e = e.replace(/(\r?\n|\r|\s+)/g, "")).length + i : o + i + Math.max(0, t.lineBreaks * (a - 1));
}
function formateByteCount(e) {
    for (var t = 0; e > 1024; ) (e /= 1024), t++;
    return (e = Math.round(100 * e) / 100) + " " + (t = ["", "K", "M", "G", "T"][t]) + "B";
}
function setViewTitle(e, t, o) {
    null != t && 1 == t ? $("#moreMenu").show() : $("#moreMenu").hide(), null != o && 1 == o ? $("#savebtn").show() : $("#savebtn").hide();
}
function createFile(e, t) {
    var o = "";
    (null == t
        ? ("undefined" != typeof editorResult && (o = editorResult.getValue()),
          0 == o.trim().length && "undefined" != typeof editor && (o = editor.getText()),
          0 == o.trim().length && "undefined" != typeof editorAce && (o = editorAce.getValue()))
        : ((o = $("#" + t).text()), "html" == e && (o = vkbeautify.xml(o))),
    "converted" == e && (e = converted),
    0 != o.trim().length)
        ? fileDownloadCB(new Blob(["" + o], { type: "text/plain;charset=utf-8" }), "codebeautify." + e)
        : openErrorDialog("Sorry Result is Empty");
}
function getJsonSampleData() {
    var e =
        '{"employees":{"employee":[{"id":"1","firstName":"Tom","lastName":"Cruise","photo":"https://pbs.twimg.com/profile_images/735509975649378305/B81JwLT7.jpg"},{"id":"2","firstName":"Maria","lastName":"Sharapova","photo":"https://pbs.twimg.com/profile_images/3424509849/bfa1b9121afc39d1dcdb53cfc423bf12.jpeg"},{"id":"3","firstName":"James","lastName":"Bond","photo":"https://pbs.twimg.com/profile_images/664886718559076352/M00cOLrh.jpg"}]}}';
    (e = JSON.stringify($.parseJSON(e), null, 2)), setToEditor(e), defaultAction(), $(".sharelinkurl").attr("st_url", window.location), $(".sharelinkurl").attr("st_title", $("#save_link_title").val());
}
function getXMLSampleData(e) {
    var t =
        '<?xml version="1.0" encoding="UTF-8" ?>   <employees>         <employee>             <id>1</id>             <firstName>Leonardo</firstName>             <lastName>DiCaprio</lastName>             <photo>http://1.bp.blogspot.com/-zvS_6Q1IzR8/T5l6qvnRmcI/AAAAAAAABcc/HXO7HDEJKo0/s200/Leonardo+Dicaprio7.jpg</photo>         </employee>         <employee>             <id>2</id>             <firstName>Johnny</firstName>             <lastName>Depp</lastName>             <photo>http://4.bp.blogspot.com/_xR71w9-qx9E/SrAz--pu0MI/AAAAAAAAC38/2ZP28rVEFKc/s200/johnny-depp-pirates.jpg</photo>         </employee>         <employee>             <id>3</id>             <firstName>Hritik</firstName>             <lastName>Roshan</lastName>             <photo>http://thewallmachine.com/files/1411921557.jpg</photo>         </employee>    </employees>  ';
    if (null != e && e) return vkbeautify.xml(t);
    setToEditor(vkbeautify.xml(t)), $(".sharelinkurl").attr("st_url", window.location), $(".sharelinkurl").attr("st_title", $("#save_link_title").val());
}
function jsonTocsvbyjson(e, t, o) {
    var i;
    try {
        i = jsonToCsv(e, ",", !0, !1, !1);
    } catch (e) {
        return console.log(e), null != t && t ? openErrorDialog("Error in Convert :" + e) : editorResult.setValue("Error in Convert"), !1;
    }
    if (null != t && t) return i;
    editorResult.setValue(i);
}
function csvToExcel(e, t, o, i) {
    (arr = []), (flag = !0);
    var a = t.toString().replace(/,/g, "\t"),
        n = "";
    if (
        ($.each(e, function (e, t) {
            for (var o in t) n += t[o] + "\t";
            n += "\n";
        }),
        null != o && o)
    )
        return console.log(a + "\n" + n), a + "\n" + n;
    editorResult.setValue(a + "\n" + n);
}
function jsonDataValidate(e) {
    try {
        $.parseJSON(e);
    } catch (e) {
        return console.log(e), !1;
    }
    return !0;
}
function updateProile() {
    var e = $("#profilename").val();
    if (null == e || 0 == e.trim().length) return openErrorDialog("Name is required. please enter name"), !1;
    $.ajax({
        url: "/service/updateProfile",
        dataType: "text",
        type: "post",
        data: { name: e },
        success: function (t) {
            $("#usernamelable").text(e.substring(0, 5) + ".."), (document.cookie = "loggedinuser=" + e), openErrorDialog("Your Profile updated successfully");
        },
    });
}
function savetoLocalStorage(e) {
    localStorage && ($("#viewName").val().toLowerCase().startsWith("excel") || localStorage.setItem($("#viewName").val(), e));
}
function setFromLocalStorage() {
    if (localStorage) {
        var e = localStorage.getItem($("#viewName").val());
        null != e && 0 != e.trim().length && "function" == typeof setToEditor && setToEditor(e);
    }
}
function toHTML(e, t, o) {
    var i = "";
    if ((null == e ? ((i = editorAce.getValue()), (t = "csv")) : (i = e), 0 != i.trim().length)) {
        var a = "",
            n = "<tr>",
            r = Papa.parse(i),
            l = r.data,
            s = l.slice(1, l.length);
        s.sort(function (e, t) {
            return t.length - e.length;
        }),
            0 == s.length && (s = r.data);
        for (var d = 0; d < s[0].length; d++) d < l[0].length ? (n += "<th>" + l[0][d] + "</th>") : (n += "<th>COLUMN" + (d + 1) + "</th>");
        n += "</tr>";
        for (var c = 1; c < l.length; c++) {
            a += "<tr>";
            for (d = 0; d < s[0].length; d++) d < l[c].length ? (a += "<td>" + l[c][d] + "</td>") : (a += "<td>&nbsp</td>");
            a += "</tr>";
        }
        var u = "<table border=1><thead>\n" + n + "</thead><tbody>\n" + a + "</tbody></table>";
        if (void 0 !== o && 1 == o) return u;
        htmlOutput(u, t);
    } else openErrorDialog("Sorry Input is Empty");
}
function loadNewView() {
    var e = $("#viewName").val().trim();
    localStorage.removeItem(e), (window.location.href = window.location.origin + "/" + e);
}
function getSampleData() {
    var e = $("#viewName").val().trim();
    if (
        "jsonviewer" == e ||
        "json-to-base64-converter" == e ||
        "json-escape-unescape" == e ||
        "jsontoxml" == e ||
        "json-to-csv" == e ||
        "online-json-editor" == e ||
        "json-to-yaml" == e ||
        "json-to-html-converter" == e ||
        "json-to-tsv-converter" == e ||
        "jsonminifier" == e ||
        "json-to-java-converter" == e ||
        "json-to-url-encode" == e
    )
        getJsonSampleData();
    else if ("un-google-link" == e)
        setToEditor(
            "https://www.google.co.in/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjB7JO54LDJAhULV44KHQQYB1cQFggbMAA&url=http%3A%2F%2Fcodebeautify.org%2F&usg=AFQjCNG_DKhs4g3mbjzuEWxEa2aHGfqYgw&sig2=a54qV321O8wYGpJ2kbfCNg&bvm=bv.108194040,d.c2E"
        );
    else if ("xmlviewer" == e || "xml-to-tsv-converter" == e || "online-xml-editor" == e || "xmltojson" == e || "xml-to-yaml" == e || "xml-to-csv-converter" == e || "xml-to-html-converter" == e || "xml-to-java-converter" == e)
        getXMLSampleData();
    else if ("text-to-html-converter" == e) setToEditor("The five-paragraph essay is a format of essay having five paragraphs: one introductory paragraph, three body paragraphs with support and development, and one concluding paragraph");
    else if ("sql-escape-unescape" == e) setToEditor("select * from table where value = 'in single quote '' is offensive'");
    else if ("word-to-html-converter" == e) setToEditor("<h1><span style='color: #ff0000;'><strong>Hello Codebeautify</strong></span></h1>");
    else if ("json-diff" == e) loadJsonDiffSample();
    else if ("rssviewer" != e)
        $.ajax({
            type: "post",
            url: globalurl + "SampleData",
            dataType: "text",
            data: { viewname: e },
            success: function (t) {
                (t = t.trim()), "Xpath-Tester" == e ? $("#xmlString").val(t) : "base64-to-image-converter" == e ? ($("#base64string").val(t), setBase64ToImage()) : setToEditor(t);
            },
            error: function (e, t, o) {
                openErrorDialog("Failed to load data=" + t);
            },
        });
    else {
        $.ajax({
            type: "post",
            url: "//codebeautify.com/URLService",
            dataType: "text",
            data: { path: "http://rss.cnn.com/rss/edition_world.rss" },
            success: function (e) {
                processRSS(e.trim());
                try {
                    editorAce.setValue(e), editorAce.getSession().setUseWrapMode(!0), FormatXML(), editorAce.clearSelection();
                } catch (e) {
                    openErrorDialog("invalid XML");
                }
            },
            error: function (e) {
                openErrorDialog("Failed to load data");
            },
        });
    }
    $(".sharelinkurl").attr("st_url", window.location), $(".sharelinkurl").attr("st_title", $("#save_link_title").val());
}
function getCopyText() {
    var e = "";
    return (e = editorResult.getValue()), $("#json").is(":visible") && (e = editor.getText()), e;
}
function saveRecentlyUsed() {
    if (localStorage) {
        var e = localStorage.getItem("recentUSedStack");
        if ((createRecentUsedLink((e = null == e || void 0 === e ? [] : JSON.parse(e))), checkRecentUsedNotUnique(e))) return !1;
        null != e && void 0 !== e && e.length >= 10 && e.shift();
        var t = { title: $("#subTitle").text(), view: $("#viewName").val() };
        e.push(t), localStorage.setItem("recentUSedStack", JSON.stringify(e));
    }
}
function checkRecentUsedNotUnique(e) {
    for (var t = 0; t < e.length; t++) if (e[t].view == $("#viewName").val()) return !0;
    return !1;
}
function createRecentUsedLink(e) {
    var t = [];
    t.push("<h3>Recently Used Tools</h3>"), t.push("<ul>");
    for (var o = e.length - 1; o >= 0; o--) {
        var i = e[o].title,
            a = e[o].view;
        (null != i && 0 != i.trim().length) || (i = a.toUpperCase()), t.push("<li><a href=/" + a + ">" + i + "</a></li>");
    }
    t.push("</ul>"), $("#relatedTools").append(t.join(""));
}
function setURLParameters() {
    $.urlParam = function (e) {
        var t = new RegExp("[?&]" + e + "=([^&#]*)").exec(window.location.href);
        return null == t ? null : decodeURI(t[1]) || 0;
    };
}
function setDefaultData() {
    createFavouriteImg(), saveRecentlyUsed(), setURLParameters();
    var e = null;
    if (null == $.urlParam("url")) {
        var t = null;
        if (null == $.urlParam("input")) {
            if ($("#fContent").val()) var o = $("#fContent").val().trim();
            if ($("#inputvalue").val()) var i = $("#inputvalue").val().trim();
            if ($("#fTitle").val()) var a = $("#fTitle").val();
            if ($("#fValue").val()) var n = $("#fValue").val().trim();
            var r = $("#viewName").val().trim();
            null != i && 0 != i.trim().length
                ? setToEditor(i)
                : null != o && 0 != o.trim().length
                ? ("sampleData" == o ? getSampleData() : "screenfly" != r && "send-snap-message" != r && getDataFromUrlId(o), updateTitleForURL(a))
                : null == n || 0 == n.length
                ? setFromLocalStorage()
                : FormatCSS_JS();
        } else null != (t = $.urlParam("input")) && 0 != t.length && ((a = "Input Parameter"), $("#subTitle").append("<h4 style='padding-left:10px'>" + a + "</h4>"), setToEditor(decodeURIComponent(t)));
    } else null != (e = $.urlParam("url")) && 0 != e.length && ((a = "URL: " + e), $("#subTitle").append("<h4 style='padding-left:10px'>" + a + "</h4>"), loadUrl(e, r));
}
function updateTitleForURL(e) {
    $("#subTitle").find("h4").remove(),
        $("#subTitle").append("<h4 style='padding-left:10px'>" + e + "</h4>"),
        $("#plinkBtn").parent().append('<input type="button" value="New" class="btn btn-inverse span11" onclick="loadNewView()" style="width: 19% !important; padding: 6px;float:right;margin-right:2%">'),
        $("#plinkBtn").val("Fork"),
        $("#plinkBtn").parent().show();
}
function conditionalCode() {
    var e = $("#viewName").val().trim();
    "undefined" != typeof editorAce && (editorAce.clearSelection(), editorAce.getSession().setUseWorker(!1)),
        "undefined" != typeof editorResult && (editorResult.clearSelection(), editorResult.getSession().setUseWorker(!1)),
        $("#fs").text(""),
        $("#fs").html("<span id='fsimg' class='icon-enlarge2'></span>"),
        $("#fs").css({ "margin-left": "5px" }),
        $("#fs1").text(""),
        $("#fs1").html("<span id='fs1img' class='icon-enlarge2'></span>"),
        $("#clearImg").html("<a href='#' id='sampleDataBtn' style='margin-right: 5px;' onclick='getSampleData()'>sample</a><b onclick='clearEditorInput()' style='color: red;'><span class='icon-bin'></span></b>"),
        $(".btn").addClass("span11"),
        $("#temp").removeClass("span11"),
        $("#clearImg").parent().append("<a href='#copy1' id='copy-dynamic1' style='float: right;  margin-right: 7px;' title='Copy'><span class='icon-copy'></span></a>"),
        $("#fs1").parent().append("<a href='#copy' id='copy-dynamic' style='float: right;  margin-right: 7px;' title='Copy'><span class='icon-copy'></span></a>"),
        $("#editor").css({ "font-size": "small" }),
        $("#result").css({ "font-size": "small" }),
        $("#result1").css({ "font-size": "small" }),
        $(".stButton").css({ display: "none!important" }),
        $("#me").val("Browse"),
        "alleditor" == e &&
            ($("#plinkBtn")
                .parent()
                .append("<a href='#copy' id='copy-dynamic1' class='btn allEditorpermalinkButton btn-inverse'style='float: right;  margin-right: 2%;width:19%;position:relative;padding:6px;' title='copy to clipborad'>Copy</a>"),
            $("#savebtn").show()),
        ("excel-to-html" != e && "lorem-ipsum" != e) || ($("#sampleDataBtn").hide(), $("#savebtn").hide(), $("#permalinkDiv").hide()),
        "code" != e &&
            "file-difference" != e &&
            "encrypt-decrypt" != e &&
            "credit-card-validate" != e &&
            "image-to-base64-converter" != e &&
            "date-time-calculater" != e &&
            "credit-card-fake-number-generator" != e &&
            "api-test" != e &&
            ($("#copy-dynamic1").click(function () {
                copyToClipboard("word-to-html-converter" != e ? editorAce.getValue() : $("#wordInput").text());
            }),
            $("#copy-dynamic").click(function () {
                copyToClipboard(editorResult.getValue());
            }),
            $("#copy-dynamic2").click(function () {
                copyToClipboard($("#output").val());
            }));
}
function copyToClipboard(e) {
    var t = $("<textarea>");
    $("body").append(t), t.val(e).select(), document.execCommand("copy"), t.remove(), $("#copy-note-msg").html("Copied to Clipboard."), $("#copy-note-msg").removeClass("hide"), $("#copy-note-msg").fadeIn().delay(1e4).fadeOut();
}
function createFavouriteImg() {
    $("#favToolImg").remove();
    var e = $("#isFavTool").val(),
        t = $("<i>");
    t.attr("id", "favToolImg"),
        $(t).css("cursor", "pointer"),
        t.attr("aria-hidden", !0),
        "fav" == e ? (t.addClass("icon-star-full"), t.attr("title", "make it not favourite")) : (t.addClass("icon-star-empty"), t.attr("title", "make it favourite"), 0 == e.trim().length && $("#isFavTool").val("not-fav")),
        $(t).click(function () {
            $("#notloggedin").is(":visible") ? login() : saveMyfavourite();
        }),
        $("#subTitle").append(t);
}
function saveMyfavourite() {
    $.ajax({
        url: "/service/saveFavouriteTool",
        dataType: "text",
        type: "post",
        data: { view: $("#viewName").val(), title: $("#subTitle").text(), isFav: $("#isFavTool").val() },
        success: function (e) {
            var t = "This tool added to favourite.";
            $("#favToolImg").attr("src", "../img/icons/fav.png"),
                "fav" == $("#isFavTool").val() ? ((t = "This tool remove from favourite."), $("#favToolImg").attr("src", "../img/icons/not-fav.png"), $("#isFavTool").val("not-fav")) : $("#isFavTool").val("fav"),
                $("#copy-note-msg").html(t),
                $("#copy-note-msg").removeClass("hide"),
                $("#copy-note-msg").fadeIn().delay(1e4).fadeOut();
        },
        error: function (e, t, o) {
            openErrorDialog("Failed to save favourite tool, Pls Try Again");
        },
    });
}
function isfavourite() {
    $.ajax({
        url: "/service/isFavouriteTool",
        dataType: "text",
        type: "post",
        data: { view: $("#viewName").val() },
        success: function (e) {
            $("#isFavTool").val(e), createFavouriteImg();
        },
        error: function (e, t, o) {
            console.log(e);
        },
    });
}
globalurl = "/";
function manageMenuAndSession() {
    var e = getCookie("loggedinuser"),
        t = getCookie("loggedinuserid");
    "" != e && "" != t ? ($("#usernamelable").text(e.substring(0, 5) + ".."), $("#notloggedin").hide(), $("#loggedin").show(), updateUserSession(t)) : $("#loggedin").hide();
}
function getCookie(e) {
    for (var t = e + "=", o = document.cookie.split(";"), i = 0; i < o.length; i++) {
        for (var a = o[i]; " " == a.charAt(0); ) a = a.substring(1);
        if (0 == a.indexOf(t)) return (t = a.substring(t.length, a.length)).replace(/\+/g, " ");
    }
    return "";
}
function updateUserSession(e) {
    $.ajax({ type: "post", url: "/service/updateSession", data: { id: e }, success: function (e) {} });
}
function logout() {
    (document.cookie = "loggedinuser=; expires=Thu, 01 Jan 1970 00:00:00 UTC"),
        null != getProvider() &&
            hello(getProvider())
                .logout()
                .then(
                    function () {},
                    function (e) {}
                ),
        $.ajax({
            url: "/service/logout",
            success: function (e) {
                window.location.href = "/codebeautify_redirect";
            },
        });
}
function toggleOpenClass() {
    document.getElementById("myDropdown").classList.toggle("show");
}
$(document).ready(function () {
    $(".close1").click(function () {
        $(".ui-dialog-content").dialog("destroy");
    }),
        $("#more").click(function () {
            $("html, body").animate({ scrollTop: $(".footer_container").offset().top }, 1e3);
        }),
        $("#back-top").hide(),
        $(function () {
            $(window).scroll(function () {
                $(this).scrollTop() > 100 ? $("#back-top").fadeIn() : $("#back-top").fadeOut();
            }),
                $("#back-top a").click(function () {
                    return $("body,html").animate({ scrollTop: 0 }, 800), !1;
                });
        }),
        manageMenuAndSession();
}),
    (window.onclick = function (e) {
        if (!e.target.matches(".dropbtn")) {
            var t,
                o = document.getElementsByClassName("dropdown-content");
            for (t = 0; t < o.length; t++) {
                var i = o[t];
                i.classList.contains("show") && i.classList.remove("show");
            }
        }
    }),
    (function () {
        var e = document,
            t = window;
        function o(e, o, i) {
            if (t.addEventListener) e.addEventListener(o, i, !1);
            else if (t.attachEvent) {
                e.attachEvent("on" + o, function () {
                    i.call(e, t.event);
                });
            }
        }
        var i,
            a =
                ((i = e.createElement("div")),
                function (e) {
                    i.innerHTML = e;
                    var t = i.childNodes[0];
                    return i.removeChild(t), t;
                });
        function n(e, t) {
            (function (e, t) {
                return e.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"));
            })(e, t) || (e.className += " " + t);
        }
        function r(e, t) {
            var o = new RegExp("(\\s|^)" + t + "(\\s|$)");
            e.className = e.className.replace(o, " ");
        }
        if (document.documentElement.getBoundingClientRect)
            var l = function (e) {
                var t = e.getBoundingClientRect(),
                    o = e.ownerDocument,
                    i = o.body,
                    a = o.documentElement,
                    n = a.clientTop || i.clientTop || 0,
                    r = a.clientLeft || i.clientLeft || 0,
                    l = 1;
                if (i.getBoundingClientRect) {
                    var s = i.getBoundingClientRect();
                    l = (s.right - s.left) / i.clientWidth;
                }
                return l > 1 && ((n = 0), (r = 0)), { top: t.top / l + (window.pageYOffset || (a && a.scrollTop / l) || i.scrollTop / l) - n, left: t.left / l + (window.pageXOffset || (a && a.scrollLeft / l) || i.scrollLeft / l) - r };
            };
        else
            l = function (e) {
                if (t.jQuery) return jQuery(e).offset();
                var o = 0,
                    i = 0;
                do {
                    (o += e.offsetTop || 0), (i += e.offsetLeft || 0);
                } while ((e = e.offsetParent));
                return { left: i, top: o };
            };
        var s,
            d =
                ((s = 0),
                function () {
                    return "ValumsAjaxUpload" + s++;
                });
        function c(e) {
            return e.replace(/.*(\/|\\)/, "");
        }
        function u(e) {
            return /[.]/.exec(e) ? /[^.]+$/.exec(e.toLowerCase()) : "";
        }
        (Ajax_upload = AjaxUpload = function (t, o) {
            var i;
            if (
                (t.jquery ? (t = t[0]) : "string" == typeof t && /^#.*/.test(t) && (t = t.slice(1)),
                "string" == typeof (i = t) && (i = e.getElementById(i)),
                (t = i),
                (this._input = null),
                (this._button = t),
                (this._disabled = !1),
                (this._submitting = !1),
                (this._justClicked = !1),
                (this._parentDialog = e.body),
                window.jQuery && jQuery.ui && jQuery.ui.dialog)
            ) {
                var a = jQuery(this._button).parents(".ui-dialog");
                a.length && (this._parentDialog = a[0]);
            }
            for (var n in ((this._settings = { action: "upload.php", name: "userfile", data: {}, autoSubmit: !0, responseType: !1, onChange: function (e, t) {}, onSubmit: function (e, t) {}, onComplete: function (e, t) {} }), o))
                this._settings[n] = o[n];
            this._createInput(), this._rerouteClicks();
        }),
            (AjaxUpload.prototype = {
                setData: function (e) {
                    this._settings.data = e;
                },
                disable: function () {
                    this._disabled = !0;
                },
                enable: function () {
                    this._disabled = !1;
                },
                destroy: function () {
                    this._input && (this._input.parentNode && this._input.parentNode.removeChild(this._input), (this._input = null));
                },
                _createInput: function () {
                    var t = this,
                        i = e.createElement("input");
                    i.setAttribute("type", "file"), i.setAttribute("name", this._settings.name);
                    var a = { position: "absolute", margin: "-5px 0 0 -175px", padding: 0, width: "220px", height: "30px", fontSize: "14px", opacity: 0, cursor: "pointer", display: "none", zIndex: 2147483583 };
                    for (var n in a) i.style[n] = a[n];
                    "0" !== i.style.opacity && (i.style.filter = "alpha(opacity=0)"),
                        this._parentDialog.appendChild(i),
                        o(i, "change", function () {
                            var e = c(this.value);
                            0 != t._settings.onChange.call(t, e, u(e)) && t._settings.autoSubmit && t.submit();
                        }),
                        o(i, "click", function () {
                            (t.justClicked = !0),
                                setTimeout(function () {
                                    t.justClicked = !1;
                                }, 1e3);
                        }),
                        (this._input = i);
                },
                _rerouteClicks: function () {
                    var t,
                        i = this,
                        a = { top: 0, left: 0 },
                        s = !1;
                    o(i._button, "mouseover", function (o) {
                        var n, r, d, c;
                        i._input &&
                            !s &&
                            ((s = !0), (n = i._button), (c = l(n)), (r = c.left), (d = c.top), (t = { left: r, right: r + n.offsetWidth, top: d, bottom: d + n.offsetHeight }), i._parentDialog != e.body && (a = l(i._parentDialog)));
                    }),
                        o(document, "mousemove", function (o) {
                            var l = i._input;
                            if (l && s) {
                                if (i._disabled) return r(i._button, "hover"), void (l.style.display = "none");
                                var d = (function (t) {
                                    if (!t.pageX && t.clientX) {
                                        var o = 1,
                                            i = document.body;
                                        if (i.getBoundingClientRect) {
                                            var a = i.getBoundingClientRect();
                                            o = (a.right - a.left) / i.clientWidth;
                                        }
                                        return { x: t.clientX / o + e.body.scrollLeft + e.documentElement.scrollLeft, y: t.clientY / o + e.body.scrollTop + e.documentElement.scrollTop };
                                    }
                                    return { x: t.pageX, y: t.pageY };
                                })(o);
                                d.x >= t.left && d.x <= t.right && d.y >= t.top && d.y <= t.bottom
                                    ? ((l.style.top = d.y - a.top + "px"), (l.style.left = d.x - a.left + "px"), (l.style.display = "block"), n(i._button, "hover"))
                                    : ((s = !1), i.justClicked || (l.style.display = "none"), r(i._button, "hover"));
                            }
                        });
                },
                _createIframe: function () {
                    var t = d(),
                        o = a('<iframe src="javascript:false;" name="' + t + '" />');
                    return (o.id = t), (o.style.display = "none"), e.body.appendChild(o), o;
                },
                submit: function () {
                    var t = this,
                        i = this._settings;
                    if ("" !== this._input.value) {
                        var a = c(this._input.value);
                        if (0 != i.onSubmit.call(this, a, u(a))) {
                            var n = this._createIframe(),
                                r = this._createForm(n);
                            r.appendChild(this._input), r.submit(), e.body.removeChild(r), (r = null), (this._input = null), this._createInput();
                            var l = !1;
                            o(n, "load", function (o) {
                                if ("javascript:'%3Chtml%3E%3C/html%3E';" != n.src && "javascript:'<html></html>';" != n.src) {
                                    var r = n.contentDocument ? n.contentDocument : frames[n.id].document;
                                    if (!((r.readyState && "complete" != r.readyState) || (r.body && "false" == r.body.innerHTML))) {
                                        if (r.XMLDocument) s = r.XMLDocument;
                                        else if (r.body)
                                            (s = r.body.innerHTML),
                                                i.responseType &&
                                                    "json" == i.responseType.toLowerCase() &&
                                                    (r.body.firstChild && "PRE" == r.body.firstChild.nodeName.toUpperCase() && (s = r.body.firstChild.firstChild.nodeValue), (s = s ? window.eval("(" + s + ")") : {}));
                                        else var s = r;
                                        i.onComplete.call(t, a, s), (l = !0), (n.src = "javascript:'<html></html>';");
                                    }
                                } else
                                    l &&
                                        setTimeout(function () {
                                            e.body.removeChild(n);
                                        }, 0);
                            });
                        } else e.body.removeChild(this._input), (this._input = null), this._createInput();
                    }
                },
                _createForm: function (t) {
                    var o = this._settings,
                        i = a('<form method="post" enctype="multipart/form-data"></form>');
                    for (var n in ((i.style.display = "none"), (i.action = o.action), (i.target = t.name), e.body.appendChild(i), o.data)) {
                        var r = e.createElement("input");
                        (r.type = "hidden"), (r.name = n), (r.value = o.data[n]), i.appendChild(r);
                    }
                    return i;
                },
            });
    })();
