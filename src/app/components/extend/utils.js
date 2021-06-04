/* eslint "no-unused-vars": 0 */
/* eslint "angular/typecheck-object": 0 */
/**
 * 工具类
 * Created by wubinhong on 7/29/16.
 */
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    result = result.replace(new RegExp("({" + key + "})", "g"), args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    result = result.replace(new RegExp("({)" + i + "(})", "g"), arguments[i]);
                }
            }
        }
    }
    return result;
};

Array.prototype.contains = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === item) {
            return true;
        }
    }
    return false;
};

/**
 * [1, 2, 3, 4] --> arr.popMe(2) --> [3, 4, 1, 2]
 */
Array.prototype.popMe = function (size) {
    size = size || 1;
    var retArr = [];
    for (var i = 0; i < size; i++) {
        var pop = this.pop();
        if (pop) {
            this.splice(0, 0, pop);
            retArr.splice(0, 0, pop);
        }
    }
    return retArr;
};

/**
 * [1, 2, 3, 4] --> arr.shiftMe(2) --> [3, 4, 1, 2]
 */
Array.prototype.shiftMe = function (size) {
    size = size || 1;
    var retArr = [];
    for (var i = 0; i < size; i++) {
        var shift = this.shift();
        if (shift) {
            this.push(shift);
            retArr.push(shift);
        }
    }
    return retArr;
}


/***************************
 * 全局函数
 **************************/

/**
 * 判断为空<br>
 * isEmpty(""), // true
 * isEmpty(33), // true (arguably could be a TypeError)
 * isEmpty([]), // true
 * isEmpty({}), // true
 * isEmpty({length: 0, custom_property: []}), // true

 * isEmpty("Hello"), // false
 * isEmpty([1,2,3]), // false
 * isEmpty({test: 1}), // false
 * isEmpty({length: 3, custom_property: [1,2,3]}) // false
 * @param obj 对象
 * @returns {boolean}
 */
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}
