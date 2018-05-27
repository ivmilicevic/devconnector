const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    /* EMAIL VALIDATION */

    if (!Validator.isEmail(data.email)) {
        errors.email = "Email isn't valid";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }
    /* END OF EMAIL VALIDATION*/

    /* PASSWORD VALIDATION */
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    /* END OF PASSWORD VALIDATION */

    return {
        errors,
        isValid: isEmpty(errors)
    };
}