import React, { Component } from 'react';
import { FormGroup, FormFeedback, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
// used for making the prop types of this component
import PropTypes from 'prop-types';

class FieldGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
        };
    }
    render() {
        const {
            label,
            addonLeft,
            addonRight,
            formGroupProps,
            labelProps,
            inputProps,
            error,
            inputGroupProps,
            inputGroupAddonProps,
        } = this.props;
        let classes = ' ';
        if (inputGroupProps !== undefined) {
            if (inputGroupProps.className !== undefined) {
                classes += inputGroupProps.className + ' ';
            }
        }
        if (addonLeft !== undefined || addonRight !== undefined)
            return (
                <InputGroup
                    {...inputGroupProps}
                    className={classes + (this.state.focus ? 'input-group-focus' : '')}>
                    {addonLeft !== undefined ? (
                        <InputGroupAddon {...inputGroupAddonProps}>{addonLeft}</InputGroupAddon>
                    ) : (
                        ''
                    )}
                    <Input
                        {...inputProps}
                        {...(error ? { invalid: true } : null)}
                        onFocus={e => this.setState({ focus: true })}
                        onBlur={e => this.setState({ focus: false })}
                    />
                    {addonRight !== undefined ? (
                        <InputGroupAddon {...inputGroupAddonProps}>{addonRight}</InputGroupAddon>
                    ) : (
                        ''
                    )}
                    {error ? <FormFeedback>{error}</FormFeedback> : null}
                </InputGroup>
            );
        return inputProps.type === 'radio' || inputProps.type === 'checkbox' ? (
            <FormGroup
                {...formGroupProps}
                className={inputProps.type === 'radio' ? 'form-check-radio' : ''}>
                <Label {...labelProps}>
                    <Input {...inputProps} {...(error ? { invalid: true } : null)} />
                    <span className="form-check-sign" />
                    {label ? label : ''}
                    {error ? <FormFeedback>{error}</FormFeedback> : null}
                </Label>
            </FormGroup>
        ) : (
            <FormGroup {...formGroupProps}>
                {label ? <Label {...labelProps}>{label}</Label> : ''}
                <Input {...inputProps} {...(error ? { invalid: true } : null)} />
                {error ? <FormFeedback>{error}</FormFeedback> : null}
            </FormGroup>
        );
    }
}

export class FormInputs extends Component {
    render() {
        const row = [];
        for (let i = 0; i < this.props.ncols.length; i++) {
            row.push(
                <div key={i} className={this.props.ncols[i]}>
                    <FieldGroup {...this.props.attributes[i]} />
                </div>,
            );
        }
        return (
            <div className="row" style={{ ...this.props.style }}>
                {row}
            </div>
        );
    }
}

FormInputs.propTypes = {
    ncols: PropTypes.arrayOf(PropTypes.string),
    attributes: PropTypes.arrayOf(PropTypes.object),
};

export default FormInputs;
