/**
Released under MIT and CC (https://creativecommons.org/licenses/by/4.0/) licenses
Copyright 2022 Carroll Bradford Inc. [https://dogood.carrollbradford.io/]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// ----------------------------------
import { installMixin } from './InstallMixin';

/**
 * Utility Helper Functions
 * @mixin Utility
 *
 */
const Utility = {};

// -----------------------------
// METHODS

/**
 * Inject State to a component
 * @function $__setState
 * @memberof Utility
 * @param {Object} machine Vue
 * @param {String} nextState Custom state name
 * @param {Function} callback Function to execute when done
 * @example this.$__setState (options api)
 * @example utils.$__setState (composition api) // needs to use inject const utils = inject('Utility');
 * @return void
 */
Utility.$__setState = function (machine, nextState, callback = false) {
    // get index of next state in current states array
    var index = machine[machine.$state].indexOf(nextState);
    // return early if next state doesn't exist
    if (index === -1) {
        if (machine.$state !== nextState) {
            console.error(`State Machine Error: ${machine.$state} => ${nextState} is not an allowed state transition.`);
        }
        return;
    }
    // set the next state
    this.$set(machine, '$state', nextState);
    this.$forceUpdate();

    // run the callback
    if (callback) {
        callback();
    }
};

/**
 * Form a valid Google search address
 * @function $__getGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} address
 * @return string
 */
Utility.$__getGoogleMapsAddress = function (address) {
    let search = '';

    if (_.isEmpty(address)) {
        return false;
    }

    if (_.isString(address)) {
        search = address;
    } else {
        let keys = ['address', 'address1', 'city', 'state', 'zip', 'zipcode'];
        let conditions = [
            Boolean(address.address) || Boolean(address.address1),
            Boolean(address.zip) || Boolean(address.zipcode),
            Boolean(address.city),
            Boolean(address.state),
        ];

        let hasFullAddress = _.every(conditions, (i) => {
            return Boolean(i);
        });

        if (hasFullAddress) {
            _.forEach(address, function (x, aKey) {
                keys.forEach((key) => {
                    if (_.includes(aKey, key)) {
                        if (!_.isEmpty(address[aKey])) {
                            search += ' ' + address[aKey];
                        }
                    }
                });
            });
        } else {
            return false;
        }
    }

    search = search.replace(/[\s+|,]/g, '+');
    search = 'https://maps.google.it/maps?q=' + search;

    return search;
};

/**
 * Open a google map
 * @function $__openGoogleMapsAddress
 * @memberof Utility
 * @param {String|Object} object
 * @return void|Toast
 */
Utility.$__openGoogleMapsAddress = function (object) {
    let address = this.$__getGoogleMapsAddress(object);
    if (address && _.isString(address)) {
        return $URL.open(address);
    }
    return Toast.error('The address you are trying to open has errors or not valid.');
};

/**
 * Mask a phone number as 000-000-0000
 * @function $__maskPhoneNumber
 * @memberof Utility
 * @param {String} phone
 * @return string
 */
Utility.$__maskPhoneNumber = function (phone) {
    const phone_val = phone.replace(/\D[^\.]/g, '');
    const phone_masked = phone_val.slice(0, 3) + '-' + phone_val.slice(3, 6) + '-' + phone_val.slice(6);
    return phone_masked;
};

/**
 * Validate a phone number (when Masked)
 * @function $__validatePhone
 * @memberof Utility
 * @param {String} phone
 * @return void|Toast
 */
Utility.$__validatePhone = function (phone) {
    var phoneRegex = /\d{3}[\-]\d{3}[\-]\d{4}/;
    return phoneRegex.test(phone);
};

/**
 * Validate emails
 * @function $__validateEmail
 * @memberof Utility
 * @param {String} email
 * @return void|Toast
 */
Utility.$__validateEmail = function (email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
};

/**
 * Generate unique ids
 * @function $__getDynamicId
 * @memberof Utility
 * @return string Format track__000000__000
 */
Utility.$__getDynamicId = function () {
    return 'track__' + new Date().getTime() + '__' + Math.floor(Math.random() * (999 - 100));
};

