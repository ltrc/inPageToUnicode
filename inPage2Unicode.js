/* Global Options */
globalOptions = {
    "rbtnUrdu": true,           /* Urdu? */
    "chkHehHamza": true,        /* Correct heh with Hamza? */
    "chkRKashida": false,       /* Remove Kashida Sign? */
    "chkQuotMarks": false,      /* Reverse Quotation Marks? */
    "chkRDigits": true,         /* Reverse Number / Digits? */
    "chkReverseSSign": true,    /* Reverse Solidus (/) Sign? */
    "chkThousSeparator": true,  /* Reverse Thousands Separator? */
    "chkBariYee": true,         /* Correct Bari Ya? */
    "chkRDoubleSpace": true,    /* Remove Double Space? */
    "chkRErabs": false,         /* Remove All Erabs? */
    "chkYearSign": true         /* Correct Year Sign? */
}
/* inPage2Unicode:
 * Takes File object, reads it's content and throws it to processInput()
 * @my_sourceFName: File Object
 * @options: Override globalOptions
 */
function inPage2Unicode(my_sourceFName, options, callback) {
    for (option in options) {
        globalOptions[option] = options[option];
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        callback(processInput(e.target.result));
    };
    reader.readAsBinaryString(my_sourceFName);
}
/* findStartPosition:
 * Processes given binary data to figure out the beginning position of the
 * actual content
 * @bData: Binary String
 */
function findStartPosition(bData) {
    for (i = 0; i <= bData.length - 1; i++) {
        if (bData[i] == String.fromCharCode(1) &&
            bData[i + 4] == String.fromCharCode(13)) {
            tempTest = "";
            for (t = 0; t <= 9; t++) {
                tempTest += bData[i + t].charCodeAt(0).toString();
            }
            if (tempTest == "10001300000") {
                return i + 14
            }
        }
    }
}
/* findEndPosition:
 * Processes given binary data to figure out the ending position of the
 * actual content
 * @bData: Binary String
 * @startP: Starting position of the actial content
 */
function findEndPosition(bData, startP) {
    for (i = startP; i <= bData.length - 1; i++) {
        if (bData[i + 6] == String.fromCharCode(255)) {
            tempTest = "";
            for (t = 0; t <= 9; t++) {
                tempTest += bData[i + t].charCodeAt(0).toString();
            }
            if (tempTest == "1300000255255255255") {
                return i
            }
        }
    }
}
/* convert2BitString:
 * Converts binary string to a hex string
 * Example:
 * "abcde" -> "-61-62-63-64-65"
 * @bData: Binary String
 * @start: Starting position of the conversion
 * @length: Length of the conversion
 */
function convert2BitString(bData, start, length) {
    var hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];
    res = "";
    for (i = start; i < start + length ; i++) {
        b = bData[i].charCodeAt(0);
        res +=  "-" + hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
    }
    return res;
}
/* processInput:
 * Processes given binary string from the inPage file and converts it to
 * Unicode format
 * @my_binaryData: Binary String
 */
