# inPageToUnicode
inPage to Unicode Convertor for  Perso-Arabic Scripts

Ported from http://dl.dropbox.com/u/2700846/_InPageConverter.zip, originally available at [IT Duniya Forums](http://www.itdunya.com/t224292/)

Demo available at: http://nehaljwani.github.io/inPageToUnicode/

Sample Usage:
```HTML
<html>
<head>
<title>inPageToUnicode Convertor</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script src="https://raw.githubusercontent.com/nehaljwani/inPageToUnicode/master/inPage2Unicode.js"></script>
<script type="text/javascript">
    function showRes(res) {
      document.getElementById('result').innerHTML = res;
    }
    function convert(file) {
      options = {};
      options["rbtnUrdu"] = document.getElementById('languageUrdu').checked;
      options["chkHehHamza"] = document.getElementById('replacementHehHamza').checked;
      options["chkRKashida"] = document.getElementById('replacementKashidaSign').checked;
      options["chkQuotMarks"] = document.getElementById('replacementQuotMarks').checked;
      options["chkRDigits"] = document.getElementById('replacementRevDigits').checked;
      options["chkReverseSSign"] = document.getElementById('replacementRevSSign').checked;
      options["chkThousSeparator"] = document.getElementById('replacementRevTSep').checked;
      options["chkBariYee"] = document.getElementById('replacementBariYa').checked;
      options["chkRDoubleSpace"] = document.getElementById('replacementDSpace').checked;
      options["chkRErabs"] = document.getElementById('replacementErabs').checked;
      options["chkYearSign"] = document.getElementById('replacementYSign').checked;
      inPage2Unicode(file, options, showRes);
    }
</script>
</head>
<body>
    <input name="language" id="languageUrdu" checked="checked" type="radio">Urdu<br>
    <input name="language" id="languageArabic" type="radio">Arabic<br>
    <input id="replacementHehHamza" checked="checked" type="checkbox">Correct heh with Hamza<br>
    <input id="replacementKashidaSign" type="checkbox">Remove Kashida Sign<br>
    <input id="replacementQuotMarks" type="checkbox">Reverse Quotation Marks<br>
    <input id="replacementRevDigits" checked="checked" type="checkbox">Reverse Number / Digits<br>
    <input id="replacementRevSSign" checked="checked" type="checkbox">Reverse Solidus (/) Sign<br>
    <input id="replacementRevTSep" checked="checked" type="checkbox">Reverse Thousands Separator<br>
    <input id="replacementBariYa" checked="checked" type="checkbox">Correct Bari Ya<br>
    <input id="replacementDSpace" checked="checked" type="checkbox">Remove Double Space<br>
    <input id="replacementErabs" type="checkbox">Remove All Erabs<br>
    <input id="replacementYSign" checked="checked" type="checkbox">Correct Year Sign<br>
    <input id="input" onchange="convert(this.files[0])" type="file">
    <textarea rows="4" cols="50" id="result"></textarea>
</body>
</html>
```

Send a pull request to contribute!
