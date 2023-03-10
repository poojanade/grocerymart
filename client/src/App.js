import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home/Home";
import './shared/css/master.css';
import Navigation from "./components/navigation/Navigation";
// import Footer from "./components/footer/Footer";
import CartPage from "./pages/cart/Cart";
import {useEffect, useState} from "react";
import Order from "./pages/order/Order";
import PrivateRoute from "./components/privete-route/PrivateRoute";
import Wishlist from "./pages/wishlist/Wishlist";
import Products from './pages/products/Products';

// import Checkout from "./pages/checkout/checkout";
// import Success from "./pages/checkout/success";
// import OrderId from "./pages/order/id/OrderId";

const cartInitialization = JSON.parse(localStorage.getItem('cart')) || [];

const App = () => {

    const [cart, setCart] = useState(cartInitialization);

    const addProductToCart = (product) => {
        const productIndex = cart.findIndex((cartProduct) => cartProduct.product_id === product.product_id);

        if (productIndex >= 0) {
            const updatedData = {...cart[productIndex], quantity: cart[productIndex].quantity + 1};
            const newArray = [...cart];
            newArray[productIndex] = updatedData;
            setCart(newArray);
        } else {
            setCart([...cart, {...product, quantity: 1}]);
        }
    }

    const removeProductFromCart = (product) => {
        const productIndex = cart.findIndex((cartProduct) => cartProduct.product_id === product.product_id);

        if (productIndex === -1)
            return;

        if (cart[productIndex].quantity === 1) {
            const newArr = cart.filter((cartItem) => cartItem.product_id !== product.product_id);
            setCart(newArr);
        } else {
            const updatedData = {...cart[productIndex], quantity: cart[productIndex].quantity - 1};
            const newArray = [...cart];
            newArray[productIndex] = updatedData;
            setCart(newArray);
        }
    }

    const updateQuantity = (product, operation) => {
        if (operation === 'ADD')
            return addProductToCart(product);

        if (operation === 'REMOVE')
            return removeProductFromCart(product)
    }

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));

        let products = 0;
        for (const cartElement of cart) {
            products += cartElement.quantity;
        }

        setCartCount(products);
    }, [cart])

    return (
        <BrowserRouter>
            {/* <ScrollToTop/> */}
            <Navigation cartCount={cartCount}/>
            <Routes>
                <Route path={'/'} element={<Home addProductToCart={addProductToCart}/>}/>
                <Route path={'/products'} element={<Products addProductToCart={addProductToCart}/>}/>
                <Route path={'/cart'}
                       element={<CartPage cart={cart} cartCount={cartCount} updateQuantity={updateQuantity}/>}/>
                {/* <Route path={'/checkout'} element={<Checkout/>}/>
                <Route path={'/checkout/success'} element={<Success setCart={setCart}/>}/> */}
                <Route path={'/orders'} element={<Order/>}/>
                {/* <Route path={'/orders/:id'} element={<OrderId/>}/> */}
                <Route path={'/wishlist'} element={<PrivateRoute component={<Wishlist addProductToCart={addProductToCart}/>}/>}/>
            </Routes>
            {/* <Footer/> */}
        </BrowserRouter>
    );
}

export default App;