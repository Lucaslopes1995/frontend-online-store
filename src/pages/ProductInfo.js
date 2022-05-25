import React from 'react';
import PropTypes from 'prop-types';

class ProductInfo extends React.Component {
  state = {
    cartProducts: [],
  }

  componentDidMount = () => {
    let getFavorites = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getFavorites || [];
    getFavorites = ajusteFav;
    this.setState({ cartProducts: getFavorites });
  }

  addToCart = (product) => {
    const { cartProducts } = this.state;
    this.setState({ cartProducts: [...cartProducts, product] }, () => {
      const { cartProducts: Carrinho } = this.state;
      localStorage.setItem('productCart', JSON.stringify(Carrinho));
    });
  }

  render() {
    const { location: { state: infos }, history } = this.props;

    return (
      <div>
        <button
          type="button"
          data-testid="product-detail-add-to-cart"
          onClick={ () => this.addToCart(infos) }
        >
          Adicionar ao carrinho
        </button>

        <button
          onClick={ () => history.push('/cart') }
          type="button"
          data-testid="shopping-cart-button"
        >
          Ir para o Carrinho

        </button>
        <p data-testid="product-detail-name">{infos.title}</p>
      </div>
    );
  }
}
ProductInfo.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,

};

export default ProductInfo;
