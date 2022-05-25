import React from 'react';
import { Link } from 'react-router-dom';

const DECREASE_PRODUCT = -1;

class ShoppingCart extends React.Component {
  constructor() {
    super();
    this.state = {
      listCart: [],
      totalCart: 0,
    };
  }

  componentDidMount = () => {
    const getCart = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getCart || [];
    const total = ajusteFav.reduce((ant, at) => ant + at.tamanho, 0);
    this.setState({ listCart: ajusteFav, totalCart: total });
  }

  ajustNewProduct= (fav, op) => {
    const { listCart } = this.state;

    listCart.filter((el) => el.id !== fav.id);

    if (fav.tamanho < 2 && op === DECREASE_PRODUCT) {
      fav.tamanho = 1;
    } else {
      fav.tamanho += op;
    }

    if (fav.available_quantity === fav.tamanho - 1) {
      fav.tamanho = fav.available_quantity;
    }

    this.setState({ totalCart: 0 }, () => {
      const { listCart: Carrinho } = this.state;
      const total = Carrinho.reduce((ant, at) => ant + at.tamanho, 0);
      this.setState({ totalCart: total });
      localStorage.setItem('productCart', JSON.stringify(Carrinho));
    });
  }

  render() {
    const { listCart, totalCart } = this.state;
    const validListCart = (listCart.length === 0);
    return (
      <div>
        {validListCart && (
          <p data-testid="shopping-cart-empty-message">
            Seu carrinho está vazio
          </p>)}
        <div>
          {listCart.map((fav) => (
            <div key={ fav.id }>
              <p data-testid="shopping-cart-product-name">{fav.title}</p>
              <p data-testid="shopping-cart-product-quantity">{fav.tamanho}</p>
              <button
                type="button"
                data-testid="product-increase-quantity"
                onClick={ () => this.ajustNewProduct(fav, 1) }
              >
                +
              </button>
              <button
                type="button"
                data-testid="product-decrease-quantity"
                onClick={ () => this.ajustNewProduct(fav, DECREASE_PRODUCT) }
              >
                -
              </button>

            </div>

          ))}
          <h2 data-testid="shopping-cart-size">{totalCart}</h2>
          <Link
            to="/checkout"
            data-testid="checkout-products"
          >
            Finalizar Compra
          </Link>
        </div>
      </div>
    );
  }
}
export default ShoppingCart;
