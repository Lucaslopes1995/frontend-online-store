import React from 'react';

class ShoppingCart extends React.Component {
  constructor() {
    super();
    this.state = {
      listCart: [],
    };
  }

  render() {
    const { listCart } = this.state;
    const validListCart = (listCart.length === 0);

    return (
      <div>
        {validListCart && (
          <p data-testid="shopping-cart-empty-message">
            Seu carrinho está vazio
          </p>)}

      </div>
    );
  }
}

export default ShoppingCart;
