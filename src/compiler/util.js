'use strict';var lang_1 = require('angular2/src/facade/lang');
var CAMEL_CASE_REGEXP = /([A-Z])/g;
var DASH_CASE_REGEXP = /-([a-z])/g;
var SINGLE_QUOTE_ESCAPE_STRING_RE = /'|\\|\n|\r|\$/g;
var DOUBLE_QUOTE_ESCAPE_STRING_RE = /"|\\|\n|\r|\$/g;
exports.MODULE_SUFFIX = lang_1.IS_DART ? '.dart' : '.js';
exports.CONST_VAR = lang_1.IS_DART ? 'const' : 'var';
function camelCaseToDashCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, CAMEL_CASE_REGEXP, function (m) { return '-' + m[1].toLowerCase(); });
}
exports.camelCaseToDashCase = camelCaseToDashCase;
function dashCaseToCamelCase(input) {
    return lang_1.StringWrapper.replaceAllMapped(input, DASH_CASE_REGEXP, function (m) { return m[1].toUpperCase(); });
}
exports.dashCaseToCamelCase = dashCaseToCamelCase;
function escapeSingleQuoteString(input) {
    if (lang_1.isBlank(input)) {
        return null;
    }
    return "'" + escapeString(input, SINGLE_QUOTE_ESCAPE_STRING_RE) + "'";
}
exports.escapeSingleQuoteString = escapeSingleQuoteString;
function escapeDoubleQuoteString(input) {
    if (lang_1.isBlank(input)) {
        return null;
    }
    return "\"" + escapeString(input, DOUBLE_QUOTE_ESCAPE_STRING_RE) + "\"";
}
exports.escapeDoubleQuoteString = escapeDoubleQuoteString;
function escapeString(input, re) {
    return lang_1.StringWrapper.replaceAllMapped(input, re, function (match) {
        if (match[0] == '$') {
            return lang_1.IS_DART ? '\\$' : '$';
        }
        else if (match[0] == '\n') {
            return '\\n';
        }
        else if (match[0] == '\r') {
            return '\\r';
        }
        else {
            return "\\" + match[0];
        }
    });
}
function codeGenExportVariable(name) {
    if (lang_1.IS_DART) {
        return "const " + name + " = ";
    }
    else {
        return "var " + name + " = exports['" + name + "'] = ";
    }
}
exports.codeGenExportVariable = codeGenExportVariable;
function codeGenConstConstructorCall(name) {
    if (lang_1.IS_DART) {
        return "const " + name;
    }
    else {
        return "new " + name;
    }
}
exports.codeGenConstConstructorCall = codeGenConstConstructorCall;
function codeGenValueFn(params, value, fnName) {
    if (fnName === void 0) { fnName = ''; }
    if (lang_1.IS_DART) {
        return codeGenFnHeader(params, fnName) + " => " + value;
    }
    else {
        return codeGenFnHeader(params, fnName) + " { return " + value + "; }";
    }
}
exports.codeGenValueFn = codeGenValueFn;
function codeGenFnHeader(params, fnName) {
    if (fnName === void 0) { fnName = ''; }
    if (lang_1.IS_DART) {
        return fnName + "(" + params.join(',') + ")";
    }
    else {
        return "function " + fnName + "(" + params.join(',') + ")";
    }
}
exports.codeGenFnHeader = codeGenFnHeader;
function codeGenToString(expr) {
    if (lang_1.IS_DART) {
        return "'${" + expr + "}'";
    }
    else {
        // JS automatically converts to string...
        return expr;
    }
}
exports.codeGenToString = codeGenToString;
function splitAtColon(input, defaultValues) {
    var parts = lang_1.StringWrapper.split(input.trim(), /\s*:\s*/g);
    if (parts.length > 1) {
        return parts;
    }
    else {
        return defaultValues;
    }
}
exports.splitAtColon = splitAtColon;
var Statement = (function () {
    function Statement(statement) {
        this.statement = statement;
    }
    return Statement;
})();
exports.Statement = Statement;
var Expression = (function () {
    function Expression(expression, isArray) {
        if (isArray === void 0) { isArray = false; }
        this.expression = expression;
        this.isArray = isArray;
    }
    return Expression;
})();
exports.Expression = Expression;
function escapeValue(value) {
    if (value instanceof Expression) {
        return value.expression;
    }
    else if (lang_1.isString(value)) {
        return escapeSingleQuoteString(value);
    }
    else if (lang_1.isBlank(value)) {
        return 'null';
    }
    else {
        return "" + value;
    }
}
exports.escapeValue = escapeValue;
function codeGenArray(data) {
    return "[" + data.map(escapeValue).join(',') + "]";
}
exports.codeGenArray = codeGenArray;
function codeGenFlatArray(values) {
    var result = '([';
    var isFirstArrayEntry = true;
    var concatFn = lang_1.IS_DART ? '.addAll' : 'concat';
    for (var i = 0; i < values.length; i++) {
        var value = values[i];
        if (value instanceof Expression && value.isArray) {
            result += "])." + concatFn + "(" + value.expression + ")." + concatFn + "([";
            isFirstArrayEntry = true;
        }
        else {
            if (!isFirstArrayEntry) {
                result += ',';
            }
            isFirstArrayEntry = false;
            result += escapeValue(value);
        }
    }
    result += '])';
    return result;
}
exports.codeGenFlatArray = codeGenFlatArray;
function codeGenStringMap(keyValueArray) {
    return "{" + keyValueArray.map(codeGenKeyValue).join(',') + "}";
}
exports.codeGenStringMap = codeGenStringMap;
function codeGenKeyValue(keyValue) {
    return escapeValue(keyValue[0]) + ":" + escapeValue(keyValue[1]);
}
function addAll(source, target) {
    for (var i = 0; i < source.length; i++) {
        target.push(source[i]);
    }
}
exports.addAll = addAll;
function flattenArray(source, target) {
    if (lang_1.isPresent(source)) {
        for (var i = 0; i < source.length; i++) {
            var item = source[i];
            if (lang_1.isArray(item)) {
                flattenArray(item, target);
            }
            else {
                target.push(item);
            }
        }
    }
    return target;
}
exports.flattenArray = flattenArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtMXl2a3FjUkIudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci91dGlsLnRzIl0sIm5hbWVzIjpbImNhbWVsQ2FzZVRvRGFzaENhc2UiLCJkYXNoQ2FzZVRvQ2FtZWxDYXNlIiwiZXNjYXBlU2luZ2xlUXVvdGVTdHJpbmciLCJlc2NhcGVEb3VibGVRdW90ZVN0cmluZyIsImVzY2FwZVN0cmluZyIsImNvZGVHZW5FeHBvcnRWYXJpYWJsZSIsImNvZGVHZW5Db25zdENvbnN0cnVjdG9yQ2FsbCIsImNvZGVHZW5WYWx1ZUZuIiwiY29kZUdlbkZuSGVhZGVyIiwiY29kZUdlblRvU3RyaW5nIiwic3BsaXRBdENvbG9uIiwiU3RhdGVtZW50IiwiU3RhdGVtZW50LmNvbnN0cnVjdG9yIiwiRXhwcmVzc2lvbiIsIkV4cHJlc3Npb24uY29uc3RydWN0b3IiLCJlc2NhcGVWYWx1ZSIsImNvZGVHZW5BcnJheSIsImNvZGVHZW5GbGF0QXJyYXkiLCJjb2RlR2VuU3RyaW5nTWFwIiwiY29kZUdlbktleVZhbHVlIiwiYWRkQWxsIiwiZmxhdHRlbkFycmF5Il0sIm1hcHBpbmdzIjoiQUFBQSxxQkFPTywwQkFBMEIsQ0FBQyxDQUFBO0FBRWxDLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBQ25DLElBQUksZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBQ25DLElBQUksNkJBQTZCLEdBQUcsZ0JBQWdCLENBQUM7QUFDckQsSUFBSSw2QkFBNkIsR0FBRyxnQkFBZ0IsQ0FBQztBQUUxQyxxQkFBYSxHQUFHLGNBQU8sR0FBRyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBRTFDLGlCQUFTLEdBQUcsY0FBTyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUM7QUFFakQsNkJBQW9DLEtBQWE7SUFDL0NBLE1BQU1BLENBQUNBLG9CQUFhQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEtB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bnQiOlsiaW1wb3J0IHtcbiAgSVNfREFSVCxcbiAgU3RyaW5nV3JhcHBlcixcbiAgaXNCbGFuayxcbiAgaXNQcmVzZW50LFxuICBpc1N0cmluZyxcbiAgaXNBcnJheVxufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG52YXIgQ0FNRUxfQ0FTRV9SRUdFWFAgPSAvKFtBLVpdKS9nO1xudmFyIERBU0hfQ0FTRV9SRUdFWFAgPSAvLShbYS16XSkvZztcbnZhciBTSU5HTEVfUVVPVEVfRVNDQVBFX1NUUklOR19SRSA9IC8nfFxcXFx8XFxufFxccnxcXCQvZztcbnZhciBET1VCTEVfUVVPVEVfRVNDQVBFX1NUUklOR19SRSA9IC9cInxcXFxcfFxcbnxcXHJ8XFwkL2c7XG5cbmV4cG9ydCB2YXIgTU9EVUxFX1NVRkZJWCA9IElTX0RBUlQgPyAnLmRhcnQnIDogJy5qcyc7XG5cbmV4cG9ydCB2YXIgQ09OU1RfVkFSID0gSVNfREFSVCA/ICdjb25zdCcgOiAndmFyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsQ2FzZVRvRGFzaENhc2UoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGxNYXBwZWQoaW5wdXQsIENBTUVMX0NBU0VfUkVHRVhQLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtKSA9PiB7IHJldHVybiAnLScgKyBtWzFdLnRvTG93ZXJDYXNlKCk7IH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGFzaENhc2VUb0NhbWVsQ2FzZShpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbE1hcHBlZChpbnB1dCwgREFTSF9DQVNFX1JFR0VYUCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobSkgPT4geyByZXR1cm4gbVsxXS50b1VwcGVyQ2FzZSgpOyB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nKGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhpbnB1dCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gYCcke2VzY2FwZVN0cmluZyhpbnB1dCwgU0lOR0xFX1FVT1RFX0VTQ0FQRV9TVFJJTkdfUkUpfSdgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRG91YmxlUXVvdGVTdHJpbmcoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChpc0JsYW5rKGlucHV0KSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBgXCIke2VzY2FwZVN0cmluZyhpbnB1dCwgRE9VQkxFX1FVT1RFX0VTQ0FQRV9TVFJJTkdfUkUpfVwiYDtcbn1cblxuZnVuY3Rpb24gZXNjYXBlU3RyaW5nKGlucHV0OiBzdHJpbmcsIHJlOiBSZWdFeHApOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nV3JhcHBlci5yZXBsYWNlQWxsTWFwcGVkKGlucHV0LCByZSwgKG1hdGNoKSA9PiB7XG4gICAgaWYgKG1hdGNoWzBdID09ICckJykge1xuICAgICAgcmV0dXJuIElTX0RBUlQgPyAnXFxcXCQnIDogJyQnO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hbMF0gPT0gJ1xcbicpIHtcbiAgICAgIHJldHVybiAnXFxcXG4nO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hbMF0gPT0gJ1xccicpIHtcbiAgICAgIHJldHVybiAnXFxcXHInO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYFxcXFwke21hdGNoWzBdfWA7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5FeHBvcnRWYXJpYWJsZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoSVNfREFSVCkge1xuICAgIHJldHVybiBgY29uc3QgJHtuYW1lfSA9IGA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGB2YXIgJHtuYW1lfSA9IGV4cG9ydHNbJyR7bmFtZX0nXSA9IGA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5Db25zdENvbnN0cnVjdG9yQ2FsbChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoSVNfREFSVCkge1xuICAgIHJldHVybiBgY29uc3QgJHtuYW1lfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGBuZXcgJHtuYW1lfWA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5WYWx1ZUZuKHBhcmFtczogc3RyaW5nW10sIHZhbHVlOiBzdHJpbmcsIGZuTmFtZTogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICBpZiAoSVNfREFSVCkge1xuICAgIHJldHVybiBgJHtjb2RlR2VuRm5IZWFkZXIocGFyYW1zLCBmbk5hbWUpfSA9PiAke3ZhbHVlfWA7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAke2NvZGVHZW5GbkhlYWRlcihwYXJhbXMsIGZuTmFtZSl9IHsgcmV0dXJuICR7dmFsdWV9OyB9YDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29kZUdlbkZuSGVhZGVyKHBhcmFtczogc3RyaW5nW10sIGZuTmFtZTogc3RyaW5nID0gJycpOiBzdHJpbmcge1xuICBpZiAoSVNfREFSVCkge1xuICAgIHJldHVybiBgJHtmbk5hbWV9KCR7cGFyYW1zLmpvaW4oJywnKX0pYDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYGZ1bmN0aW9uICR7Zm5OYW1lfSgke3BhcmFtcy5qb2luKCcsJyl9KWA7XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjb2RlR2VuVG9TdHJpbmcoZXhwcjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKElTX0RBUlQpIHtcbiAgICByZXR1cm4gYCdcXCR7JHtleHByfX0nYDtcbiAgfSBlbHNlIHtcbiAgICAvLyBKUyBhdXRvbWF0aWNhbGx5IGNvbnZlcnRzIHRvIHN0cmluZy4uLlxuICAgIHJldHVybiBleHByO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdEF0Q29sb24oaW5wdXQ6IHN0cmluZywgZGVmYXVsdFZhbHVlczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHZhciBwYXJ0cyA9IFN0cmluZ1dyYXBwZXIuc3BsaXQoaW5wdXQudHJpbSgpLCAvXFxzKjpcXHMqL2cpO1xuICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgIHJldHVybiBwYXJ0cztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlcztcbiAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBTdGF0ZW1lbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc3RhdGVtZW50OiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBFeHByZXNzaW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIGV4cHJlc3Npb246IHN0cmluZywgcHVibGljIGlzQXJyYXkgPSBmYWxzZSkge31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVZhbHVlKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFeHByZXNzaW9uKSB7XG4gICAgcmV0dXJuIHZhbHVlLmV4cHJlc3Npb247XG4gIH0gZWxzZSBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nKHZhbHVlKTtcbiAgfSBlbHNlIGlmIChpc0JsYW5rKHZhbHVlKSkge1xuICAgIHJldHVybiAnbnVsbCc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5BcnJheShkYXRhOiBhbnlbXSk6IHN0cmluZyB7XG4gIHJldHVybiBgWyR7ZGF0YS5tYXAoZXNjYXBlVmFsdWUpLmpvaW4oJywnKX1dYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvZGVHZW5GbGF0QXJyYXkodmFsdWVzOiBhbnlbXSk6IHN0cmluZyB7XG4gIHZhciByZXN1bHQgPSAnKFsnO1xuICB2YXIgaXNGaXJzdEFycmF5RW50cnkgPSB0cnVlO1xuICB2YXIgY29uY2F0Rm4gPSBJU19EQVJUID8gJy5hZGRBbGwnIDogJ2NvbmNhdCc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHZhbHVlID0gdmFsdWVzW2ldO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEV4cHJlc3Npb24gJiYgKDxFeHByZXNzaW9uPnZhbHVlKS5pc0FycmF5KSB7XG4gICAgICByZXN1bHQgKz0gYF0pLiR7Y29uY2F0Rm59KCR7dmFsdWUuZXhwcmVzc2lvbn0pLiR7Y29uY2F0Rm59KFtgO1xuICAgICAgaXNGaXJzdEFycmF5RW50cnkgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWlzRmlyc3RBcnJheUVudHJ5KSB7XG4gICAgICAgIHJlc3VsdCArPSAnLCc7XG4gICAgICB9XG4gICAgICBpc0ZpcnN0QXJyYXlFbnRyeSA9IGZhbHNlO1xuICAgICAgcmVzdWx0ICs9IGVzY2FwZVZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmVzdWx0ICs9ICddKSc7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb2RlR2VuU3RyaW5nTWFwKGtleVZhbHVlQXJyYXk6IGFueVtdW10pOiBzdHJpbmcge1xuICByZXR1cm4gYHske2tleVZhbHVlQXJyYXkubWFwKGNvZGVHZW5LZXlWYWx1ZSkuam9pbignLCcpfX1gO1xufVxuXG5mdW5jdGlvbiBjb2RlR2VuS2V5VmFsdWUoa2V5VmFsdWU6IGFueVtdKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke2VzY2FwZVZhbHVlKGtleVZhbHVlWzBdKX06JHtlc2NhcGVWYWx1ZShrZXlWYWx1ZVsxXSl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFsbChzb3VyY2U6IGFueVtdLCB0YXJnZXQ6IGFueVtdKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0LnB1c2goc291cmNlW2ldKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbkFycmF5KHNvdXJjZTogYW55W10sIHRhcmdldDogYW55W10pOiBhbnlbXSB7XG4gIGlmIChpc1ByZXNlbnQoc291cmNlKSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IHNvdXJjZVtpXTtcbiAgICAgIGlmIChpc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIGZsYXR0ZW5BcnJheShpdGVtLCB0YXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGFyZ2V0LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59XG4iXX0=