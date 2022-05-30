import React from 'react';
import PropTypes from 'prop-types';
import { getCategories, getProductsByNameAndCategory } from '../services/api';
import ModalCategories from '../components/ModalCategories';
import './Home.css'
import loading from '../images/Loading_icon1.gif'
import logo from '../images/mercadoLivre.png'
import ShoppingCart from './ShoppingCart';
import lupa from '../images/lupa.png'
import menu from '../images/menu.png'
import carrinho from '../images/carrinho.png'


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
      APIAwait:true,
      selectedFilter:'',
      showCategories:false,
      showFilter:false,
      filterFrete:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.setCategories = this.setCategories.bind(this);
  }
  
  componentDidMount() {
    const { location: { state: infos } } = this.props;

    if(infos==='categoria'){
      this.setState({showCategories:true})
    }else if(infos==='carrinho'){
      this.setState({showCart:true})
    }
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

  handleChangeRadio(e,el) {
    this.setState({ selectedRadio: el.id, showCategories:false }, async () => {
      this.handleButton(e);
    });
  }
  ordenaProducts = (products) => {
    const {selectedFilter} = this.state;
    let aux;
    if(selectedFilter==="Maior Preço"){
      aux=-1;
    }else if(selectedFilter==="Menor Preço"){
      aux=1;
    }else{
      return products;
    }
    const filtered = products.sort((a,b)=> {
      if (a.price<b.price) {
        return -1*aux;
      }
      if (a.price>b.price) {
        return 1*aux;
      }
      return 0;
    })
    return filtered
  }

  filtraFrete = (ordenProducts) => {
    const {filterFrete} = this.state;
    if(filterFrete){
      return ordenProducts.filter(el=>el.shipping.free_shipping)
    }
    return ordenProducts

  }

  handleButton = async (e) => {
    e.preventDefault();
    this.setState({APIAwait:false, showFilter:false})
    const { inputValue, selectedRadio } = this.state;
    if (inputValue !== '' || selectedRadio !== '') {
      const productsByNameAndCategory = await
      getProductsByNameAndCategory(selectedRadio, inputValue);
      const ordenProducts = this.ordenaProducts(productsByNameAndCategory)
      const fretefilter = this.filtraFrete(ordenProducts)
      this.setState({ filteredProducts: fretefilter, APIAwait:true, showFilter:true, inputValue:'',selectedRadio:""});
    }
  }

  async setCategories() {
    /* console.log(await getProductsByNameAndCategory('Agro', '')); */
    const categories = (await getCategories());
    this.setState({ listCategories: categories });
  }

  filterChange = (e) => {
    const {target:{value}} = e
    this.setState({selectedFilter:value})
    this.handleButton(e)
  }

  filterChangeCheckbox = (e) => {
    const {target:{checked}} = e
    this.setState(()=>({filterFrete:!checked}))
    // console.log(this.state.filterFrete)
    if(checked===false){
      this.handleButton(e)

    }

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

  closeModal= ({target:{className}}) => {
    // console.log(className==='backgound-modal-categories')
    if(className==='backgound-modal-categories'){
      this.setState({showCategories:false})
    }
  }

  closeModalCart = ({target:{className}}) => {
    // console.log(className==='backgound-modal-cart')
    if(className==='backgound-modal-cart'){
      this.setState({showCart:false})
    }
  }


  render() {
    const { inputValue, listProducts, listCategories, selectedRadio,
      filteredProducts, totalCart, APIAwait, selectedFilter, showCategories, showCart, showFilter  } = this.state;
      // const {filterFrete} = this.state;
    const { history } = this.props;
    const validListProducts = (listProducts.length === 0);
    return (
      <div className='home'>
        <header>
          <form onSubmit={this.handleButton} className='form-header'>
            <div className='div-logo'>
              <img src={logo} alt='logo'className='logo-header'/>
            </div>
            <button
            className='button-lupa-header'
            type="submmit"
            data-testid="query-button"
          >
            <img src={lupa} alt='lupa'/>
          </button>
          <input
            className='input-header'
            name="inputValue"
            type="text"
            value={ inputValue }
            onChange={ this.handleChange }
            data-testid="query-input"
            autocomplete='off'
          />
          

          <div className='div-categories'>
          {showCategories?
          <div className='backgound-modal-categories' onClick={this.closeModal}>
            <div className='component-modal'>
              <button type='button' onClick={()=>this.setState({showCategories:false})}>x</button>
              <ModalCategories 
              listCategories={listCategories} 
              selectedRadio={selectedRadio} 
              handleChangeRadio={this.handleChangeRadio}
              />
            </div>
          </div>:
          <div className='div-menu' onClick={()=>this.setState({showCategories:true})}> <img src={menu} alt='menu'/></div>

        }
        </div>
        <div className='div-cart'>
        {showCart?
          <div className='backgound-modal-cart' onClick={this.closeModalCart}>
            <div className='component-modal-cart'>
                <ShoppingCart changeTotalProducts={(valortotal)=>this.setState({totalCart:valortotal})}/>
            </div>
          </div>:
          <div className='div-cart-todo'>
            <img src={carrinho} alt='carrinho' onClick={()=>this.setState({showCart:true})} />
            <div className='total-cart'>
              <h4 data-testid="shopping-cart-size">{totalCart}</h4>

            </div>
          </div>
        }
        </div>

          </form>
        </header>
        
        










        

        {showFilter && 
        <div className='filtros'>

        <select onChange={ (e)=>this.filterChange(e)} value={selectedFilter}>
          <option hidden >Ordenar por Preço</option>
          <option>Maior Preço</option>
          <option>Menor Preço</option>
        </select>

        <hr/>
{/* 
          <label htmlFor='frete-gratis'>

            <input 
            type='checkbox' 
            id='frete-gratis'
            onChange={this.filterChangeCheckbox}
            value={filterFrete}
            />
          </label> */}

        </div>
        
        
        }


        {validListProducts && (
          <p data-testid="home-initial-message">
            Digite algum termo de pesquisa ou escolha uma categoria.
          </p>)}
        
        <div className='div-products'>
          {APIAwait ? filteredProducts.map((cada) => (
            <div
            className='div-all-products'
              data-testid="product"
              key={ cada.title }
              onClick={ () => history.push({ pathname: `/frontend-online-store/product/${cada.id}`,
                  state: (cada) }) }
            >
                <div className='div-img-products'>
                  <img className='img-products' src={cada.thumbnail} alt={cada.title}/>
                </div>
                <div className='div-text-products'>
                  <div className='div-prices-products'>
                    <h2>{"R$ "+cada.price.toLocaleString('pt-BR')}</h2>
                    {cada.shipping.free_shipping && (
                    <span data-testid="free-shipping">Frete Grátis</span>)}
                  </div>


                  <p>{cada.title}</p>
                </div>
              
              
            </div>
          )) : <div className='loading-div'><img src={loading} alt='loading'/></div>}
          
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default Home;
