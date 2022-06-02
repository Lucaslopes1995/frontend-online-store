import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../components/Checkbox';
import Header from '../components/Header';
import './ProductInfo.css'
import star from '../images/estrela.png'
import starVazia from '../images/estrela-vazia.svg'

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
    allreviews:[]

  }

  componentDidMount = () => {
    const { location: { state: infos } } = this.props;

    let getFavorites = JSON.parse(localStorage.getItem('productCart'));
    const ajusteFav = getFavorites || [];

    const getReview = JSON.parse(localStorage.getItem('review')) || [];

    const filteredReview = getReview.filter((el) => {
      if (el.id === infos.id) {
        infos.review = el;
        return true;
      }
      return false;
    });

    this.setState({allreviews:filteredReview})

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
      // console.log("carrinho",Carrinho)
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
    const { location: { state: infos } } = this.props;
    const { product,
      checkbox0, checkbox1, checkbox2, checkbox3, checkbox4, email, obs } = this.state;

    let getReview = JSON.parse(localStorage.getItem('review')) || [];
    const aux1 = { checkbox0, checkbox1, checkbox2, checkbox3, checkbox4 };

    

    getReview = [...getReview,
      { id: product.id, ...aux1, email, obs }];

    const filteredReview = getReview.filter((el) => {
      if (el.id === infos.id) {
        infos.review = el;
        return true;
      }
      return false;
    });

    // const a = [...cartProducts];
    // a.forEach((el) => {
    //   if (el.id === product.id) {
    //     const aux = { product, checkbox0, checkbox1, checkbox2 };
    //     el.review = { ...aux, checkbox3, checkbox4, email, obs };
    //   }
    // });
    e.preventDefault();
    // product.review = (
    //   { product, checkbox0, checkbox1, checkbox2, checkbox3, checkbox4, email, obs });
    this.setState(() => this.setState({ product, email: '', obs: '',checkbox0:false, checkbox1:false, checkbox2:false, checkbox3:false, checkbox4:false }),
      () => this.setState({ showReview: true, allreviews:filteredReview }));

    localStorage.setItem('review', JSON.stringify(getReview));
  }

  render() {
    // const { location: { state: infos }, history } = this.props;
    const {history} = this.props;
    const { product, checkbox0, checkbox1, checkbox2,
      checkbox3, checkbox4, showReview, email, obs, allreviews } = this.state;
    const { totalCart } = this.state;

    return (
      <div className='page-product-info'>
        <Header history={history}/>
        <div className='product-info'>
        <div className='carac-product'>
          <p className="product-detail-name">{product.title}</p>
          <img src={product.thumbnail} alt={product.title}/>

          <p className="details-price">R$ {product.price?.toLocaleString('pt-BR')}</p>

          <p>Quantidade</p>
          <button
          className='button-inc-dec'
            type="button"
            data-testid="product-increase-quantity"
            onClick={ () => this.addToCart(1) }
            disabled={product.available_quantity === product.tamanho}
          >
            +
          </button>
          <p data-testid="product-detail-quantidade">{product.tamanho}</p>
          <button
          className='button-inc-dec'
            type="button"
            data-testid="product-decrease-quantity"
            onClick={ () => this.addToCart(DECREASE_PRODUCT) }
          >
            -
          </button>

          <button
          className='go-cart'
            onClick={ () => history.push('/frontend-online-store/cart') }
            type="button"
            data-testid="shopping-cart-button"
          >
            Ir para o Carrinho

          </button>

          <h2 data-testid="shopping-cart-size">{'Quantidade total de produtos no Carrinho: ' +totalCart}</h2>


        </div>
        
        <hr/>
        <form onSubmit={ this.handlesubmit } className='form-avaliation'>
          <h3>Deixe sua Avaliação do Produto</h3>
          <input
            placeholder='email'
            data-testid="product-detail-email"
            name="email"
            type="email"
            value={ email }
            onChange={ (e) => this.handleInput(e) }
            autocomplete='off'
          />
          <div className='all-stars'>
          <label htmlFor='1-rating' className='label-stars-sending'>
            <Checkbox dti="1-rating" ch={ checkbox0 } oc={ this.validCheckbox } d="n" />
            <img src={checkbox0 ? star :starVazia} alt='star' />
          </label>
          <label htmlFor='2-rating' className='label-stars-sending'>

            <Checkbox dti="2-rating" ch={ checkbox1 } oc={ this.validCheckbox } d="n" />
            <img src={checkbox1 ? star :starVazia} alt='star' />
          </label>
          <label htmlFor='3-rating' className='label-stars-sending'>

            <Checkbox dti="3-rating" ch={ checkbox2 } oc={ this.validCheckbox } d="n" />
            <img src={checkbox2 ? star :starVazia} alt='star' />
          </label>
          <label htmlFor='4-rating' className='label-stars-sending'>

            <Checkbox dti="4-rating" ch={ checkbox3 } oc={ this.validCheckbox } d="n" />
            <img src={checkbox3 ? star :starVazia} alt='star' />
          </label>
          <label htmlFor='5-rating' className='label-stars-sending'>

            <Checkbox dti="5-rating" ch={ checkbox4 } oc={ this.validCheckbox } d="n" />
            <img src={checkbox4 ? star :starVazia} alt='star' />
          </label>
          </div>
          
          <textarea
            placeholder='mensagem'
            name="obs"
            value={ obs }
            data-testid="product-detail-evaluation"
            onChange={ (e) => this.handleInput(e) }
          />
          <button type="submit" data-testid="submit-review-btn">Enviar Avaliação</button>

          

          

        </form>

       <hr/>
        <div className='all-reviews'>
          {showReview && (allreviews.map((el,i,arr)=> (
            <div className='review'>
              <p className='review-text-area'>{el.obs}</p>
              <p>{el.email}</p>
              <div>

                
              </div>

              <div className='all-stars'>
              <label htmlFor='review-1-rating' className='label-stars-sending'>
              <Checkbox dti="review-1-rating" ch={ el.checkbox0 } oc={ this.validCheckbox } d="s" />
              <img src={el.checkbox0 ? star :starVazia} alt='star' />
              </label>
              <label htmlFor='review-2-rating' className='label-stars-sending'>
              <Checkbox dti="review-2-rating" ch={ el.checkbox1 } oc={ this.validCheckbox } d="s" />
              <img src={el.checkbox1 ? star :starVazia} alt='star' />
              </label>
              <label htmlFor='review-3-rating' className='label-stars-sending'>
              <Checkbox dti="review-3-rating" ch={ el.checkbox2 } oc={ this.validCheckbox } d="s" />
              <img src={el.checkbox2 ? star :starVazia} alt='star' />
              </label>
              <label htmlFor='review-4-rating' className='label-stars-sending'>
              <Checkbox dti="review-4-rating" ch={ el.checkbox3 } oc={ this.validCheckbox } d="s" />
              <img src={el.checkbox3 ? star :starVazia} alt='star' />
              </label>
              <label htmlFor='review-5-rating' className='label-stars-sending'>
              <Checkbox dti="review-5-rating" ch={ el.checkbox4 } oc={ this.validCheckbox } d="s" />
              <img src={el.checkbox4 ? star :starVazia} alt='star' />
              </label>
              </div>

              {(i!==arr.length-1) && <hr/>}

            </div>))
          )}
        </div>
      </div>
      </div>
    );
  }
}
ProductInfo.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,

};

export default ProductInfo;
