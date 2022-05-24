import React from 'react';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      listProducts: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState(() => ({ [name]: value }));
  }

  render() {
    const { inputValue, listProducts } = this.state;
    const validListProducts = (listProducts.length === 0);
    return (
      <div>

        <input
          name="inputValue"
          type="text"
          value={ inputValue }
          onChange={ this.handleChange }
        />
        {validListProducts && (
          <p data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>)}
      </div>
    );
  }
}

export default Home;
