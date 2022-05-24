import React from 'react';
import PropTypes from 'prop-types';
import { getCategories } from '../services/api';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      listProducts: [],
      listCategories: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRadio = this.handleChangeRadio.bind(this);
    this.setCategories = this.setCategories.bind(this);
  }

  componentDidMount() {
    this.setCategories();
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState(() => ({ [name]: value }));
  }

  handleChangeRadio(el, i) {
    const { listCategories } = this.state;

    listCategories[i].checked = !listCategories[i].checked;

    this.setState({ listCategories });
  }

  async setCategories() {
    const categories = (await getCategories()).map((el) => {
      el.checked = false;
      return el;
    });
    this.setState({ listCategories: categories });
  }

  render() {
    const { inputValue, listProducts, listCategories } = this.state;
    const { checked } = listCategories;
    const { history } = this.props;
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

        <button
          type="button"
          data-testid="shopping-cart-button"
          onClick={ () => history.push('/cart') }
        >
          Carrinho
        </button>
        <div>
          {listCategories.map((el, i) => (
            <label key={ el.id } data-testid="category" htmlFor={ el.id }>
              <input
                id={ el.id }
                name={ el.name }
                onChange={ () => this.handleChangeRadio(el, i) }
                type="checkbox"
                disabled={ checked }
              />
              {el.name}
            </label>
          ))}
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default Home;
