
import React from 'react';

import logo from '../images/mercadoLivre.png'
// import lupa from '../images/lupa.png'
import menu from '../images/menu.png'
import carrinho from '../images/carrinho.png'
import './Header.css'




class Header extends React.Component{
  render(){
    const {history} = this.props
    return(

<header>
          <form className='form-header header-ot-pag'>
            <div className='div-logo logo-dm-pg' onClick={()=>history.push('/frontend-online-store/')}>
              <img src={logo} alt='logo'className='logo-header'/>
            </div>

          
          <div className='ajusta-header'>
            <div className='div-categories'>
              <div className='div-menu' onClick={()=>history.push({ pathname: `/frontend-online-store/`, state: ('categoria') })}> <img src={menu} alt='menu'/>
              </div>

          
            </div>


            <div className='div-cart'>
            <div className='div-cart-todo'>
              <img src={carrinho} alt='carrinho' onClick={()=>history.push({ pathname: `/frontend-online-store/`, state: ('carrinho') })} />
            </div>
          
            </div>
          </div>



       

          </form>
        </header>
    )
  }
}


export default Header;
