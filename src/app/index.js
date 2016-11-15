import React from "react";
import { render } from "react-dom";
import {Root} from "./components/Root";
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Router, Route, browserHistory, IndexRoute} from "react-router";

injectTapEventPlugin();

class App extends  React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <Router history={browserHistory}>
                    <Route path={"/(:next)"} component={Root}>
                    </Route>
                </Router>
            </MuiThemeProvider>
        )
    }
}

render(<App/>, window.document.getElementById("app"));