/**
 * Alias to $__getDynamicId
 * @function $__getRandomId
 * @memberof Utility
 * @return string
 */
Utility.$__getRandomId = function () {
    return this.$__getDynamicId();
};

/**
 * Format dates to standard US, with or w/out time
 * @function $__dateFormat
 * @memberof Utility
 * @param {String|Object} dateTime Raw format 2201-01-01 16:15PM or unix or object
 * @param {Boolean} wTime If set, returns date with time as H:MM A
 * @return string
 */
Utility.$__dateFormat = function (dateTime, wTime) {
    if (!dateTime) {
        return null;
    }
    var date = new moment(dateTime);
    return wTime ? date.format('MM/DD/YYYY @ h:mm A') : date.format('MM/DD/YYYY');
};

/**
 * Translate dollar amounts to decimal notation
 * @function $__currencyToDecimal
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 */
Utility.$__currencyToDecimal = function (amount) {
    return Number(amount.replace(/[^0-9.-]+/g, ''));
};

/**
 * Translate decimal notation to dollar amount
 * @function $__decimalToCurrency
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 */
Utility.$__decimalToCurrency = function (amount) {
    const formatConfig = {
        minimumFractionDigits: 2,
    };
    return new Intl.NumberFormat('en-GB', formatConfig).format(amount);
};

/**
 * (alias) $__decimalToCurrency
 * @function $__toCurrency
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 */
Utility.$__toCurrency = function (amount) {
    return this.$__decimalToCurrency(amount);
};

/**
 * Covert to dollar string
 * @function $__toDollarString
 * @memberof Utility
 * @param {String|Number} amount
 * @return number
 */
Utility.$__toDollarString = function (amount) {
    if (typeof amount === 'string') {
        amount = this.$__currencyToDecimal(amount);
    }

    if (Math.abs(amount) > 999 && Math.abs(amount) < 999999) {
        return Math.sign(amount) * (Math.abs(amount) / 1000).toFixed(1) + 'K';
    }
    if (Math.abs(amount) > 999999) {
        return Math.sign(amount) * (Math.abs(amount) / 1000000).toFixed(1) + 'M';
    }

    return Math.sign(amount) * Math.abs(amount);
};

/**
 * Check if there is a value, if not return null
 * @function $__emptyOrValue
 * @memberof Utility
 * @param {String|Number} value
 * @param {String|Number} _default The default value if empty
 * @return number
 */
Utility.$__emptyOrValue = function (value, _default) {
    /**
     * Test sequence:
     * If it is a number 0> : true
     * If is not undefined: true
     * If it is boolean (true|false) prevents going to empty
     * If it is not Empty, [], null, {}, 0, true, false: tue
     */

    if (_.isInteger(value) || _.isBoolean(value)) {
        return value;
    } else if (!_.isUndefined(value) && !_.isEmpty(value)) {
        return value;
    } else if (!_.isUndefined(_default) && !_.isEmpty(_default)) {
        return _default;
    }

    return null;
};

/**
 * Check if there is a number, if not return null
 * @function $__isNumber
 * @memberof Utility
 * @param {String|Number} value
 * @return bool|int
 */
Utility.$__isNumber = function (value) {
    if (_.isInteger(value) || !Number.isNaN(Number(value))) {
        return _.toNumber(value);
    }

    return false;
};

/**
 * @todo
 * Should be removed and replaced by $URL
 */
Utility.$__getURLParameters = function () {
    if (window.location.search.length === 0) return {};
    let paramArr = window.location.search.substring(1).split('&');
    let paramObj = {};
    paramArr.forEach((e) => {
        let param = e.split('=');
        if (param[0].endsWith('[]')) {
            paramObj[param[0].slice(0, -2)] = decodeURIComponent(param[1]).split(',');
        } else {
            paramObj[param[0]] = decodeURIComponent(param[1]);
        }
    });

    return paramObj;
};

/**
 * Logging into console in places where console cannot be called directly
 */
Utility.$__logThis = (obj) => {
    console.log(obj);
};

/**
 * Export
 */
export default installMixin(Utility, 'Utility');
