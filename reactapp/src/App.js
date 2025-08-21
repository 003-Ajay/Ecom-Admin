import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OrderPage from './OrderPage';
import ProductPage from './ProductPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/orders" component={OrderPage} />
                <Route path="/products" component={ProductPage} />
                {/* Other routes */}
            </Switch>
        </Router>
    );
}

export default App;
