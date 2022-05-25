import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../components/Checkbox';

const VERIFICA_CHECKBOX = { 3: 3, 4: 4 };
const DECREASE_PRODUCT = -1;

class ProductInfo extends React.Component {
  state = {
    cartProducts: [],
    product: {},
    checkbox0: false,
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    showReview: false,
    email: '',
    obs: '',
    totalCart: 0,

  }

  componentDidMount = () => {
    const { location: { state: infos } } = this.props;

    let getFavorites = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getFavorites || [];

    const getReview = JSON.parse(localStorage.getItem('review')) || [];

    getReview.find((el) => {
      if (el.id === infos.id) {
        infos.review = el;
        return true;
      }
      return false;
    });

    const verificaQtd = ajusteFav.find((el) => {
      if (el.id === infos.id) {
        if (el.tamanho === undefined) {
          el.tamanho = 0;
          infos.tamanho = 0;
        }
        infos.tamanho = el.tamanho;
        return true;
      }
      return false;
    });

    if (verificaQtd === undefined) {
      infos.tamanho = 0;
    }

    getFavorites = ajusteFav;
    this.setState({ cartProducts: getFavorites, product: infos }, () => {
      const { product } = this.state;

      if (product.review) {
        this.setState({ showReview: true });
      }
    });
    const total = ajusteFav.reduce((ant, at) => ant + at.tamanho, 0);
    this.setState({ totalCart: total });
  }

  addToCart = (op) => {
    const { product } = this.state;
    const getFavorites = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getFavorites || [];
    let ajustedCart = ajusteFav.filter((el) => el.id !== product.id);
    // console.log(product)
    if (product.tamanho < 2 && op === DECREASE_PRODUCT) {
      product.tamanho = 1;
    } else {
      product.tamanho = (product.tamanho) ? product.tamanho += op : 1;
    }

    if (product.available_quantity === product.tamanho - 1) {
      product.tamanho = product.available_quantity;
    }

    ajustedCart = [...ajustedCart, product];

    this.setState({ cartProducts: ajustedCart }, () => {
      const { cartProducts: Carrinho } = this.state;
      localStorage.setItem('productCart', JSON.stringify(Carrinho));
      const total = Carrinho.reduce((ant, at) => ant + at.tamanho, 0);
      this.setState({ totalCart: total });
    });
  }

  validCheckbox = (index) => {
    this.setState({
      checkbox0: index >= 0,
      checkbox1: index >= 1,
      checkbox2: index >= 2,
      checkbox3: index >= VERIFICA_CHECKBOX[3],
      checkbox4: index >= VERIFICA_CHECKBOX[4],
    });
  }

  handleInput = ({ target }) => {
    const { name, value } = target;

    this.setState({ [name]: value });
  }

  handlesubmit = (e) => {
    const { cartProducts, product,
      checkbox0, checkbox1, checkbox2, checkbox3, checkbox4, email, obs } = this.state;

    let getReview = JSON.parse(localStorage.getItem('review')) || [];
    const aux1 = { checkbox0, checkbox1, checkbox2, checkbox3, checkbox4 };

    getReview = [...getReview,
      { id: product.id, ...aux1, email, obs }];

    const a = [...cartProducts];
    a.forEach((el) => {
      if (el.id === product.id) {
        const aux = { product, checkbox0, checkbox1, checkbox2 };
        el.review = { ...aux, checkbox3, checkbox4, email, obs };
      }
    });
    e.preventDefault();
    product.review = (
      { product, checkbox0, checkbox1, checkbox2, checkbox3, checkbox4, email, obs });
    this.setState(() => this.setState({ product, email: '', obs: '' }),
      () => this.setState({ showReview: true }));

    localStorage.setItem('review', JSON.stringify(getReview));
  }

  render() {
    const { location: { state: infos }, history } = this.props;
    const { product, checkbox0, checkbox1, checkbox2,
      checkbox3, checkbox4, showReview, email, obs } = this.state;
    const { totalCart } = this.state;
    const { checkbox0: rv0, checkbox1: rv1,
      checkbox2: rv2, checkbox3: rv3, checkbox4: rv4,
      email: emailReview, obs: obsReview } = product.review || product;

    return (
      <div>
        <form onSubmit={ this.handlesubmit }>
          <p data-testid="product-detail-name">{product.title}</p>
          <input
            data-testid="product-detail-email"
            name="email"
            type="email"
            value={ email }
            onChange={ (e) => this.handleInput(e) }
          />

          <Checkbox dti="1-rating" ch={ checkbox0 } oc={ this.validCheckbox } d="n" />
          <Checkbox dti="2-rating" ch={ checkbox1 } oc={ this.validCheckbox } d="n" />
          <Checkbox dti="3-rating" ch={ checkbox2 } oc={ this.validCheckbox } d="n" />
          <Checkbox dti="4-rating" ch={ checkbox3 } oc={ this.validCheckbox } d="n" />
          <Checkbox dti="5-rating" ch={ checkbox4 } oc={ this.validCheckbox } d="n" />
          <button type="submit" data-testid="submit-review-btn">Enviar Avaliação</button>
          <textarea
            name="obs"
            value={ obs }
            data-testid="product-detail-evaluation"
            onChange={ (e) => this.handleInput(e) }
          />

          <button
            type="button"
            data-testid="product-detail-add-to-cart"
            onClick={ () => this.addToCart(infos, 1) }
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

          <p>Quantidade</p>
          <button
            type="button"
            data-testid="product-increase-quantity"
            onClick={ () => this.addToCart(1) }
          >
            +
          </button>
          <p data-testid="product-detail-quantidade">{product.tamanho}</p>
          <button
            type="button"
            data-testid="product-decrease-quantity"
            onClick={ () => this.addToCart(DECREASE_PRODUCT) }
          >
            -
          </button>

        </form>

        <h2 data-testid="shopping-cart-size">{totalCart}</h2>

        {showReview && (
          <div>
            <p>{emailReview}</p>
            <p>{obsReview}</p>
            <Checkbox dti="review-1-rating" ch={ rv0 } oc={ this.validCheckbox } d="s" />
            <Checkbox dti="review-2-rating" ch={ rv1 } oc={ this.validCheckbox } d="s" />
            <Checkbox dti="review-3-rating" ch={ rv2 } oc={ this.validCheckbox } d="s" />
            <Checkbox dti="review-4-rating" ch={ rv3 } oc={ this.validCheckbox } d="s" />
            <Checkbox dti="review-5-rating" ch={ rv4 } oc={ this.validCheckbox } d="s" />

          </div>
        )}
      </div>
    );
  }
}
ProductInfo.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,

};

export default ProductInfo;
