import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Alert, Card, CardBody, Row, Col, Button } from 'reactstrap';
import { Redirect, withRouter } from 'react-router-dom';
import { FormInputs } from '../../components';
import { loginUser } from '../../actions';

import bg1 from 'assets/img/bg1.jpg';
import bg2 from 'assets/img/bg2.jpg';
import bg3 from 'assets/img/bg3.jpg';
import bg4 from 'assets/img/bg4.jpg';
import bg5 from 'assets/img/bg5.jpg';
import bg6 from 'assets/img/bg6.jpg';
import bg7 from 'assets/img/bg7.jpg';

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6, bg6, bg7];
const backgroundIndex = _.random(0, backgrounds.length - 1);

@withRouter
@connect(
    ({ app }) => app,
    dispatch => ({ login: (email, password) => dispatch(loginUser(email, password)) }),
)
class Login extends React.Component {
    static propTypes = {
        AuthStore: PropTypes.object,
        location: PropTypes.object,
    };

    state = { email: 'ucap.ops.manager@gmail.com', password: 'testpass' };

    logIn = (event, ...args) => {
        event.preventDefault();
        this.props.login(this.state);
    };

    render() {
        const { authError, isLoggingIn, token } = this.props;

        if (!authError && !isLoggingIn && token) {
            const { state: { from } = { from: { pathname: '/' } } } = this.props.location;
            return <Redirect to={from} />;
        }
        return (
            <div className="wrapper" style={styles.container}>
                <Row>
                    <Col sm={12}>
                        <Card style={styles.card}>
                            <CardBody>
                                <Alert
                                    color="danger"
                                    className="alert-with-icon"
                                    isOpen={authError}>
                                    <span
                                        data-notify="icon"
                                        className="now-ui-icons ui-1_bell-53"
                                    />
                                    <span data-notify="message">
                                        {authError ? authError.message : ''}
                                    </span>
                                </Alert>
                                <form onSubmit={this.logIn}>
                                    <FormInputs
                                        ncols={['col-md-12']}
                                        attributes={[
                                            {
                                                inputProps: {
                                                    type: 'email',
                                                    placeholder: 'Email address',
                                                    value: this.state.email,
                                                    onChange: evt =>
                                                        this.setState({ email: evt.target.value }),
                                                },
                                            },
                                        ]}
                                    />
                                    <FormInputs
                                        ncols={['col-md-12']}
                                        attributes={[
                                            {
                                                inputProps: {
                                                    type: 'password',
                                                    placeholder: 'Password',
                                                    value: this.state.password,
                                                    onChange: evt =>
                                                        this.setState({
                                                            password: evt.target.value,
                                                        }),
                                                },
                                            },
                                        ]}
                                    />
                                    <div style={styles.button}>
                                        <Button color="primary" size="lg" className="btn-round">
                                            Log in
                                        </Button>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const styles = {
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        display: 'flex',
        backgroundImage: `url(${backgrounds[backgroundIndex]})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    },
    card: {
        minWidth: 400,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
    },
};

export default Login;
