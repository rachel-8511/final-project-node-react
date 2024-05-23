import './App.css';
import NavBar from './Components/NavBar';
import "primereact/resources/themes/arya-blue/theme.css"
import "primereact/resources/primereact.min.css"
import { Route, Routes } from 'react-router-dom';
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import Products from './features/products/Products';
import Register from './features/auth/Register';
import Login from './features/auth/Login';
import Product from './features/products/Product';
import Home from './Components/Home';
import FullBasket from './features/basket/FullBasket';
import Update from './features/user/update';
import Checkout from './features/basket/Checkout';
import AdminProducts from './features/products/AdminProducts';
import AdminUsers from './features/user/AdminUsers';
import Orders from './features/order/Orders';
import RequireAuth from './features/auth/RequireAuth';
import { useState } from 'react';


function App() {

  const [visibleRight, setVisibleRight] = useState(false);
  const [toCheckout, setToCheckout] = useState(false);
  return (
    <>
      <NavBar setVisibleRight={setVisibleRight} visibleRight={visibleRight}/>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setToCheckout={setToCheckout} toCheckout={toCheckout}/>} />
        <Route path='/products' element={<Products />} />
        <Route path='/register' element={<Register />} />
        <Route path='/product/:id' element={<Product setVisibleRight={setVisibleRight} />} />
        <Route path='/basket' element={<FullBasket setToCheckout={setToCheckout} />} />

        <Route element={<RequireAuth allowRoles={["admin", "user"]} />}>
          <Route path='/update' element={<Update />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders/:id' element={<Orders />} />
        </Route>

        <Route element={<RequireAuth allowRoles={["admin"]} />}>
          <Route path='/adminProducts' element={<AdminProducts />} />
          <Route path='/adminUsers' element={<AdminUsers />} />
        </Route>
        

      </Routes>
      <div style={{ width: '100%', marginTop: '0px',bottom: '0', padding: '0px',border:'none' }}>
                <img src={'footer.png'} width="100%"  alt=""/>
      </div>
    </>

  );
}

export default App;
