import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShoppingCart from './pages/ShoppingCart';
import ProductInfo from './pages/ProductInfo';

class App extends React.Component {
  constructor() {
    super();
    this.renderRouter = this.renderRouter.bind(this);
  }

  renderRouter() {
    return (
      <>
        <Route exact path="/" component={ Home } />
        <Route path="/cart" component={ ShoppingCart } />
        <Route path="/product/:id" component={ ProductInfo } />
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
