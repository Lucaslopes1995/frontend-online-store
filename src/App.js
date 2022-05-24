import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './pages/Home';

class App extends React.Component {
  constructor() {
    super();
    this.renderRouter = this.renderRouter.bind(this);
  }

  renderRouter() {
    return (
      <Route exact path="/" component={ Home } />
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
