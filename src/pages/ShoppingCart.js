import React from 'react';
import { Link } from 'react-router-dom';
import delItem from '../images/lixeira.png'
import './ShoppingCart.css';

const DECREASE_PRODUCT = -1;

class ShoppingCart extends React.Component {
  constructor() {
    super();
    this.state = {
      listCart: [],
      totalCart: 0,
      valortotalCart: 0,
    };
  }

  componentDidMount = () => {
    const getCart = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getCart || [];
    const total = ajusteFav.reduce((ant, at) => ant + at.tamanho, 0);
    const valorTotal = ajusteFav.reduce((ant, at) => ant + at.tamanho*at.price, 0);
    this.setState({ listCart: ajusteFav, totalCart: total, valortotalCart: valorTotal});
  }

  ajustNewProduct= (fav, op, del) => {
    const { listCart } = this.state;
    const {changeTotalProducts} = this.props

    if(del){
      const a = listCart.filter((el) => el.id !== fav.id);
      this.setState({listCart: a},this.setState((state)=>{
        const total = a.reduce((ant, at) => ant + at.tamanho, 0);
        const valorTotal = a.reduce((ant, at) => ant + at.tamanho*at.price, 0);
        if(changeTotalProducts){

          changeTotalProducts(total)
        }
        return {totalCart:total, valortotalCart: valorTotal}}))
      localStorage.setItem('productCart', JSON.stringify(a));
      return false
    }

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
      const valorTotal = Carrinho.reduce((ant, at) => ant + at.tamanho*at.price, 0);
      if(changeTotalProducts){

        changeTotalProducts(total)
      }
      this.setState({ totalCart: total, valortotalCart:valorTotal });
      localStorage.setItem('productCart', JSON.stringify(Carrinho));
    });
  }

  render() {
    const { listCart, totalCart, valortotalCart } = this.state;
    const validListCart = (listCart.length === 0);
    return (
      <div className='shooping-cart-div'>
        {validListCart && (
          <p data-testid="shopping-cart-empty-message">
            Seu carrinho está vazio
          </p>)}
        <div className='div-cart-all-products'>
          {listCart.map((fav) => (
            <div key={ fav.id } className='all-cart'>
              <div className='text-image-price'>
                <div className='div-cart-image'>
                  <img src={fav.thumbnail} alt={fav.title} className='img-product-cart'/>
                </div>
                <div className='div-cart-name'>
                  <p data-testid="shopping-cart-product-name">{fav.title}</p>

                </div>
                <div className='div-cart-price'>
                  <p data-testid="shopping-cart-product-name">{"R$ "+fav.price.toLocaleString('pt-BR')}</p>

                </div>
              </div>
                <div className='div-ajust-product'>
                <button
                  type="button"
                  data-testid="product-increase-quantity"
                  onClick={ () => this.ajustNewProduct(fav, 1,false) }
                  disabled={fav.available_quantity === fav.tamanho}
                >
                  +
                </button>
                
                <p data-testid="shopping-cart-product-quantity">{fav.tamanho}</p>
                <button
                  type="button"
                  data-testid="product-decrease-quantity"
                  onClick={ () => this.ajustNewProduct(fav, DECREASE_PRODUCT,false) }
                >
                  -
                </button>
                <div className='div-del-product'>

                  <img
                  src={delItem} alt='lixeira'
                    className='img-del-product'
                    onClick={ () => this.ajustNewProduct(fav, DECREASE_PRODUCT,true) }
                  />

                </div>

              </div>
              

            </div>

          ))}
          <div className='div-total'>
            <div className='div-total-produtos'>
              <h2>Total de Produtos:</h2>
              <span data-testid="shopping-cart-size">{totalCart}</span>
            </div>
            <div className='div-total-valor'>
              <h2>Valor Total:</h2>
              <span data-testid="shopping-cart-size">R$ {valortotalCart.toLocaleString('pt-BR')}</span>
            </div>
            
            <Link
              className='a-finalizar-compra'
              to="/frontend-online-store/checkout"
              data-testid="checkout-products"
            >
              Finalizar Compra
            </Link>

          </div>
        </div>
      </div>
    );
  }
}
export default ShoppingCart;
