import Login from './pages/Login'
import Nav from './components/Nav'
import Home from './pages/Home'
import Signup from './pages/SignIn'
import Cart from './pages/Cart'
import Shoe from './pages/Shoe'
import Wishlist from './pages/WishList'
import Footer from './components/Footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthProvider'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/wishlist" element={<Wishlist/>}/>          <Route path="/shoes" element={<Shoe/>}/>          <Route path="/shoes" element={<Shoe/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/login" element={<Login/>}/>

        </Routes>
        <Footer/>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
