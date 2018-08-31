import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import indexRoutes from './containers';

import ApiLoader from './containers/ApiLoader/ApiLoader';
import { startApiInitialization } from './actions';

const PrivateRoute = ({ component: Component, isAuthorized, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            isAuthorized ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location },
                    }}
                />
            )
        }
    />
);

@withRouter
@connect(
    ({ app: { isInitialized, token } }) => ({ isInitialized, token }),
    { startApiInitialization },
)
class App extends Component {
    componentDidMount() {
        this.props.startApiInitialization();
    }

    renderRoutes = () => (
        <Switch>
            {indexRoutes.map(({ name, isPrivate = false, ...rest }, key) => {
                const RouteComponent = isPrivate ? PrivateRoute : Route;
                return <RouteComponent key={name} {...rest} isAuthorized={!!this.props.token} />;
            })}
        </Switch>
    );

    render() {
        return (
            <div className="wrapper">
                {this.props.isInitialized ? this.renderRoutes() : <ApiLoader />}
            </div>
        );
    }
}

export default App;
