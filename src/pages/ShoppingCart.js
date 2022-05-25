import React from 'react';

class ShoppingCart extends React.Component {
  constructor() {
    super();
    this.state = {
      listCart: [],
    };
  }
  
  componentDidMount = () => {
    let getFavorites = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getFavorites || [];
    getFavorites = ajusteFav;
    let c = [];
    getFavorites.map((favorite) => {
      const b = getFavorites.filter((elem) => elem.id === favorite.id);
      if (c.find((el) => el.id === favorite.id) === undefined) {
        c = [...c, favorite];
      }
      favorite.tamanho = b.length;
      this.setState({ listCart: c });
      return favorite;
    });
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
        <div>
          {listCart.map((fav) => (
            <div key={ fav.id }>
              <p data-testid="shopping-cart-product-name">{fav.title}</p>
              <p data-testid="shopping-cart-product-quantity">{fav.tamanho}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default ShoppingCart;
