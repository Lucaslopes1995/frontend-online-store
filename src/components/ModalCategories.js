import { render } from "@testing-library/react";
import React from "react";
import './ModalCategories.css'

class ModalCart extends React.Component{
    render(){
        const {listCategories, selectedRadio, handleChangeRadio, showCategories} = this.props
        return(
           <aside>
               {listCategories.map((el) => (
            <label key={ el.id } className='label-categories' data-testid="category" htmlFor={ el.id }>
              <input
                id={ el.id }
                name="category"
                onChange={ (e) => handleChangeRadio(e,el) }
                type="radio"
                value={ el.name === selectedRadio }
                checked={ el.name === selectedRadio }
              />
              {el.name}
            </label>
          ))}
           </aside> 
        )
    }
}

export default ModalCart;