function processInput(my_binaryData) {
    rbtnUrdu = globalOptions["rbtnUrdu"];
    chkHehHamza = globalOptions["chkHehHamza"];
    chkRKashida = globalOptions["chkRKashida"];
    chkQuotMarks = globalOptions["chkQuotMarks"];
    chkRDigits = globalOptions["chkRDigits"];
    chkReverseSSign = globalOptions["chkReverseSSign"];
    chkThousSeparator = globalOptions["chkThousSeparator"];
    chkBariYee = globalOptions["chkBariYee"];
    chkRDoubleSpace = globalOptions["chkRDoubleSpace"];
    chkRErabs = globalOptions["chkRErabs"];
    chkYearSign = globalOptions["chkYearSign"];
    myEnter = String.fromCharCode(13) + String.fromCharCode(10);
    myTab = String.fromCharCode(9);
    regReverseEngWSpace = "[0-9]+[ ][0-9 ?]+[0-9]";
    regEnter = "-0D-[^-]+-[^-]+-[^-]+-[^-]+[^-]";
    regRemoveAhrab = "[ ًٌٍَُِّٰٖٗ]";
    regUDigits = "[۰۱۲۳۴۵۶۷۸۹][۰۱۲۳۴۵۶۷۸۹/+×÷%,]+";
    regADigits = "[٠١٢٣٤٥٦٧٨٩][٠١٢٣٤٥٦٧٨٩/+×÷%,]+";
    regOnlyUDigits = "[۰۱۲۳۴۵۶۷۸۹][۰۱۲۳۴۵۶۷۸۹]+";
    regOnlyADigits = "[٠١٢٣٤٥٦٧٨٩][٠١٢٣٤٥٦٧٨٩]+";
    regUrduAlfabat = "([ابپتٹثجچحخدڈذرڑزژسشصضطظعغفقکكگلمنوئیےؤهۀةأـآيھإہۃں])";
    regAhrab = "([ًٌٍَُِّٰٖٗ])";  //zair is inside
    regNoonGuna = "(ں)" + regUrduAlfabat;
    regHamza = "(ء)" + regUrduAlfabat;
    regHamzaWAhrab = "(ء)" + regAhrab + regUrduAlfabat;
    startP = findStartPosition(my_binaryData);
    endP = findEndPosition(my_binaryData, startP);
    slength = endP - startP;
    newOutput = convert2BitString(my_binaryData, startP, slength);
    oldOutput = newOutput;
    re = new RegExp(regEnter, 'g');
    newOutput = newOutput.replace(re, myEnter);
    newOutput = newOutput.replace(/-09/g, myTab);
    newOutput = newOutput.replace(/-04-AA/g, "ِ"); //ZEIR
    newOutput = newOutput.replace(/-04-20/g, " ");
    newOutput = newOutput.replace(/-04-81-04-B3/g, "آ");
    newOutput = newOutput.replace(/-04-81-04-BF/g, "أ");
    newOutput = newOutput.replace(/-04-81/g, "ا");
    newOutput = newOutput.replace(/-04-82/g, "ب");
    newOutput = newOutput.replace(/-04-83/g, "پ");
    newOutput = newOutput.replace(/-04-84/g, "ت");
    newOutput = newOutput.replace(/-04-85/g, "ٹ");
    newOutput = newOutput.replace(/-04-86/g, "ث");
    newOutput = newOutput.replace(/-04-87/g, "ج");
    newOutput = newOutput.replace(/-04-88/g, "چ");
    newOutput = newOutput.replace(/-04-89/g, "ح");
    newOutput = newOutput.replace(/-04-8A/g, "خ");
    newOutput = newOutput.replace(/-04-8B/g, "د");
    newOutput = newOutput.replace(/-04-8C/g, "ڈ");
    newOutput = newOutput.replace(/-04-8D/g, "ذ");
    newOutput = newOutput.replace(/-04-8E/g, "ر");
    newOutput = newOutput.replace(/-04-8F/g, "ڑ");
    newOutput = newOutput.replace(/-04-90/g, "ز");
    newOutput = newOutput.replace(/-04-91/g, "ژ");
    newOutput = newOutput.replace(/-04-92/g, "س");
    newOutput = newOutput.replace(/-04-93/g, "ش");
    newOutput = newOutput.replace(/-04-94/g, "ص");
    newOutput = newOutput.replace(/-04-95/g, "ض");
    newOutput = newOutput.replace(/-04-96/g, "ط");
    newOutput = newOutput.replace(/-04-97/g, "ظ");
    newOutput = newOutput.replace(/-04-98/g, "ع");
    newOutput = newOutput.replace(/-04-99/g, "غ");
    newOutput = newOutput.replace(/-04-9A/g, "ف");
    newOutput = newOutput.replace(/-04-9B/g, "ق");
    if (rbtnUrdu) {
        newOutput = newOutput.replace(/-04-9C/g, "ک");
    } else {
        newOutput = newOutput.replace(/-04-9C/g, "ك");
    }
    newOutput = newOutput.replace(/-04-9D/g, "گ");
    newOutput = newOutput.replace(/-04-9E/g, "ل");
    newOutput = newOutput.replace(/-04-9F/g, "م");
    newOutput = newOutput.replace(/-04-A0/g, "ن");
    newOutput = newOutput.replace(/-04-A1/g, "ں");
    if (chkHehHamza) {
        newOutput = newOutput.replace(/-04-A3-04-A2/g, "ؤ");
        newOutput = newOutput.replace(/-04-BF-04-A2/g, "ؤ");
    } else {
        newOutput = newOutput.replace(/-04-A3-04-A2/g, "ئو");
    }
    newOutput = newOutput.replace(/-04-A2-04-BF/g, "ؤ");
    if (rbtnUrdu) {
        if (chkHehHamza) {
            newOutput = newOutput.replace(/-04-BF-04-A6/g, "ۂ");
            newOutput = newOutput.replace(/-04-A3-04-A6/g, "ۂ");
        }
        newOutput = newOutput.replace(/-04-A6-04-BF/g, "ۂ");
    } else {
        newOutput = newOutput.replace(/-04-A6-04-BF/g, "ۀ");
    }
    newOutput = newOutput.replace(/-04-A3-04-A6/g, "ئہ");
    newOutput = newOutput.replace(/-04-A2/g, "و");
    newOutput = newOutput.replace(/-04-A3/g, "ء");
    newOutput = newOutput.replace(/-04-A4-04-BF/g, "ئ");
    if (rbtnUrdu) {
        newOutput = newOutput.replace(/-04-A4/g, "ی");
    } else {
        newOutput = newOutput.replace(/-04-A4/g, "ي");
    }
    newOutput = newOutput.replace(/-04-A5/g, "ے");
    if (rbtnUrdu) {
        newOutput = newOutput.replace(/-04-A6/g, "ہ");
        newOutput = newOutput.replace(/-04-A7/g, "ھ");
    } else {
        newOutput = newOutput.replace(/-04-A6/g, "ه");
        newOutput = newOutput.replace(/-04-A7/g, "ه");
    }
    newOutput = newOutput.replace(/-04-A8/g, "ٍ"); //2 ZEIR NICHE
    if (chkRKashida) {
        newOutput = newOutput.replace(/-04-A9/g, ""); //169 TATWEEL
    } else {
        newOutput = newOutput.replace(/-04-A9/g, "ـ"); //169 TATWEEL
    }
    newOutput = newOutput.replace(/-04-AA/g, "ِ"); //ZEIR
    newOutput = newOutput.replace(/-04-AB/g, "َ"); //ZABAR
    newOutput = newOutput.replace(/-04-AC/g, "ُ"); //PAESH
    newOutput = newOutput.replace(/-04-AD/g, "ّ"); //0651 UNICODE VALUE
    newOutput = newOutput.replace(/-04-AE/g, "ؑ"); //ALAH ISLAM SH
    newOutput = newOutput.replace(/-04-B0/g, "ٖ"); //KHARI ZEIR
    if (rbtnUrdu) {
        newOutput = newOutput.replace(/-04-B1-04-B1/g, "ْ"); //SAKIN
        newOutput = newOutput.replace(/-04-B1/g, "ْ"); //SAKIN
    } else {
        newOutput = newOutput.replace(/-04-B1-04-B1/g, "ْ"); //SAKIN
        newOutput = newOutput.replace(/-04-B1/g, "ْ"); //SAKIN
    }
    newOutput = newOutput.replace(/-04-B3/g, "ٓ"); //MAD
    newOutput = newOutput.replace(/-04-B4/g, "ْ"); //SAKIN
    newOutput = newOutput.replace(/-04-B5/g, "ٌ"); //PAESH TYPE PHOOL
    newOutput = newOutput.replace(/-04-B6/g, "ؤ");
    newOutput = newOutput.replace(/-04-B7/g, "ئ");
    newOutput = newOutput.replace(/-04-B8/g, "ي");
    if (rbtnUrdu) {
         newOutput = newOutput.replace(/-04-B9/g, "ۃ");
    } else {
        newOutput = newOutput.replace(/-04-B9/g, "ة");
    }
    newOutput = newOutput.replace(/-04-BD/g, "ٰ"); //KHARI ZABAR
    newOutput = newOutput.replace(/-04-BE/g, "ٗ"); //ULTA PAESH
    newOutput = newOutput.replace(/-04-BF/g, "ٔ"); //HAMZA OOPER

    newOutput = newOutput.replace(/-04-C7/g, "ً"); //2 ZABAR OOPAR
    newOutput = newOutput.replace(/-04-C8/g, "آ");
    newOutput = newOutput.replace(/-04-C9/g, "أ");
    newOutput = newOutput.replace(/-04-CA/g, "إ");
    newOutput = newOutput.replace(/-04-CB/g, "ﷲ"); //ALLAH
    newOutput = newOutput.replace(/-04-CF/g, "ؔ");  //207
    if (rbtnUrdu) {
        newOutput = newOutput.replace(/-04-D0/g, "۰");
        newOutput = newOutput.replace(/-04-D1/g, "۱");
        newOutput = newOutput.replace(/-04-D2/g, "۲");
        newOutput = newOutput.replace(/-04-D3/g, "۳");
        newOutput = newOutput.replace(/-04-D4/g, "۴");
        newOutput = newOutput.replace(/-04-D5/g, "۵");
        newOutput = newOutput.replace(/-04-D6/g, "۶");
        newOutput = newOutput.replace(/-04-D7/g, "۷");
        newOutput = newOutput.replace(/-04-D8/g, "۸");
        newOutput = newOutput.replace(/-04-D9/g, "۹");
    } else {
        newOutput = newOutput.replace(/-04-D0/g, "٠");
        newOutput = newOutput.replace(/-04-D1/g, "١");
        newOutput = newOutput.replace(/-04-D2/g, "٢");
        newOutput = newOutput.replace(/-04-D3/g, "٣");
        newOutput = newOutput.replace(/-04-D4/g, "٤");
        newOutput = newOutput.replace(/-04-D5/g, "٥");
        newOutput = newOutput.replace(/-04-D6/g, "٦");
        newOutput = newOutput.replace(/-04-D7/g, "٧");
        newOutput = newOutput.replace(/-04-D8/g, "٨");
        newOutput = newOutput.replace(/-04-D9/g, "٩");
    }
    newOutput = newOutput.replace(/-04-DA/g, "!"); //218
    newOutput = newOutput.replace(/-04-DB/g, "﴾"); //SP B
    newOutput = newOutput.replace(/-04-DC/g, "﴿");
    newOutput = newOutput.replace(/-04-DE/g, "%");
    newOutput = newOutput.replace(/-04-DF/g, "/");
    newOutput = newOutput.replace(/-04-E0/g, "……"); // ... DBL
    newOutput = newOutput.replace(/-04-E1/g, ")"); //N B
    newOutput = newOutput.replace(/-04-E2/g, "("); //N B
    newOutput = newOutput.replace(/-04-E4/g, "+");
    newOutput = newOutput.replace(/-04-E6/g, "ؓ");  //RAZI ALLAH SH
    newOutput = newOutput.replace(/-04-E7/g, "ؒ");  //RAHMATU ALLAH SH
    newOutput = newOutput.replace(/-04-E8/g, "٭");
    newOutput = newOutput.replace(/-04-E9/g, ":"); //233
    newOutput = newOutput.replace(/-04-EA/g, "؛");
    newOutput = newOutput.replace(/-04-EB/g, "×");
    newOutput = newOutput.replace(/-04-EC/g, "=");
    newOutput = newOutput.replace(/-04-ED/g, "،");
    newOutput = newOutput.replace(/-04-EE/g, "؟");
    newOutput = newOutput.replace(/-04-EF/g, "÷");
    newOutput = newOutput.replace(/-04-F1/g, "؍"); //241
    newOutput = newOutput.replace(/-04-F2/g, "؂");
    if (rbtnUrdu) {
        newOutput = newOutput.replace(/-04-F3/g, "۔");
    } else {
        newOutput = newOutput.replace(/-04-F3/g, ".");
    }
    newOutput = newOutput.replace(/-04-F5/g, "-"); //245  /
    newOutput = newOutput.replace(/-04-F6/g, "ﷺ"); //PBUH
    newOutput = newOutput.replace(/-04-F7/g, "؁");  //247
    newOutput = newOutput.replace(/-04-F8/g, "ؐ"); //PBUH SHORT
    newOutput = newOutput.replace(/-04-F9/g, ",");
    newOutput = newOutput.replace(/-04-FA/g, "]");
    newOutput = newOutput.replace(/-04-FB/g, "[");
    newOutput = newOutput.replace(/-04-FC/g, ".");  //.
    if (chkQuotMarks) {
        newOutput = newOutput.replace(/-04-FE/g, "’");  //254
        newOutput = newOutput.replace(/-04-FD/g, "‘");  //253
    } else {
        newOutput = newOutput.replace(/-04-FD/g, "’");  //253
        newOutput = newOutput.replace(/-04-FE/g, "‘");  //254
    }
    newOutput = newOutput.replace(/-04-3A/g, "");
    newOutput = newOutput.replace(/-04-3B/g, "");
    newOutput = newOutput.replace(/-09/g, myTab);
    newOutput = newOutput.replace(/-20/g, " ");
    newOutput = newOutput.replace(/-21/g, "!");
    newOutput = newOutput.replace(/-22/g, String.fromCharCode(34));
    newOutput = newOutput.replace(/-23/g, "#");
    newOutput = newOutput.replace(/-24/g, "$");
    newOutput = newOutput.replace(/-25/g, "%");
    newOutput = newOutput.replace(/-26/g, "&");
    newOutput = newOutput.replace(/-27/g, "'");
    newOutput = newOutput.replace(/-28/g, "(");
    newOutput = newOutput.replace(/-29/g, ")");
    newOutput = newOutput.replace(/-2A/g, "*");
    newOutput = newOutput.replace(/-2B/g, "+");
    newOutput = newOutput.replace(/-2C/g, ",");
    newOutput = newOutput.replace(/-2D/g, "-");
    newOutput = newOutput.replace(/-2E/g, ".");
    newOutput = newOutput.replace(/-2F/g, "/");
    newOutput = newOutput.replace(/-3A/g, ":");
    newOutput = newOutput.replace(/-3B/g, ";");
    newOutput = newOutput.replace(/-3C/g, "<");
    newOutput = newOutput.replace(/-3D/g, "=");
    newOutput = newOutput.replace(/-3E/g, ">");
    newOutput = newOutput.replace(/-3F/g, "?");
    newOutput = newOutput.replace(/-40/g, "@");
    newOutput = newOutput.replace(/-41/g, "A");
    newOutput = newOutput.replace(/-42/g, "B");
    newOutput = newOutput.replace(/-43/g, "C");
    newOutput = newOutput.replace(/-44/g, "D");
    newOutput = newOutput.replace(/-45/g, "E");
    newOutput = newOutput.replace(/-46/g, "F");
    newOutput = newOutput.replace(/-47/g, "G");
    newOutput = newOutput.replace(/-48/g, "H");
    newOutput = newOutput.replace(/-49/g, "I");
    newOutput = newOutput.replace(/-4A/g, "J");
    newOutput = newOutput.replace(/-4B/g, "K");
    newOutput = newOutput.replace(/-4C/g, "L");
    newOutput = newOutput.replace(/-4D/g, "M");
    newOutput = newOutput.replace(/-4E/g, "N");
    newOutput = newOutput.replace(/-4F/g, "O");
    newOutput = newOutput.replace(/-50/g, "P");
    newOutput = newOutput.replace(/-51/g, "Q");
    newOutput = newOutput.replace(/-52/g, "R");
    newOutput = newOutput.replace(/-53/g, "S");
    newOutput = newOutput.replace(/-54/g, "T");
    newOutput = newOutput.replace(/-55/g, "U");
    newOutput = newOutput.replace(/-56/g, "V");
    newOutput = newOutput.replace(/-57/g, "W");
    newOutput = newOutput.replace(/-58/g, "X");
    newOutput = newOutput.replace(/-59/g, "Y");
    newOutput = newOutput.replace(/-5A/g, "Z");
    newOutput = newOutput.replace(/-5B/g, "[");
    newOutput = newOutput.replace(/-5C/g, "\\");
    newOutput = newOutput.replace(/-5D/g, "]");
    newOutput = newOutput.replace(/-5E/g, "^");
    newOutput = newOutput.replace(/-5F/g, "_");
    newOutput = newOutput.replace(/-60/g, "`");
    newOutput = newOutput.replace(/-61/g, "a");
    newOutput = newOutput.replace(/-62/g, "b");
    newOutput = newOutput.replace(/-63/g, "c");
    newOutput = newOutput.replace(/-64/g, "d");
    newOutput = newOutput.replace(/-65/g, "e");
    newOutput = newOutput.replace(/-66/g, "f");
    newOutput = newOutput.replace(/-67/g, "g");
    newOutput = newOutput.replace(/-68/g, "h");
    newOutput = newOutput.replace(/-69/g, "i");
    newOutput = newOutput.replace(/-6A/g, "j");
    newOutput = newOutput.replace(/-6B/g, "k");
    newOutput = newOutput.replace(/-6C/g, "l");
    newOutput = newOutput.replace(/-6D/g, "m");
    newOutput = newOutput.replace(/-6E/g, "n");
    newOutput = newOutput.replace(/-6F/g, "o");
    newOutput = newOutput.replace(/-70/g, "p");
    newOutput = newOutput.replace(/-71/g, "q");
    newOutput = newOutput.replace(/-72/g, "r");
    newOutput = newOutput.replace(/-73/g, "s");
    newOutput = newOutput.replace(/-74/g, "t");
    newOutput = newOutput.replace(/-75/g, "u");
    newOutput = newOutput.replace(/-76/g, "v");
    newOutput = newOutput.replace(/-77/g, "w");
    newOutput = newOutput.replace(/-78/g, "x");
    newOutput = newOutput.replace(/-79/g, "y");
    newOutput = newOutput.replace(/-7A/g, "z");
    newOutput = newOutput.replace(/-7B/g, "{");
    newOutput = newOutput.replace(/-7C/g, "|");
    newOutput = newOutput.replace(/-7D/g, "}");
    newOutput = newOutput.replace(/-7E/g, "~");
    newOutput = newOutput.replace(/-7F/g, "");
    newOutput = newOutput.replace(/-30/g, "0");
    newOutput = newOutput.replace(/-31/g, "1");
    newOutput = newOutput.replace(/-32/g, "2");
    newOutput = newOutput.replace(/-34/g, "4");
    newOutput = newOutput.replace(/-35/g, "5");
    newOutput = newOutput.replace(/-36/g, "6");
    newOutput = newOutput.replace(/-37/g, "7");
    newOutput = newOutput.replace(/-38/g, "8");
    newOutput = newOutput.replace(/-39/g, "9");
    newOutput = newOutput.replace(/-33/g, "3");

    if (chkRDigits && chkReverseSSign && chkThousSeparator) {
        if (rbtnUrdu) {
            re = new RegExp(regUDigits, 'g');
        } else {
            re = new RegExp(regADigits, 'g');
        }
        while ((match = re.exec(newOutput)) != null) {
            matchValue = match[0];
            matchLength = matchValue.length;
            if (matchValue.charAt(matchLength - 1) == '/') {
                matchValue = matchValue.substring(0, matchLength - 1).split("").reverse().join("") + "/";
            } else {
                matchValue = matchValue.split("").reverse().join("");
            }
            newOutput = newOutput.substring(0, match.index) + matchValue + newOutput.substring(match.index + matchLength);
        }
    } else {
        if (chkRDigits && !chkThousSeparator) {
            if (rbtnUrdu) {
                re = new RegExp(regOnlyUDigits, 'g');
            } else {
                re = new RegExp(regOnlyADigits, 'g');
            }
            while ((match = re.exec(newOutput)) != null) {
                matchValue = match[0];
                matchLength = matchValue.length;
                matchValue = matchValue.split("").reverse().join("");
                newOutput = newOutput.substring(0, match.index) + matchValue + newOutput.substring(match.index + matchLength);
            }
        }
    }
    newOutput = newOutput.replace(/(\/)(=)/g, "$2$1");
    re = new RegExp(regNoonGuna, 'g');
    newOutput = newOutput.replace(re, "$1 $2");
    newOutput = newOutput.replace(/(ﺀ)(ﺀ)/g, "ئ$2");
    re = new RegExp(regHamza, 'g');
    newOutput = newOutput.replace(re, "ئ$2");
    re = new RegExp(regHamzaWAhrab, 'g');
    newOutput = newOutput.replace(re, "ئ$2$3");
    if (chkBariYee) {
        re = new RegExp("(ے)" + regUrduAlfabat, 'g');
        newOutput = newOutput.replace(re, "ی$2");
    }
    if (rbtnUrdu) {
        re = new RegExp("(ي)" + regUrduAlfabat, 'g');
        newOutput = newOutput.replace(re, "$1 $2");
    }
    if (chkRDoubleSpace) {
        newOutput = newOutput.replace(/[ ]+[ ]/g, " ");
    }
    if (chkRErabs) {
        re = new RegExp(regRemoveAhrab, 'g');
        newOutput = newOutput.replace(re, "");
    }
    if (chkYearSign) {
        re = new RegExp("(ھ)(؁)", 'g');
        newOutput = newOutput.replace(re, "$2$1")
        re = new RegExp("(ء)(؁)", 'g');
        newOutput = newOutput.replace(re, "$2$1");
    }
    return newOutput;
}
