import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import CreateCustomer from './pages/CreateCustomer';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import ContactMe from './pages/ContactMe';
import Footer from './components/Footer';
import Tnc from './pages/Tnc';
import Header2 from './components/Header2';
import Customer from './pages/Customer';

export default function App() {
  return (
    <BrowserRouter>
    
      <Header2 />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        {/* <Route path='/sign-up' element={<SignUp />} /> */}
        <Route path='/about' element={<About />} />
        <Route path='/contactme' element={<ContactMe />} />
        <Route path='/tnc' element={<Tnc />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/customer' element={<Customer />} />
          <Route path='/create-customer' element={<CreateCustomer />} />
          
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}