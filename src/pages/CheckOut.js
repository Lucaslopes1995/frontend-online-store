import React from 'react';

class CheckOut extends React.Component {
    state = {
      name: '',
      email: '',
      cpf: '',
      phone: '',
      cep: '',
      address: '',
    }

      handleChange = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
      }

      render() {
        const { name, email, cpf, phone, cep, address } = this.state;
        return (
          <div>
            <form>
              <label htmlFor="nome">
                Nome
                <input
                  id="name"
                  name="name"
                  data-testid="checkout-fullname"
                  autoComplete="off"
                  type="text"
                  value={ name }
                  onChange={ this.handleChange }
                />

              </label>
              <label htmlFor="email">
                Email
                <input
                  id="email"
                  name="email"
                  data-testid="checkout-email"
                  autoComplete="off"
                  type="email"
                  value={ email }
                  onChange={ this.handleChange }
                />
              </label>
              <label htmlFor="cpf">
                CPF
                <input
                  id="cpf"
                  name="cpf"
                  data-testid="checkout-cpf"
                  autoComplete="off"
                  type="text"
                  value={ cpf }
                  onChange={ this.handleChange }
                />
              </label>

              <label htmlFor="phone">
                Phone
                <input
                  id="phone"
                  name="phone"
                  data-testid="checkout-phone"
                  autoComplete="off"
                  type="text"
                  value={ phone }
                  onChange={ this.handleChange }
                />
              </label>

              <label htmlFor="cep">
                CEP
                <input
                  id="cep"
                  name="cep"
                  data-testid="checkout-cep"
                  autoComplete="off"
                  type="text"
                  value={ cep }
                  onChange={ this.handleChange }
                />
              </label>
              <label htmlFor="address">
                Address
                <input
                  id="address"
                  name="address"
                  data-testid="checkout-address"
                  autoComplete="off"
                  type="text"
                  value={ address }
                  onChange={ this.handleChange }
                />
              </label>
            </form>
          </div>
        );
      }
}

export default CheckOut;
