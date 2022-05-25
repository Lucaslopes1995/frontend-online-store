import React from 'react';
import PropTypes from 'prop-types';

class ShoppingCart extends React.Component {
    getNumber = () => {
      const { dti } = this.props;
      const expReg = /\d/;
      const numero = dti.match(expReg);
      return numero[0] - 1;
    }

    render() {
      const { dti, ch, oc, d } = this.props;
      return (
        <input
          data-testid={ dti }
          checked={ ch }
          onChange={ () => oc(this.getNumber()) }
          type="checkbox"
          d={ d === 's' }
        />
      );
    }
}

ShoppingCart.propTypes = {
  dti: PropTypes.string.isRequired,
  ch: PropTypes.bool.isRequired,
  oc: PropTypes.func.isRequired,
  d: PropTypes.bool.isRequired,

};

export default ShoppingCart;
