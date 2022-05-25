import React from 'react';
import PropTypes from 'prop-types';
import { getCategories, getProductsByNameAndCategory } from '../services/api';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      listProducts: [],
      listCategories: [],
      selectedRadio: '',
      filteredProducts: [],
      cartProducts: [],
      totalCart: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.setCategories = this.setCategories.bind(this);
  }

  componentDidMount() {
    const getFavorites = JSON.parse(localStorage.getItem('productCart')) || [];

    const total = getFavorites.reduce((ant, at) => ant + at.tamanho, 0);

    const ajusteFav = getFavorites || [];
    this.setState({ cartProducts: ajusteFav, totalCart: total });

    this.setCategories();
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState(() => ({ [name]: value }));
  }

  handleChangeRadio(el) {
    this.setState({ selectedRadio: el.id }, async () => {
      this.handleButton();
    });
  }

  handleButton = async () => {
    const { inputValue, selectedRadio } = this.state;
    if (inputValue !== '' || selectedRadio !== '') {
      const productsByNameAndCategory = await
      getProductsByNameAndCategory(selectedRadio, inputValue);
      this.setState({ filteredProducts: productsByNameAndCategory });
    }
  }

  async setCategories() {
    /* console.log(await getProductsByNameAndCategory('Agro', '')); */
    const categories = (await getCategories());
    this.setState({ listCategories: categories });
  }

  addToCart = (product) => {
    const { cartProducts } = this.state;
    if (cartProducts.find((el) => el.id === product.id) === undefined) {
      product.tamanho = 1;
      this.setState({ cartProducts: [...cartProducts, product] }, () => {
        const { cartProducts: Carrinho } = this.state;
        localStorage.setItem('productCart', JSON.stringify(Carrinho));
      });
    } else {
      let index;
      [...cartProducts].find((el, i) => {
        if (el.id === product.id) {
          index = i;
          return true;
        }
        return false;
      });

      cartProducts[index].tamanho += 1;
      this.setState({ cartProducts }, () => {
        const { cartProducts: Carrinho } = this.state;
        localStorage.setItem('productCart', JSON.stringify(Carrinho));
      });
      if (product.available_quantity === product.tamanho - 1) {
        product.tamanho = product.available_quantity;
      }
    }

    this.setState((state) => {
      const { cartProducts: cartAtualizado } = state;
      const total = cartAtualizado.reduce((ant, at) => ant + at.tamanho, 0);
      return { totalCart: total };
    });
  }

  render() {
    const { inputValue, listProducts, listCategories, selectedRadio,
      filteredProducts, totalCart } = this.state;
    const { history } = this.props;
    const validListProducts = (listProducts.length === 0);
    return (
      <div>
        <input
          name="inputValue"
          type="text"
          value={ inputValue }
          onChange={ this.handleChange }
          data-testid="query-input"
        />
        <button
          type="button"
          data-testid="query-button"
          onClick={ this.handleButton }
        >
          Buscar
        </button>
        {validListProducts && (
          <p data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>)}
        <button
          type="button"
          data-testid="shopping-cart-button"
          onClick={ () => history.push('/cart') }
        >
          Carrinho
        </button>
        <div>
          {listCategories.map((el) => (
            <label key={ el.id } data-testid="category" htmlFor={ el.id }>
              <input
                id={ el.id }
                name="category"
                onChange={ () => this.handleChangeRadio(el) }
                type="radio"
                value={ el.name === selectedRadio }
              />
              {el.name}
            </label>
          ))}
        </div>
        <div>
          {filteredProducts.map((cada) => (
            <div
              data-testid="product"
              key={ cada.title }
            >
              {cada.shipping.free_shipping && (
                <p data-testid="free-shipping">Frete Grátis</p>)}
              <p>{cada.title}</p>
              <p>{cada.price}</p>
              <button
                type="button"
                onClick={ () => history.push({ pathname: `/product/${cada.id}`,
                  state: (cada) }) }
                data-testid="product-detail-link"
              >
                Detalhes
              </button>
              <button
                type="button"
                onClick={ () => this.addToCart(cada) }
                data-testid="product-add-to-cart"
              >
                Carrinho
              </button>
            </div>
          ))}
          <h2 data-testid="shopping-cart-size">{totalCart}</h2>
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default Home;
