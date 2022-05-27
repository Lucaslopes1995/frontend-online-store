import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShoppingCart from './pages/ShoppingCart';
import ProductInfo from './pages/ProductInfo';
import CheckOut from './pages/CheckOut';

class App extends React.Component {
  constructor() {
    super();
    this.renderRouter = this.renderRouter.bind(this);
  }

  renderRouter() {
    return (
      <>
        <Route exact path="/frontend-online-store/" component={ Home } />
        <Route path="/frontend-online-store/cart" component={ ShoppingCart } />
        <Route path="/frontend-online-store/product/:id" component={ ProductInfo } />
        <Route path="/frontend-online-store/checkout" component={ CheckOut } />
      </>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          {this.renderRouter() }
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
