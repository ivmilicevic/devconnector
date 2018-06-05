import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from "constants";

const Validator = require('validator');
const isEmpty = require('./is-empty');


module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    /* Handle validation */
    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = 'Handle needs to be between 2 and 40 characters';
    }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    }
    /* End of handle validation */

    /* Status validation */
    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }

    /* Skills validation */
    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field is required';
    }

    /* Social links validation */
    if (Validator.isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }

    if (Validator.isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = 'Not a valid URL';
        }
    }

    if (Validator.isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }

    if (Validator.isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }

    if (Validator.isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = 'Not a valid URL';
        }
    }

    if (Validator.isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }

    /* End of social links validation */

    return {
        errors,
        isValid: isEmpty(errors)
    };
}