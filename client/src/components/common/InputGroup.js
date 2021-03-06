import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = ({ name, placeholder, value, error, onChange, icon, type }) => {
    return (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                    <i className={icon} />
                </span>
            </div>
            <input
                placeholder={placeholder}
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
            />
            {error && (<div className='invalid-feedback'>{error}</div>)}
        </div>
    )
};

InputGroup.defaultProps = {
    type: 'text'
}

InputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    icon: PropTypes.string,
    type: PropTypes.string.isRequired
};


export default InputGroup;