import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import Loader from '../../components/Loader/Loader';
import { startApiInitialization } from '../../actions';

@connect(
    ({ app }) => ({ error: app.apiError }),
    dispatch => ({ startApiInitialization: () => dispatch(startApiInitialization()) }),
)
class ApiLoader extends Component {
    startApiInitialization = () => void 0;

    renderRetry = () => {
        const { error } = this.props;

        return (
            <div
                className={classNames(
                    'd-flex',
                    'flex-column',
                    'align-items-center',
                    'justify-content-center',
                )}>
                <div className={classNames('m-3', 'text-danger')}>
                    {(error && error.message) || 'Something went wrong'}
                </div>
                <Button onClick={this.props.startApiInitialization}>
                    <i class="now-ui-icons arrows-1_refresh-69" />
                    <span className={classNames('pl-3')}>Try again</span>
                </Button>
            </div>
        );
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
                )}>
                {this.props.error ? this.renderRetry() : <Loader loaderTitle="Loading ..." />}
            </div>
        );
    }
}

export default ApiLoader;
