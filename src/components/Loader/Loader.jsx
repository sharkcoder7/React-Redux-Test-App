import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Loader extends Component {
    static propTypes = {
        loaderTitle: PropTypes.string,
    };

    static defaultProps = {
        loaderTitle: 'Loading',
    };

    render() {
        return (
            <div
                className={classNames(
                    'd-flex',
                    'h-100',
                    'flex-column',
                    'align-items-center',
                    'justify-content-center',
                    'font-weight-bold',
                )}>
                <i className="now-ui-icons loader_gear spin" />
                {this.props.loaderTitle}
            </div>
        );
    }
}

export default Loader;
