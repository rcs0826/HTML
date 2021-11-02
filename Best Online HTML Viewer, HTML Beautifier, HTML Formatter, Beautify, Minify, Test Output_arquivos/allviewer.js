var viewname,
    editorAce,
    editorResult,
    editor,
    canvas,
    context,
    strip,
    strcountry,
    strcity,
    strregion,
    strlatitude,
    strlongitude,
    strtimezone,
    old = "",
    fileName1 = "",
    fileName2 = "",
    converted = "",
    json = "",
    isXmlData = !0,
    paragraphFlag = !1,
    oldData = "",
    highlightedText = "",
    popupStatus = 0;
function setToEditor(e) {
    if ("alleditor" == viewname) {
        if (e.trim().length > 0) {
            var t = e.lastIndexOf("|"),
                a = e.substr(t + 1, e.length);
            $("#editorLanguage").val(a), setLangauge(), editorAce.setValue(e.substr(0, t)), editorAce.clearSelection();
        }
    } else if ("api-test" == viewname) {
        var i = "text",
            r = e.type,
            o = e.body;
        null != r &&
            "error" != r &&
            0 != r &&
            0 != r.trim().length &&
            (-1 != r.search("html")
                ? ((i = "html"), (o = vkbeautify.xml(o)))
                : -1 != r.search("json")
                ? ((i = "json"), (o = vkbeautify.json(o)))
                : -1 != r.search("xml")
                ? ((i = "xml"), (o = vkbeautify.xml(o)))
                : -1 != r.search("css") && ((i = "css"), (o = cssbeautify(o, { indent: "  ", openbrace: "end-of-line", autosemicolon: !0 })))),
            createEditor(null, i),
            editorResult.setValue(e.header + "\n\n" + o),
            editorResult.clearSelection(),
            editorResult.navigateFileStart();
    } else
        "excel-to-html" == viewname
            ? htmlOutput(e)
            : "file-difference" == viewname || "xml-xsl-transform" == viewname || "xml-diff" == viewname
            ? ($("#file1").val(""), $("#file1").val(e))
            : "jsvalidate" == viewname
            ? (editorAce.setValue(e), validateJS())
            : "wordcounter" == viewname
            ? ($("#tData").val(""), $("#tData").val(e), $("#tData").focus(), countWord())
            : "Xpath-Tester" == viewname
            ? $("#xmlString").val(e)
            : "jsonpath-tester" == viewname
            ? $("#jsonString").val(e)
            : "word-to-html-converter" == viewname
            ? htmlOutput(e)
            : editorAce.setValue(e);
    "actionscript" == viewname || "csharpviewer" == viewname || "javaviewer" == viewname || "jsviewer" == viewname
        ? (FormatJS(), $("#resultDiv1").hide())
        : "css-beautify-minify" == viewname
        ? FormatCSS()
        : "minify-css" == viewname
        ? MinifyCSS()
        : "cssvalidate" == viewname
        ? validateCSS()
        : "html-to-csv-converter" == viewname
        ? htmlTocsv()
        : "htmlviewer" == viewname
        ? ($("#result").show(), $("#resultDiv1").hide(), FormatHTMLSample(), htmlOutput())
        : "mxmlviewer" == viewname
        ? FormatMXML()
        : "opml-to-json-converter" == viewname
        ? showJSON()
        : "rssviewer" == viewname
        ? FormatXML()
        : "yaml-to-json-xml-csv" == viewname
        ? yamlToJson()
        : "yaml-validator" == viewname && YAMLValidator();
}
function FormatWithOption() {
    var e = editorAce.getValue(),
        t = "";
    null != e &&
        0 != e.length &&
        ((indent_size = $("#indent").val()),
        "html-formatter-beautifier" == viewname
            ? ((t = vkbeautify.xml(e, indent_size)), setOutputMsg("Format HTML"))
            : ("python-formatter-beautifier" == viewname
                  ? setOutputMsg("Format Python")
                  : "ruby-formatter-beautifier" == viewname
                  ? setOutputMsg("Format Ruby")
                  : "perl-formatter-beautifier" == viewname
                  ? setOutputMsg("Format Perl")
                  : "c-formatter-beautifier" == viewname
                  ? setOutputMsg("Format C")
                  : "cpp-formatter-beautifier" == viewname && setOutputMsg("Format C++"),
              (t = js_beautify(e, { indent_size: indent_size, indent_char: " ", other: " ", indent_level: 0, indent_with_tabs: !1, preserve_newlines: !0, max_preserve_newlines: 2, jslint_happy: !0, indent_handlebars: !0 }))),
        ("c-formatter-beautifier" != viewname && "cpp-formatter-beautifier" != viewname) || (t = (t = replaceAll(t, "\ninclude", "include")).split("- >").join("->")),
        editorResult.setValue(t));
}
function escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(e, t, a) {
    return e.replace(new RegExp(escapeRegExp(t), "g"), a);
}
function createDownloadFile() {
    if (((content = editorResult.getValue()), null != content && "" != content && content.trim().length > 0)) {
        var e = new Blob(["" + content], { type: "text/plain;charset=utf-8" }),
            t = "";
        "python-formatter-beautifier" == viewname
            ? (t = "codebeautify.py")
            : "perl-formatter-beautifier" == viewname
            ? (t = "codebeautify.pl")
            : "ruby-formatter-beautifier" == viewname
            ? (t = "codebeautify.rb")
            : "c-formatter-beautifier" == viewname
            ? (t = "codebeautify.c")
            : "cpp-formatter-beautifier" == viewname
            ? (t = "codebeautify.cpp")
            : "html-formatter-beautifier" == viewname && (t = "codebeautify.html"),
            fileDownloadCB(e, t);
    } else openErrorDialog("Sorry Result is Empty");
}
function FormatJS() {
    editorResult.getSession().setUseWrapMode(!1);
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        var t = js_beautify(e, { indent_size: 1, indent_char: "  " });
        "actionscript" == viewname
            ? setOutputMsg("Beautify Action Script")
            : "csharpviewer" == viewname
            ? (setOutputMsg("Beautify C#"), (t = (t = t.split("= >").join("=>")).split("> =").join(">=")))
            : "javaviewer" == viewname
            ? (setOutputMsg("Beautify Java"), (t = (t = t.split("- >").join("->")).split("= >").join("=>")))
            : "jsviewer" == viewname && (setOutputMsg("Beautify Javascript"), $("#resultDiv1").hide()),
            editorResult.setValue(t);
    }
}
function MinifyJS() {
    editorResult.getSession().setUseWrapMode(!0);
    var e = editorAce.getValue();
    e.trim().length > 0 &&
        ($.ajax({
            type: "post",
            url: globalurl + "ProcessData/jsmin",
            dataType: "text",
            data: { data: e },
            success: function (e) {
                try {
                    editorResult.setValue(e);
                } catch (e) {
                    openErrorDialog("invalid Input");
                }
            },
            error: function (e, t, a) {
                openErrorDialog("Failed Minifining=" + t);
            },
        }),
        "actionscript" == viewname
            ? setOutputMsg("Minify Action Script")
            : "csharpviewer" == viewname
            ? setOutputMsg("Minify C#")
            : "javaviewer" == viewname
            ? setOutputMsg("Minify Java")
            : "jsviewer" == viewname
            ? (setOutputMsg("Minify JavaScript"), $("#resultDiv1").hide())
            : "python-formatter-beautifier" == viewname
            ? setOutputMsg("Minify Python")
            : "ruby-formatter-beautifier" == viewname
            ? setOutputMsg("Minify Ruby")
            : "perl-formatter-beautifier" == viewname
            ? setOutputMsg("Minify Perl")
            : "c-formatter-beautifier" == viewname
            ? setOutputMsg("Minify C")
            : "cpp-formatter-beautifier" == viewname && setOutputMsg("Minify C++"));
}
function setErrorToEditor(e) {
    createEditor(null, "html"), editorResult.setValue(e), editorResult.clearSelection(), editorResult.navigateFileStart();
}
function FormatCSS() {
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        editorResult.getSession().setUseWrapMode(!1);
        var t = cssbeautify(e, { indent: "  ", openbrace: "end-of-line", autosemicolon: !0 });
        editorResult.setValue(t), editorResult.getSession().setUseWrapMode(!1), setOutputMsg("Beautify CSS");
    }
}
function MinifyCSS() {
    editorResult.getSession().setUseWrapMode(!0);
    var e = editorAce.getValue();
    e.trim().length > 0 &&
        ($.ajax({
            type: "post",
            url: globalurl + "ProcessData/cssmin",
            dataType: "text",
            data: { data: e },
            success: function (e) {
                try {
                    editorResult.getSession().setUseWrapMode(!0), editorResult.setValue(e);
                } catch (e) {
                    openErrorDialog("invalid CSS");
                }
            },
            error: function (e, t, a) {
                openErrorDialog("Failed Minifining=" + t);
            },
        }),
        setOutputMsg("Minify CSS"));
}
function gotoCSSValidator() {
    var e = editorAce.getValue(),
        t = $('<form action="/cssvalidate/" method="post"><input type="text" name="value" value="' + e.trim() + '" /></form>');
    $("body").append(t), $(t).submit();
}
function validateCSS() {
    if (editorAce.getValue().length > 0) {
        (results = CSSLint.verify(editorAce.getValue())), (messages = results.messages);
        var e = new Array();
        try {
            $.each(messages, function (t, a) {
                e[t] = [t + 1, validate(a.type), validate(a.line), validate(a.col), validate(a.rule.name), validate(a.evidence) + "<br>" + validate(a.message), validate(a.rule.desc), validate(a.rule.browsers)];
            });
        } catch (e) {
            console.log(e);
        }
        drawErrorTableCSS(e);
    } else $("#hResult").addClass("hide");
}
function validate(e) {
    return null == e || null == e || "" == e ? "" : e;
}
function drawErrorTableCSS(e) {
    $("#hResult").removeClass("hide"),
        $("#cssValidateErrorTable").dataTable({
            bRetrieve: !1,
            bDestroy: !0,
            bPaginate: !0,
            bJQueryUI: !0,
            aaSorting: [[0, "asc"]],
            aaData: e,
            oLanguage: { sEmptyTable: "No Error Found,Its Perfect CSS Code" },
            aoColumns: [
                { sTitle: "No.", bVisible: !0, sWidth: "3%" },
                { sTitle: "Type", bVisible: !0 },
                { sTitle: "Line", bVisible: !0, sWidth: "3%" },
                { sTitle: "Column", bVisible: !0, sWidth: "3%" },
                { sTitle: "Title", bVisible: !0 },
                { sTitle: "Description", bVisible: !0 },
                { sTitle: "Rules", bVisible: !0 },
                { sTitle: "Browser", bVisible: !0 },
            ],
        }),
        ($.fn.dataTableExt.sErrMode = "mute");
}
function FormatCSS_JS() {
    var e = "";
    e = 0 != $("#cssData").length ? "cssData" : "jsData";
    var t = $("#" + e).val();
    if (t.trim().length > 0) {
        var a = cssbeautify(t, { indent: "  ", openbrace: "end-of-line", autosemicolon: !0 });
        $("#" + e).val(""), $("#" + e).val(a);
    }
}
function clearCSS() {
    $("#cssData").val(""), $("#hResult").addClass("hide");
}
function calculateDiff() {
    $("#summary").show();
    var e = $("#sm").val() + "/" + $("#sd").val() + "/" + $("#sy").val(),
        t = $("#em").val() + "/" + $("#ed").val() + "/" + $("#ey").val();
    if (10 == e.trim().length)
        if (10 == t.trim().length) {
            if (checkdate(e, "start") && checkdate(t, "end")) {
                var a = new Date(e),
                    i = new Date(t),
                    r = "",
                    o = "";
                a > i ? ((o = "<div class='span12 impwarning'><b>Important : </b>The Start date was after the End date, so the Start and End fields were <b>SWAPPED</b>.</div>"), (r = fullYMD(i, a))) : (r = fullYMD(a, i));
                var l = Math.round(Math.abs((a.getTime() - i.getTime()) / 864e5)),
                    s = l,
                    n = Math.floor(l / 7),
                    d = Math.floor(l / 30),
                    u = Math.floor(l / 365),
                    c = 86400 * l,
                    m = 1440 * l,
                    h = 24 * l,
                    p = "";
                (p += "<div class='span12'>"),
                    (p += o),
                    (p += "<div class='span12 outputs' style='margin: 0;'><h1>Your Result</h1>"),
                    (p += "<div class='span6' style='margin: 0;'><h4>From Date : <b>" + a.toDateString() + "</b></h4>"),
                    (p += "<h4>To Date, But not Include  : <b>" + i.toDateString() + "</b></h4></div>"),
                    (p += "<div class='span6' ><ul style='list-style-type: circle;'>"),
                    (p += "<li>" + u + " <b>Years</b></li>"),
                    (p += "<li>" + d + " <b>Months</b></li>"),
                    (p += "<li>" + s + " <b>Days</b></li>"),
                    (p += "<li>" + n + " <b>Weeks(Approx.)</b></li>"),
                    (p += "<li>" + h.toString().replace(/(\d)(?=(\d{3})+\b)/g, "$1,") + " <b>Hours</b></li>"),
                    (p += "<li>" + m.toString().replace(/(\d)(?=(\d{3})+\b)/g, "$1,") + " <b>Minutes</b></li>"),
                    (p += "<li>" + c.toString().replace(/(\d)(?=(\d{3})+\b)/g, "$1,") + " <b>Seconds</b></li>"),
                    (p += "</div></table></div>"),
                    $("#summary").html(""),
                    $("#summary").append(p).fadeIn("slow"),
                    $("#summary").append("<div class='span12 summurize_info impwarning'>" + r + "</div></div>"),
                    $(".bugs_error").css("display", "none");
            }
        } else $("#summary").html(""), $("#summary").hide(), $(".bugs_error").html("Please enter the End date <span class='close_err'>X</span>"), $(".bugs_error").css("display", "block"), $(".bugs_error").css("opacity", 1);
    else $("#summary").html(""), $("#summary").hide(), $(".bugs_error").html("Please enter the Start date <span class='close_err'>X</span>"), $(".bugs_error").css("display", "block"), $(".bugs_error").css("opacity", 1);
}
function masking(e) {
    var t = e.value;
    (null !== t.match(/^\d{2}$/) || null !== t.match(/^\d{2}\/\d{2}$/)) && (e.value = t + "/");
}
function checkdate(e, t) {
    var a = !1,
        i = "Start Date";
    if (("end" == t && (i = "End Date"), /^\d{2}\/\d{2}\/\d{4}$/.test(e))) {
        var r = e.split("/")[0],
            o = e.split("/")[1],
            l = e.split("/")[2],
            s = new Date(l, r - 1, o);
        s.getMonth() + 1 != r || s.getDate() != o || s.getFullYear() != l
            ? ($("#summary").html(""),
              $("#summary").hide(),
              $(".bugs_error").html("Invalid " + i + " Format. Enter DD/MM/YYYY Format<span class='close_err'>X</span>"),
              $(".bugs_error").css("display", "block"),
              $(".bugs_error").css("opacity", 1))
            : (a = !0),
            0 == a && $("#" + e).focus();
    } else
        $("#summary").html(""), $("#summary").hide(), $(".bugs_error").html("Invalid " + i + " Format. Enter DD/MM/YYYY Format<span class='close_err'>X</span>"), $(".bugs_error").css("display", "block"), $(".bugs_error").css("opacity", 1);
    return a;
}
function autoAddZero(e) {
    e.value.indexOf("_") >= 0 && (e.value = "0" + e.value);
}
function fullYMD(e, t) {
    t = t ? new Date(t) : new Date();
    var a = [],
        i = ((e = new Date(e)), [t.getFullYear(), e.getFullYear()]),
        r = i[0] - i[1],
        o = [t.getMonth(), e.getMonth()],
        l = o[0] - o[1],
        s = [t.getDate(), e.getDate()],
        n = s[0] - s[1];
    return (
        (l < 0 || (0 === l && n < 0)) && --r,
        l < 0 && (l += 12),
        n < 0 && (e.setMonth(o[1] + 1, 0), (n = e.getDate() - s[1] + s[0]), --l),
        r > 0 && a.push(r + " year" + (r > 1 ? "s " : " ")),
        l > 0 && a.push(l + " month" + (l > 1 ? "s" : "")),
        n > 0 && a.push(n + " day" + (n > 1 ? "s" : "")),
        a.length > 1 && a.splice(a.length - 1, 0, " and "),
        a.join("")
    );
}
function performShowHideToHtml(e) {
    null == e && (e = "editor"),
        $("#" + e).hasClass("hide")
            ? ($("#" + e).removeClass("hide"),
              $("#result1").addClass("hide"),
              $("#showHideBtn").val("Show Output"),
              "csv-to-html-converter" !== $("#viewName").val().toLowerCase() && "tsv-to-html-converter" !== $("#viewName").val().toLowerCase() && editorAce.setValue($("#excelToHtmlData").text()))
            : ($("#result1").removeClass("hide"), $("#" + e).addClass("hide"), $("#showHideBtn").val("Show HTML"));
}
function htmlOutput(e) {
    var t = "excelToHtmlData";
    "word-to-html-converter" == $("#viewName").val() && (t = "wordToHtmlData"), $("#" + t).text("");
    var a = e;
    if (("htmlviewer" == viewname && ($("#result").hide(), $("#resultDiv1").show(), (a = editorAce.getValue()), setOutputMsg("HTML Output")), a.trim().length > 0)) {
        var i = document.getElementById("result1").contentWindow.document;
        if (old != a) {
            var r = "<!DOCTYPE html><html>\n";
            (r += '<head><meta charset="UTF-8"><title>Excel To HTML using codebeautify.org</title></head>\n'),
                (r += "<body>\n"),
                (r += a),
                (r += "\n</body>\n"),
                (r += "</html>"),
                "htmlviewer" != viewname ? $("#" + t).text(vkbeautify.xml(r)) : $("#" + t).text(vkbeautify.xml(a)),
                (old = a),
                i.open(),
                "htmlviewer" == viewname ? i.write(old) : i.write("<center>" + old + "</center>"),
                i.close();
        }
        $("html, body").animate({ scrollTop: 0 }, 10);
    }
}
function clear12(e) {
    $("#" + e).val(""), $("#transformResultDiv").addClass("hide"), $("#transformResult").html(""), $("#transformResultHtml").val("");
}
function setToEditor2(e) {
    $("#file2").val(""), $("#file2").val(e);
}
function setFileName(e, t) {
    1 == e ? (fileName1 = t) : (fileName2 = t);
}
function htmlTocsv(e, t) {
    var a = editorAce.getValue();
    e && (a = t);
    try {
        if (null != a && 0 != a.trim().length) {
            $("#templTableDiv").html(a.replace(/<script/gim, "<xxxxx"));
            var i = [],
                r = "";
            if (
                ($("#templTableDiv table th").each(function () {
                    i.push($(this).text());
                }),
                $("#templTableDiv table tr").each(function (e) {
                    var t = [];
                    $(this)
                        .find("td")
                        .each(function (e) {
                            t.push($(this).text());
                        }),
                        (r += t.join() + "\n");
                }),
                null != e)
            )
                return i.join() + r;
            editorResult.setValue(i.join() + r), setOutputMsg("HTML TO CSV");
        }
    } catch (e) {
        console.log(e), editorResult.setValue("Error To  Converting CSV");
    }
}
function FormatHTML() {
    $("#result").show(), $("#resultDiv1").hide();
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        editorResult.getSession().setUseWrapMode(!1);
        var t = vkbeautify.xml(e);
        (t = addIndent(t)), editorResult.setValue(t), setOutputMsg("Beautify HTML");
    }
}
function FormatHTMLSample() {
    var e;
    (e = editorAce.getValue()).trim().length > 0 && ((e = addIndent((e = vkbeautify.xml(e)))), editorAce.setValue(e));
}
function addIndent(e) {
    if ($("#sel1").length > 0) {
        for (var t = $("#sel1").val(), a = "", i = 0; i < t; i++) a += "\t";
        var r = e.split("\n"),
            o = [];
        $.each(r, function (e, t) {
            o.push(a + t);
        }),
            (e = o.join("\n"));
    }
    return e;
}
function MinifyHTML() {
    $("#result").show(), $("#resultDiv1").hide();
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        editorResult.getSession().setUseWrapMode(!0);
        var t = vkbeautify.xmlmin(e);
        editorResult.setValue(t), setOutputMsg("Compact/Minify HTML");
    }
}
function validateJS() {
    if (editorAce.getValue().length > 0) {
        var e = new Array();
        JSLINT(editorAce.getValue());
        var t = JSLINT.data();
        try {
            $.each(t.errors, function (t, a) {
                null != a && (e[t] = [t + 1, validate(a.line), validate(a.character), validate(a.reason) + "<br>" + validate(a.evidence)]);
            });
        } catch (e) {
            console.log(e);
        }
        drawErrorTableJS(e);
    } else $("#hResult").addClass("hide");
}
function drawErrorTableJS(e) {
    $("#hResult").removeClass("hide"),
        $("#jsValidateErrorTable").dataTable({
            bRetrieve: !1,
            bDestroy: !0,
            bPaginate: !0,
            bJQueryUI: !0,
            aaSorting: [[0, "asc"]],
            aaData: e,
            oLanguage: { sEmptyTable: "No Error Found,Its Perfect JS Code" },
            aoColumns: [
                { sTitle: "No.", bVisible: !0, sWidth: "5%" },
                { sTitle: "Line", bVisible: !0, sWidth: "5%" },
                { sTitle: "Character", bVisible: !0, sWidth: "5%" },
                { sTitle: "Description", bVisible: !0 },
            ],
        }),
        ($.fn.dataTableExt.sErrMode = "mute");
}
function clearJS() {
    $("#jsData").val(""), $("#hResult").addClass("hide");
}
function obfuscatorJS(e) {
    e.trim().length > 0 &&
        ($("#resultDiv1").hide(),
        $.ajax({
            type: "post",
            url: globalurl + "ProcessData/jsobfuscator",
            dataType: "text",
            data: { data: e },
            success: function (e) {
                try {
                    editorResult.setValue(e);
                } catch (e) {
                    openErrorDialog("invalid Javascript");
                }
            },
            error: function (e, t, a) {
                openErrorDialog("Failed Minifining=" + t);
            },
        }));
}
function jsOutput() {
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        $("#result").hide(), $("#resultDiv1").show(), $("#result1").show();
        var t = document.getElementById("result1").contentWindow.document;
        old != e && (e.match(/<script[\s\S]*?>[\s\S]*?<\/script>/g) || (e = "<script>" + e + "</script>"), (old = e), t.open(), t.write(old), t.close()), $("html, body").animate({ scrollTop: 0 }, 10), setOutputMsg("Javascript Output");
    }
}
function performJS(e) {
    var t = editorAce.getValue();
    if (t.trim().length > 0)
        if (detectHtmlTags(t)) {
            if (void 0 === jQuery.ui) return void loadJqueryUI(performJS, e);
            $("<div></div>")
                .appendTo("#openError")
                .html("<div>Do you want to remove html tags..?</h5></div>")
                .dialog({
                    modal: !0,
                    title: "Message",
                    zIndex: 1e4,
                    autoOpen: !0,
                    width: "400",
                    resizable: !1,
                    buttons: {
                        Yes: function () {
                            $("#openError").html(""), callbackJS(e, !0, t), $(this).dialog("destroy");
                        },
                        No: function (a, i) {
                            callbackJS(e, !1, t), $(this).dialog("destroy");
                        },
                    },
                });
        } else callbackJS(e, !1, t);
}
function detectHtmlTags(e) {
    var t = new RegExp(
        "</?(?:article|aside|bdi|command|details|dialog|summary|figure|figcaption|footer|header|hgroup|mark|meter|nav|progress|ruby|rt|rp|section|time|wbr|audio|video|source|embed|track|canvas|datalist|keygen|output|!--|!DOCTYPE|a|abbr|address|area|b|base|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|dd|del|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|hr|html|i|iframe|img|input|ins|kdb|keygen|label|legend|li|link|map|menu|meta|noscript|object|ol|optgroup|option|p|param|pre|q|s|samp|select|small|source|span|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|u|ul|var|acronym|applet|basefont|big|center|dir|font|frame|frameset|noframes|strike|tt)(?:(?: [^<>]*)>|>?)",
        "i"
    );
    return console.log(e.match(t)), !!e.match(t);
}
function callbackJS(e, t, a) {
    $("#result").show(),
        $("#result1").hide(),
        1 == t && (a = getjs(a)).trim().length < 1 && openErrorDialog("Pls Check the input html tags placed in between javascript code,if want perform click on 'No'"),
        "beautify" == e ? FormatJS(a) : "minify" == e ? MinifyJS(a) : "obfuscator" == e && obfuscatorJS(a);
}
function getjs(e) {
    for (var t, a = /<script.*?>([\s\S]*?)<\/script>/gim, i = ""; (t = a.exec(e)); ) console.log(t[1]), (i += t[1]);
    return i;
}
function gotoJSValidator() {
    var e = editorAce.getValue();
    showProgress(),
        $.ajax({
            type: "post",
            url: globalurl + "ProcessData/jsmin",
            dataType: "text",
            data: { data: e },
            success: function (e) {
                try {
                    var t = document.createElement("form");
                    t.setAttribute("method", "post"), t.setAttribute("action", "/jsvalidate/");
                    var a = document.createElement("input");
                    a.setAttribute("type", "text"), a.setAttribute("name", "value"), a.setAttribute("value", e), t.appendChild(a), $("body").append(t), $(t).submit();
                } catch (e) {
                    openErrorDialog("invalid JS"), hideProgress();
                }
            },
            error: function (e, t, a) {
                hideProgress();
            },
        });
}
function FormatMXML() {
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        var t = vkbeautify.xml(e);
        editorResult.setValue(t), setOutputMsg("Beautify MXML");
    }
}
function MinifyMXML() {
    editorResult.getSession().setUseWrapMode(!0);
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        var t = vkbeautify.xmlmin(vkbeautify.xml(e));
        editorResult.setValue(t), setOutputMsg("Minify MXML");
    }
}
function showJSON() {
    isXmlData = !1;
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        $("#json").show(), $("#xml").hide(), $("#result").show(), $("#result1").hide();
        try {
            if ("undefined" == typeof X2JS)
                return void $.loadScript("https://cdnjs.cloudflare.com/ajax/libs/x2js/1.2.0/xml2json.min.js", function () {
                    showJSON();
                });
            var t = new X2JS();
            null != typeof editorResult && editorResult.setValue(vkbeautify.json(JSON.stringify(t.xml_str2json(e)))), null != typeof editor && (editor.setMode("code"), editor.set(t.xml_str2json(e))), setOutputMsg("OPML to JSON");
        } catch (e) {
            0 != "".length && openErrorDialog("invalid OPML");
        }
    }
}
function FormatXML() {
    editorResult.getSession().setUseWrapMode(!1), (isXmlData = !0), editorResult.getSession().setMode("ace/mode/xml"), $("#json").hide(), $("#xml").show(), $("#result").show(), $("#result1").hide();
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        var t = vkbeautify.xml(e);
        "rssviewer" == viewname ? ($("#json").hide(), $("#result1").show(), editorAce.setValue(t), editorAce.getSession().setUseWrapMode(!1)) : (editorResult.setValue(t), setOutputMsg("Beautify OPML"));
    }
}
function createOPML2JSONFile() {
    var e = editor.getText();
    if (e.trim().length > 0) {
        var t = e.indexOf(":"),
            a = e.substring(t + 1, e.length - 1),
            i = JSON.parse(a),
            r = new Blob(["" + vkbeautify.json(i)], { type: "text/plain;charset=utf-8" });
        fileDownloadCB(r, "codebeautify.json");
    } else openErrorDialog("Sorry Result is Empty..");
}
function createOPMLFile() {
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        var t = "";
        if (null != (t = $("#result1").is(":visible") ? vkbeautify.xml(e) : editorResult.getValue()) && "" != t && t.trim().length > 0) {
            var a = new Blob(["" + t], { type: "text/plain;charset=utf-8" }),
                i = "codebeautify.opml";
            0 == isXmlData && (i = "codebeautify.json"), fileDownloadCB(a, i);
        } else openErrorDialog("Sorry Result is Empty");
    }
}
function processRSS(e) {
    (e = $.parseXML(e)),
        $("#result1").empty(),
        $(e)
            .find("item")
            .each(function () {
                var e = $(this),
                    t = e.find("title").text(),
                    a = e.find("link").text(),
                    i = e.find("description").text(),
                    r = '<div style="margin-bottom:8px;">';
                (r += "<h3>" + t + "</h3>"), (r += "<em>" + e.find("pubDate").text() + "</em>"), (r += "<p>" + i + "</p>"), (r += '<a href="' + a + '" target="_blank">Read More</a>'), (r += "</div>"), $("#result1").append(r);
            });
}
function htmlView() {
    $("#json").hide(), $("#result1").show();
    var e = editorAce.getValue();
    null != e && e.trim().length > 0 && processRSS(e), setOutputMsg("HTML View");
}
function defaultAction() {}
function ConvertJSON() {
    try {
        var e = editorAce.getValue();
        if (null != e && e.trim().length > 0) {
            if ((setOutputMsg("XML to JSON"), $("#json").show(), $("#result1").hide(), "undefined" == typeof X2JS))
                return void $.loadScript("https://cdnjs.cloudflare.com/ajax/libs/x2js/1.2.0/xml2json.min.js", function () {
                    ConvertJSON();
                });
            var t = new X2JS().xml_str2json(e);
            editorResult.getSession().setMode("ace/mode/json"), editorResult.setValue(vkbeautify.json(JSON.stringify(t))), editorResult.clearSelection(), editorResult.getSession().setScrollTop(1);
        }
    } catch (e) {
        openErrorDialog("invalid XML");
    }
}
function view() {
    var e = $("#url").val();
    e.length > 5 &&
        (-1 == e.search("codebeautify.org")
            ? $.ajax({
                  type: "post",
                  url: "//codebeautify.com/URLService",
                  dataType: "text",
                  data: { path: e },
                  success: function (e) {
                      editorAce.setValue(decodeSpecialCharacter(e)), editorAce.getSession().setScrollTop(0);
                  },
                  error: function (e, t, a) {
                      openErrorDialog("Failed to load data=" + t);
                  },
              })
            : openErrorDialog("Access Denied for " + e));
}
function keywordDensity() {
    if ($("#tData").val().trim().length > 0) {
        var e = "";
        $.wordStats.computeTopWords(1e5, $("#tData")), (totalWeights = getTotalWeights($.wordStats.topWeights));
        var t,
            a = "<table>";
        e = "<table cellPadding='5'>";
        for (i = 0; i < $.wordStats.topWords.length; i++)
            (t = (($.wordStats.topWeights[i] / totalWeights) * 100).toFixed(0)),
                i < 10 && (a += "<tr><td><span><a>" + $.wordStats.topWords[i] + "</a></span> " + $.wordStats.topWeights[i] + " (" + t + "%)</td></tr>"),
                (e +=
                    "<tr><td><a title='Search " +
                    $.wordStats.topWords[i] +
                    "' onclick=searchSelectedTextFromdialog('" +
                    $.wordStats.topWords[i] +
                    "')>" +
                    $.wordStats.topWords[i] +
                    "</a></td> <td> " +
                    $.wordStats.topWeights[i] +
                    "</td> <td> (" +
                    t +
                    "%)</td></tr>");
        $.wordStats.topWords.length > 10 && (a += "<tr><td><a class='btn btn-danger' onclick=moreKeywordDialog();>More<a></td></tr>"),
            (a += "</table>"),
            (e += "</table>"),
            $.wordStats.clear(),
            $("#keyword").html(""),
            $("#tempDiv").html(""),
            $("#keyword").append(a),
            $("#tempDiv").append(e);
    }
}
function moreKeywordDialog() {
    void 0 !== jQuery.ui
        ? $("#tempDiv").dialog({
              modal: !0,
              title: "Keyword Density",
              zIndex: 1e4,
              autoOpen: !0,
              width: "400",
              height: "400",
              resizable: !1,
              buttons: {
                  Ok: function () {
                      $("#openError").html(""), $(this).dialog("destroy");
                  },
              },
              close: function (e, t) {
                  $("#openError").html(""), $(this).dialog("destroy");
              },
          })
        : loadJqueryUI(moreKeywordDialog);
}
function paragraphcounter() {
    var e = $("#tData").val();
    if (e.trim().length > 0) {
        for (var t = (e = e.split("\n\n")).length, a = 0; t >= 0; ) {
            var i = e[--t];
            (i = i ? i.replace("/s+/gi", "") : i) && i.length > 1 && a++;
        }
        $("#paragraph_count").val(a);
    }
}
function ChangeCase() {
    var e = $("#caseSelect").val();
    0 == e
        ? ($("#tData").val(""), $("#tData").val(oldData))
        : 1 == e
        ? ($("#tData").val(""), $("#tData").val(oldData.toUpperCase()))
        : 2 == e
        ? ($("#tData").val(""), $("#tData").val(oldData.toLowerCase()))
        : 3 == e && ($("#tData").val(""), $("#tData").val(oldData.toProperCase())),
        $("#tData").highlightTextarea("enable"),
        $("#tData").highlightTextarea("setWords", highlightedText);
}
function countWord(e) {
    null != e && (paragraphFlag = e);
    var t = $("#tData").val();
    null != t && t.trim().length > 0
        ? ((oldData = t),
          Countable.on(
              document.getElementById("tData"),
              function (e) {
                  $("#counter").text(e.words + " words " + e.all + " characters(with space)"), $("#character_count").val(e.characters), $("#character_count_space").val(e.all), $("#word_count").val(e.words);
                  var a = t.split(/[.?!](?=\s|\n)/).length;
                  $("#sentence_count").val(a), $("#avg_sentence_length").val(Math.ceil(e.words / a)), $("#paragraph_count").val(e.paragraphs);
              },
              { hardReturns: paragraphFlag, stripTags: !1 }
          ),
          keywordDensity())
        : ((oldData = ""),
          $("#character_count").val(0),
          $("#character_count_space").val(0),
          $("#word_count").val(0),
          $("#sentence_count").val(0),
          $("#avg_sentence_length").val(0),
          $("#paragraph_count").val(0),
          $("#keyword").html(""),
          $("#tempDiv").html(""),
          $("#counter").text("0 words 0 characters(with space)"));
}
function findWord() {
    var e = $("#wordsearch").val();
    if (null != e && e.trim().length > 0) {
        var t = $("#tData").val();
        if (null != t && t.trim().length > 0) {
            (highlightedText = t), $("#tData").highlightTextarea("enable"), $("#tData").highlightTextarea("setWords", e), (t = t.toLowerCase()), (e = e.toLowerCase());
            var a = t.split(e);
            $("#wordSearchcount").text(a.length - 1 + "/" + $("#word_count").val());
        }
    } else $("#wordSearchcount").text(""), $("#tData").highlightTextarea("disable");
}
function searchSelectedTextFromdialog(e) {
    $("#tempDiv").dialog("destroy"), $("#wordsearch").val(e), $("#wordsearch").focus();
}
function getTotalWeights(e) {
    var t = 0;
    return (
        $.each(e, function () {
            t += this;
        }),
        t
    );
}
function clearall() {
    $("#xmlString").val(""), $("#xmlUrl").val(""), $("#xpath").val("");
}
function xpath1() {
    $("html, body").animate({ scrollTop: 0 }, 1e3), editorResult.setValue(""), $("#hResult").hide(), $("#closemsg").hide();
    var e = $("#xmlString").val(),
        t = /:/g,
        a = /-/g;
    e = e.replace(t, "-");
    var i = $.parseXML(e),
        r = $("#xpath").val(),
        o = ((r = r.replace(t, "-")).split("/"), "");
    try {
        var l = i.evaluate(r, i, null, XPathResult.ANY_TYPE, null);
        if (1 == l.resultType) o = parseFloat("" + l.numberValue).toFixed(1) + "\n";
        else if (2 == l.resultType) o = l.stringValue;
        else {
            for (var s = [], n = l.iterateNext(); null != n; n = l.iterateNext()) s.push(n);
            0 == s.length
                ? (o = "No Match!")
                : $(s).each(function (e, t) {
                      9 == t.nodeType
                          ? (o =
                                null == t.doctype
                                    ? "Document : No DOCTYPE Declaration, Root is [Element :<" + t.documentElement.nodeName + "/>]"
                                    : "Document : [DocType: <!DOCTYPE " + t.doctype.nodeName + ">], Root is [Element : <" + t.documentElement.nodeName + "/>]")
                          : 1 == t.nodeType
                          ? (o = 1 == r.indexOf("*") ? t.outerHTML : (o += t.outerHTML + "\n").replace(a, ":"))
                          : 2 == t.nodeType
                          ? (o = (o += t.nodeName + '="' + t.nodeValue + '"\n').replace(a, ":"))
                          : 3 == t.nodeType && null != t.nodeValue
                          ? (o += "Text = " + t.nodeValue + "\n")
                          : 3 == t.nodeType && null == t.nodeValue && (o = "NO MATCH!");
                  });
        }
        setOutputMsg("Generated XPath"), editorResult.setValue(o);
    } catch (e) {
        console.log(e.message);
        var d = e.message.split(":");
        $("#closemsg").show(), $("#hResult").show(), $("#hResult").html(e.name + ":" + d[1]);
    }
}
function validateYaml(e) {
    var t = editorAce.getValue();
    if (t.trim().length > 0)
        try {
            if (((data = YAML.parse(t)), setOutputMsg("YAML Valid"), (converted = "validate"), null != e && e)) return editor.setMode("text"), void editor.set("YAML IS VALID");
            editorResult.getSession().setMode("ace/mode/json"), editorResult.setValue("YAML IS VALID");
        } catch (t) {
            var a = "";
            (a = a + "Error : " + t.message), (a = (a += "\n") + "Line : " + t.parsedLine + "  " + t.snippet), setOutputMsg("Invalid YAML"), e && (editor.setMode("text"), editor.set(a)), editorResult.setValue(a);
        }
}
function yamlToJson(e) {
    var t = editorAce.getValue();
    if (t.trim().length > 0)
        try {
            if (((data = YAML.parse(t.trim())), null != e && e)) return data;
            (converted = "json"), editorResult.getSession().setMode("ace/mode/json"), editorResult.setValue(vkbeautify.json(data)), setOutputMsg("YAML TO JSON");
        } catch (t) {
            var a = "";
            (a = a + "Error : " + t.message), (a = (a += "\n") + "Line : " + t.parsedLine + "  " + t.snippet), setOutputMsg("Invalid YAML"), null != e && e && (editor.setMode("text"), editor.set(a)), editorResult.setValue(a);
        }
}
function showYAML() {
    var e = yamlToJson(!0);
    console.log(JSON.stringify(e));
    var t = { array: jsonlint.parse(JSON.stringify(e)) };
    editor.setMode("tree"), editor.set(t), editor.expandAll(), setOutputMsg("YAML Tree Viewer");
}
function FormatYAML() {
    editor.setMode("text");
    var e = yamlToJson(!0);
    (e = json2yaml(e)), editor.set(YAML.stringify(e)), setOutputMsg("Beautify YAML");
}
function MinifyYAML() {
    editor.setMode("text");
    var e = editorAce.getValue();
    editor.set(e.replace(/\s+/g, "")), console.log(e.replace(/\s+/g, "")), setOutputMsg("Minify YAML");
}
function yamlToxml() {
    editorResult.getSession().setMode("ace/mode/xml");
    var e = editorAce.getValue();
    if (e.trim().length > 0)
        try {
            data = YAML.parse(e.trim());
            var t,
                a = new XML.ObjTree().writeXML(data);
            a = decodeSpecialCharacter(a);
            try {
                t = $.parseXML(a);
            } catch (e) {
                t = !1;
            }
            0 == t && (a = a.substr(0, 39) + "<root>" + a.substr(39) + "</root>"), editorResult.setValue(vkbeautify.xml(a)), (converted = "xml"), setOutputMsg("YAML TO XML");
        } catch (e) {
            var i = "";
            (i = i + "Error : " + e.message), (i = (i += "\n") + "Line : " + e.parsedLine + "  " + e.snippet), editorResult.setValue(i), setOutputMsg("Invalid YAML");
        }
}
function yamlTocsv() {
    var e = editorAce.getValue();
    if (e.trim().length > 0) {
        data = YAML.parse(e);
        var t,
            a = new XML.ObjTree().writeXML(data);
        a = decodeSpecialCharacter(a);
        try {
            t = $.parseXML(a);
        } catch (e) {
            t = !1;
        }
        0 == t && (a = a.substr(0, 39) + "<root>" + a.substr(39) + "</root>"),
            $.ajax({
                type: "post",
                url: globalurl + "convter",
                data: { type: "xml2csv", data: a },
                success: function (e) {
                    editorResult.getSession().setMode("ace/mode/text"), editorResult.setValue(e), (converted = "csv"), setOutputMsg("YAML TO CSV");
                },
                error: function (e) {
                    openErrorDialog("Failed to Convert into CSV");
                },
            });
    }
}
function YAMLValidator() {
    var e = editorAce.getValue();
    if (null != e && 0 != e.trim().length)
        try {
            (e = YAML.parse(e)), $("#hResult").show(), $("#hResult").removeClass(), $("#hResult").addClass("success"), $("#editor").css({ border: "1px solid #C6D880" }), $("#hResult").text("Valid YAML");
        } catch (e) {
            var t = "";
            (t = t + "Error : " + e.message),
                (t = (t += "\n") + "Line : " + e.parsedLine + "  " + e.snippet),
                $("#hResult").show(),
                $("#editor").css({ border: "1px solid #FBC2C4" }),
                $("#hResult").removeClass(),
                $("#hResult").addClass("error"),
                $("#hResult").text(t);
        }
    else $("#editor").css({ border: "1px solid #BCBDBA" }), $("#hResult").hide();
}
function clearYAML() {
    editorAce.setValue(""), $("#hResult").hide();
}
function loadPopup() {
    0 == popupStatus && ($(".openPhotoDiv").fadeIn(320), $("#backgroundPopup").css("opacity", "0.7"), $("#backgroundPopup").fadeIn(1), (popupStatus = 1));
}
function disablePopup() {
    1 == popupStatus && ($(".openPhotoDiv").fadeOut("normal"), $("#backgroundPopup").fadeOut("normal"), (popupStatus = 0));
}
function time1() {
    var e = new Date().toString();
    $("#timer123").html("<b>Time:</b> " + e.replace(/GMT.*/g, ""));
}
function whether(e) {
    $(".weather-temperature").openWeather({
        city: e,
        descriptionTarget: ".weather-description",
        windSpeedTarget: ".weather-wind-speed",
        minTemperatureTarget: ".weather-min-temperature",
        maxTemperatureTarget: ".weather-max-temperature",
        humidityTarget: ".weather-humidity",
        sunriseTarget: ".weather-sunrise",
        sunsetTarget: ".weather-sunset",
        placeTarget: ".weather-place",
        iconTarget: ".weather-icon",
        customIcons: "/img/icons/weather/",
        success: function () {
            $(".weather-wrapper").show(), $("#spinner2").remove();
        },
    });
}
function LoadNewsBar(e) {
    var t = { largeResultSet: !0, autoExecuteList: { executeList: new Array(e) } };
    new GSnewsBar(document.getElementById("newsBar-bar"), t),
        setInterval(function () {
            document.getElementById("newsBar-bar");
            for (var e = document.getElementsByTagName("a"), t = 0; t < e.length; t++) $(".gs-title").attr("target", "_blank");
        }, 300);
}
function GetUserInfo(e) {
    (strip = e.ip), (strcountry = e.country), (strcity = e.city), (strregion = e.region), (strlatitude = e.latitude), (strlongitude = e.longitude), (strtimezone = e.timezone);
}
function BindUserInfo() {
    $("#ip").html("<b>Your IP : </b>" + strip),
        $("#Country").html("<b>Country Name</b>: " + strcountry),
        $("#city").html("<b>City</b>: " + strcity),
        $("#newsfeedtext").text("Latest News | " + strcity),
        $("#currencyCode").html("<b>State</b>: " + strregion),
        $("#spinner1").remove(),
        $("#weatherinformation").text(strcity + "  |  Weather "),
        whether(strcity),
        LoadNewsBar(strcity);
}
function tweet(e) {
    $.ajax({ url: "/service/postTextToTwitter", type: "post", data: { tweet: $("#tweet").val(), imgflag: e, img_data: canvas.toDataURL() } }).done(function (e) {
        "success" == e ? ($("#tweet").val(""), openErrorDialog("Hurrey,Your Big Tweet Successfully Done")) : openErrorDialog("Sorry There is some problem Please Try Again.");
    });
}
function TwitterLogin() {
    void 0 !== jQuery.ui ? $("#tweetLogin").dialog({ modal: !0, title: "Login", zIndex: 1e4, autoOpen: !0, width: "400", resizable: !1 }) : loadJqueryUI(TwitterLogin, view);
}
function excelTOXml(e) {
    var t = htmlTocsv(!0, e),
        a = CSV2JSON(t),
        i = new XML.ObjTree().writeXML($.parseJSON(a));
    (i = (i = decodeSpecialCharacter(i)).substr(0, 39) + "<root>" + i.substr(39) + "</root>"), editorAce.setValue(vkbeautify.xml(i));
}
function excelToJson(e) {
    var t = htmlTocsv(!0, e),
        a = CSV2JSON(t);
    editorAce.setValue(vkbeautify.json(a));
}
function onTagChange() {
    "custom" == $("#htmlTag").val() ? ($("#pTag").removeClass("hide"), $("#bTag").removeClass("hide")) : ($("#pTag").addClass("hide"), $("#bTag").addClass("hide"), textTohtml());
}
function textTohtml() {
    var e = "<p>",
        t = "<br/>",
        a = "</p>",
        i = editorAce.getValue();
    if (0 == i.trim().length) return !1;
    "custom" == $("#htmlTag").val()
        ? (0 != $("#bTag").val().trim().length && (t = $("#bTag").val()), 0 != $("#pTag").val().trim().length && (a = (e = $("#pTag").val()).substring(0, 1) + "/" + e.substring(1, e.length)))
        : "p" == $("#htmlTag").val()
        ? (t = " ")
        : "b" == $("#htmlTag").val() && ((e = ""), (a = ""));
    var r = vkbeautify.xml("<!DOCTYPE html><html><head><title>Codebeautify.org Text to HTML Converter</title></head><body>" + e + i.split("\n").join(t + "\n") + a + "</body></html>");
    editorResult.setValue(r);
}
function createImageFromText(e) {
    context.font = "15px sans-serif";
    var t = $(e).val();
    if (((t = t.match(/.{1,65}/g)), context.clearRect(0, 0, canvas.width, canvas.height), 0 != t.length)) for (var a = 0; a < t.length; a++) context.fillText(t[a], 0, 20 + 15 * a);
}
$(document).ready(function () {
    if ("actionscript" == (viewname = $("#viewName").val().trim())) setViewTitle("Action Script Viewer", !0, !0), createEditor("actionscript", "actionscript");
    else if ("alleditor" == viewname) ace.require("ace/ext/language_tools"), createEditor("text"), editorAce.setOptions({ enableBasicAutocompletion: !0, enableSnippets: !0, enableLiveAutocompletion: !0 });
    else if ("api-test" == viewname) createEditor(null, "html");
    else if ("csharpviewer" == viewname) setViewTitle("C# Viewer", !0, !0), createEditor("csharp", "csharp");
    else if ("css-beautify-minify" == viewname) setViewTitle("CSS BEAUTIFY AND MINIFY", !0, !0), createEditor("css", "css");
    else if ("minify-css" == viewname) setViewTitle("MINIFY CSS", !0, !0), createEditor("css", "css");
    else if ("cssvalidate" == viewname)
        $(function () {
            $("#cssData").bind("paste", function (e) {
                setTimeout(validateCSS(), 100);
            });
        }),
            $("#cssData").keyup(function (e) {
                8 == e.keyCode || 46 == e.keyCode ? validateCSS() : e.preventDefault();
            }),
            setViewTitle("CSS Validator", !0, !0),
            createEditor("css");
    else if ("date-time-calculate" == viewname)
        $("#summary").hide(),
            $(".bugs_error").delegate(".close_err", "click", function () {
                $(".bugs_error").slideUp("slow");
            }),
            $("#moreMenu").show(),
            $(".dd_mm").mask("99"),
            $(".dd_mm_yy").mask("9999");
    else if ("excel-to-html" == viewname) setViewTitle("EXCEL TO HTML", !0, !1), createEditor("html"), $("#excelTohtml").click();
    else if ("excel-to-json" == viewname) setViewTitle("EXCEL TO JSON", !0, !1), createEditor("json"), $("#excelTojson").click();
    else if ("file-difference" == viewname || "xml-xsl-transform" == viewname || "xml-diff" == viewname)
        $("#F1").click(),
            $("#F2").click(),
            $("#advopt").click(function () {
                $(".option").slideDown(), $("#advopt").hide(), $("#hadvopt").Show();
            }),
            $("#hadvopt").click(function () {
                $(".option").slideUp(), $("#advopt").show(), $("#hadvopt").hide();
            });
    else if ("html-to-csv-converter" == viewname) setViewTitle("HTML TO CSV Converter", !0, !0), createEditor("html", "text");
    else if ("html-to-php-converter" == viewname) setViewTitle("HTML TO php Converter", !0, !0), createEditor("html", "php");
    else if ("text-to-html-converter" == viewname) setViewTitle("TEXT TO HTML Converter", !0, !0), createEditor("text", "html");
    else if ("htmlviewer" == viewname) setViewTitle("HTML Viewer", !0, !0), createEditor("html", "html"), $("#resultDiv1").hide();
    else if ("javaviewer" == viewname) setViewTitle("JAVA Viewer", !0, !0), createEditor("java", "java");
    else if ("jsvalidate" == viewname)
        setViewTitle("JavaScript Validator", !0, !0),
            createEditor("javascript"),
            $(function () {
                $("#jsData").bind("paste", function (e) {
                    setTimeout(validateJS(), 100);
                });
            }),
            $("#resultDiv1").hide(),
            $("#jsData").keyup(function (e) {
                8 == e.keyCode || 46 == e.keyCode ? validateJS() : e.preventDefault();
            });
    else if ("jsviewer" == viewname) setViewTitle("JavaScript Viewer", !0, !0), createEditor("javascript", "javascript"), $("#resultDiv1").hide();
    else if ("mxmlviewer" == viewname) setViewTitle("MXML Viewer", !0, !0), createEditor("xml", "xml");
    else if ("opml-to-json-converter" == viewname) {
        (mode = document.getElementById("mode")),
            (mode.onchange = function () {
                editor.setMode(mode.value);
            });
        var e = document.getElementById("jsoneditor"),
            t = {
                mode: mode.value,
                error: function (e) {
                    openErrorDialog(e.toString());
                },
            };
        (editor = new JSONEditor(e, t, json)), setViewTitle("OPML TO JSON CONVERTER", !0, !0), createEditor("xml", "xml");
    } else if ("rssviewer" == viewname) setViewTitle("RSS Viewer", !0, !0), createEditor("xml", "json");
    else if ("source-code-viewer" == viewname) createEditor("html"), editorAce.setOptions({ enableBasicAutocompletion: !0, enableSnippets: !0, enableLiveAutocompletion: !1 });
    else if ("wordcounter" == viewname)
        $("#tData").keyup(function (e) {
            8 == e.keyCode || 46 == e.keyCode ? countWord() : e.preventDefault();
        }),
            $("#tData").highlightTextarea({ caseSensitive: !1 }),
            $("body").on("click", "td span", function () {
                (highlightedText = $(this).text()), $("#tData").highlightTextarea("enable"), $("#tData").highlightTextarea("setWords", $(this).text());
            }),
            $("#tData").bind("paste", function (e) {
                $("#caseSelect").val(0), setTimeout(countWord(), 100);
            }),
            setViewTitle("Words Counter", !0, !0),
            (String.prototype.toProperCase = function () {
                for (var e = this.split(" "), t = [], a = 0; a < e.length; a++) {
                    var i = e[a].charAt(0).toUpperCase();
                    t.push(i + e[a].slice(1));
                }
                return t.join(" ");
            });
    else if ("Xpath-Tester" == viewname)
        createEditor("xml", "xml"),
            setViewTitle("XPATH TESTER / EVALUATOR", !0, !1),
            $("#closemsg").click(function () {
                $("#hResult").hide(), $("#closemsg").hide();
            }),
            $("#mainLeftDiv").hide(),
            $("#xpath-examples").click(function () {
                $("html, body").animate({ scrollTop: $("#testCase1").offset().top }, 1e3);
            });
    else if ("yaml-to-json-xml-csv" == viewname) setViewTitle("YAML Converter", !0, !1), createEditor("yaml", "json");
    else if ("yaml-validator" == viewname)
        setViewTitle("YAML Validator", !0, !1),
            createEditor("yaml"),
            editorAce.on("focus", function () {
                $("#editor").css({ border: "1px solid #BCBDBA" });
            });
    else if ("tableizer" == viewname)
        setViewTitle("Online Tableizer", !0, !1),
            createEditor("text", "html"),
            editorAce.on("focus", function () {
                $("#editor").css({ border: "1px solid #BCBDBA" });
            }),
            $("#headColor").colpick({
                polyfill: !0,
                onChange: function (e, t, a, i, r) {
                    $(i).val("#" + t.toUpperCase()), $(i).css({ "background-color": "#" + t });
                },
            });
    else if ("send-snap-message" == viewname) {
        $("#openphoto").click(function () {
            loadPopup();
        }),
            $(".openPhotoDiv").hide(),
            $("div.close").click(function () {
                disablePopup();
            }),
            $("div#backgroundPopup").click(function () {
                disablePopup();
            }),
            $("#messageOption").click(function () {
                $(".snapMessageOption").toggle();
            }),
            $("#createAnotherSnap").click(function () {
                location.reload(), $(".MainMessageContainerDiv").removeClass("hideImportant"), $(".messageAlertDiv").hide();
            }),
            $("#destroyMessage").click(function () {
                location.reload();
            });
        var a = $("#note"),
            i = $(".snote"),
            r = parseInt(i.css("line-height")),
            o = parseInt(i.css("min-height")),
            l = o,
            s = 0,
            n = 0,
            d = new RegExp("\n", "g");
        a
            .on("input", function (e) {
                (n = a.val().match(d)) || (n = []), (s = Math.max((n.length + 1) * r, o)) != l && (a.height(s), (l = s));
            })
            .trigger("input"),
            $("#uploadPhotobtn").click();
    } else if ("ipcheck-weatherinfo-latestnews" == viewname) setInterval("time1()", 1e3), BindUserInfo();
    else if ("tweet-big" == viewname) {
        setViewTitle("Tweet Big", !0, !1), $(".permalinkButtonDiv").hide(), $(".headerMenu").css({ "margin-right": "-85px" }), $("#canvas").css({ "background-color": "whitesmoke" });
        var u = createHiDPICanvas(1e3, 800);
        $("#canDiv").html(u), (canvas = document.getElementById("canvas")), (context = canvas.getContext("2d"));
        var c = $("#loginWith").val();
        null != c && 0 != c.trim().length ? "Twitter" != c && TwitterLogin() : TwitterLogin();
    } else if ("python-formatter-beautifier" == viewname) setViewTitle("Python Formatter", !0, !1), createEditor("python", "python");
    else if ("ruby-formatter-beautifier" == viewname) setViewTitle("Ruby Formatter", !0, !1), createEditor("ruby", "ruby");
    else if ("perl-formatter-beautifier" == viewname) setViewTitle("Perl Formatter", !0, !1), createEditor("perl", "perl");
    else if ("c-formatter-beautifier" == viewname) setViewTitle("C Formatter", !0, !1), createEditor("c_cpp", "c_cpp");
    else if ("cpp-formatter-beautifier" == viewname) setViewTitle("C++ Formatter", !0, !1), createEditor("c_cpp", "c_cpp");
    else if ("html-formatter-beautifier" == viewname) setViewTitle("HTML Formatter", !0, !1), createEditor("html", "html");
    else if ("excel-to-xml" == viewname) setViewTitle("EXCEL TO XML", !0, !1), $("#excelToxml").click(), createEditor("xml");
    else if ("yaml-viewer" == viewname) {
        setViewTitle("YAML Viewer", !0, !0), createEditor("text");
        (e = document.getElementById("jsoneditor")),
            (t = {
                mode: "tree",
                error: function (e) {
                    openErrorDialog(e.toString());
                },
            });
        editor = new JSONEditor(e, t, "");
    } else
        "yaml-to-excel-converter" == viewname
            ? (setViewTitle("YAML TO Excel Converter", !0, !1), createEditor("yaml"))
            : "jsonpath-tester" == viewname
            ? (createEditor(null, "json"),
              setViewTitle("JSON PATH TESTER / EVALUATOR", !0, !1),
              $("#hResult").hide(),
              $("#closemsg").click(function () {
                  $("#hResult").hide(), $("#closemsg").hide();
              }),
              $("#mainLeftDiv").hide(),
              getJsonSampleData())
            : "word-to-html-converter" == viewname
            ? (setViewTitle("Word Doc TO HTML", !0, !1), createEditor("html"), $("#wordTohtml").click(), $("#savebtn").hide(), $("#permalinkDiv").addClass("hide"))
            : "xml-diff" == viewname &&
              ($("#F1").click(),
              $("#F2").click(),
              $(".editorCounterSection").addClass("hide"),
              $("#advopt").click(function () {
                  $(".option").slideDown(), $("#advopt").hide(), $("#hadvopt").Show();
              }),
              $("#hadvopt").click(function () {
                  $(".option").slideUp(), $("#advopt").show(), $("#hadvopt").hide();
              }),
              $("#savebtn").hide(),
              $("#permalinkDiv").addClass("hide"));
});
var PIXEL_RATIO = (function () {
    var e = document.createElement("canvas").getContext("2d");
    return (window.devicePixelRatio || 1) / (e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1);
})();
function xslTransform() {
    $("#transformResultDiv").addClass("hide"), $("#transformResult").html(""), $("#transformResultHtml").val("");
    var e = $("#file1").val(),
        t = $("#file2").val();
    if (0 == e.trim().length || 0 == t.trim().length) return !1;
    $("#file1").val(vkbeautify.xml(e)),
        $("#file2").val(vkbeautify.xml(t)),
        $.ajax({
            type: "post",
            url: globalurl + "readfile/makeXMLXSLFile",
            data: { xmlFile: removeEmptyLine(e), xslFile: removeEmptyLine(t) },
            error: function (e, t, a) {
                openErrorDialog("Failed to Transorm" + t), $("#fName").text("");
            },
        }).done(function (e) {
            if ("success" == e) {
                var t = $.XSLTransform({ xmlurl: "/js/document.xml", xslurl: "/js/document.xsl" });
                $("#transformResult").html(t), $("#transformResultHtml").val(vkbeautify.xml(t)), $("#transformResultDiv").removeClass("hide");
            } else openErrorDialog("Failed to Transorm" + s);
        });
}
function removeEmptyLine(e) {
    if (0 != e.trim().length) {
        var t = e.split("\n"),
            a = [];
        return (
            $.each(t, function (e, t) {
                0 != t.trim().length && a.push(t);
            }),
            a.join("\n")
        );
    }
}
function loadXMLXSLSample() {
    var e = $("#viewName").val().trim();
    $.ajax({ type: "post", url: globalurl + "SampleData", dataType: "text", data: { viewname: e } }).done(function (e) {
        $("#file2").val(vkbeautify.xml(e)), $("#file1").val(getXMLSampleData(!0));
    });
}
function htmlTophp() {
    var e = editorAce.getValue();
    if (null == e || 0 == e.length) return !1;
    for (var t = e.split("\n"), a = t.length - 1, i = "<? php\n", r = 0; r < t.length; r++) (t[r] = t[r].trim()), (i += r == a ? "echo '" + t[r] + "';" : "echo '" + t[r] + "';\n");
    (i += "\n?>"), editorResult.setValue(i);
}
function captureImg() {
    var e = $("#wsUrl").val();
    $("#wsimg").Class("onlineEditor"),
        $.ajax({
            url: "https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=" + e + "&screenshot=true",
            context: this,
            type: "GET",
            dataType: "json",
            success: function (e) {
                (e = e.screenshot.data.replace(/_/g, "/").replace(/-/g, "+")), $("#wsimg").addClass("onlineEditor"), $("#wsimg").attr("src", "data:image/jpeg;base64," + e);
            },
        });
}
function resetTableizer() {
    editorAce.setValue(""), $("#hResult").addClass("hide");
}
function tableized() {
    var e = editorAce.getValue();
    if (0 != e.trim().length) {
        editorResult.setValue(""), $("#htmlOutput").html(""), (rows = ""), (thead = "<tr>"), (e = e.split("\t").join(","));
        var t = Papa.parse(e),
            a = t.data,
            i = a.slice(1, a.length);
        i.sort(function (e, t) {
            return t.length - e.length;
        }),
            0 == i.length && (i = t.data);
        for (var r = 0; r < i[0].length; r++) r < a[0].length ? (thead += "<th>" + a[0][r] + "</th>") : (thead += "<th>COLUMN" + (r + 1) + "</th>");
        thead += "</tr>";
        for (var o = 1; o < a.length; o++) {
            rows += "<tr>";
            for (r = 0; r < i[0].length; r++) r < a[o].length ? (rows += "<td>" + a[o][r] + "</td>") : (rows += "<td>&nbsp</td>");
            rows += "</tr>";
        }
        var l = "",
            s = "";
        $("#nocss").is(":checked")
            ? (l = "<table><thead>\n" + thead + "</thead><tbody>\n" + rows + "</tbody></table>")
            : ((s = getTableizeStyle()), (l = '<table class="cb-tableizer"><thead>\n' + thead + "</thead><tbody>\n" + rows + "</tbody></table>")),
            $("#hResult").removeClass("hide");
        var n = document.getElementById("htmlOutput").contentWindow.document,
            d = "<!DOCTYPE html><html>\n";
        (d = (d += '<head><meta charset="UTF-8"><title>Tableizer using codebeautify.org</title>\n') + s + "\n"),
            (d += "</head>\n"),
            (d += "<body>\n"),
            (d += l),
            (d += "\n</body>\n"),
            (d += "</html>"),
            n.open(),
            n.write("<center>" + d + "</center>"),
            n.close(),
            editorResult.setValue(vkbeautify.xml(d)),
            $("html, body").animate({ scrollTop: 400 }, 10);
    }
}
function hideTableizer() {
    0 == editorAce.getValue().trim().length && ($("#hResult").addClass("hide"), editorResult.setText(""));
}
function getTableizeStyle() {
    return (
        '   <style type="text/css">     \ttable.cb-tableizer {     \t\tfont-size: ' +
        $("#tableFontSize").val() +
        ";     \t\tborder: 1px solid #CCC;      \t\tfont-family:" +
        $("#tableFont").val() +
        ";   \t}      \t.cb-tableizer td {     \t\tpadding: 4px;     \t\tmargin: 3px;     \t\tborder: 1px solid #CCC;     \t}     \t.cb-tableizer th {     \t\tbackground-color:" +
        $("#headColor").val() +
        ";      \t\tcolor: #FFF;     \t\tfont-weight: bold;     \t}    </style>  "
    );
}
function jsonpath() {
    editorResult.setValue(""), $("#hResult").hide(), $("#closemsg").hide();
    var e = $("#jsonString").val(),
        t = $.parseJSON(e),
        a = $("#jsonpath").val();
    try {
        var i = jsonPath(t, a);
        setOutputMsg("Generated JsonPath"), 0 != i ? ($("html, body").animate({ scrollTop: 0 }, 1e3), editorResult.setValue(vkbeautify.json(JSON.stringify(i)))) : showJsonPathMsg("Wrong Expressiopn....");
    } catch (e) {
        console.log(e.message);
        var r = e.message.split(":");
        showJsonPathMsg(e.name + ":" + r[1]);
    }
}
function showJsonPathMsg(e) {
    $("#closemsg").show(), $("#hResult").show(), $("#hResult").html(e);
}
function wordDocToHtml() {
    var e = "<html><head></head><body>" + $("#wordInput").html() + "</body></html>";
    editorResult.setValue(vkbeautify.xml(e));
}
function formatXMLDiff() {
    $("#file1").val(vkbeautify.xml($("#file1").val())), $("#file2").val(vkbeautify.xml($("#file2").val()));
}
createHiDPICanvas = function (e, t, a) {
    a || (a = PIXEL_RATIO);
    var i = document.createElement("canvas");
    return (i.width = e * a), (i.height = t * a), (i.style.width = e + "px"), (i.style.height = t + "px"), (i.id = "canvas"), i.getContext("2d").setTransform(a, 0, 0, a, 0, 0), i;
};
