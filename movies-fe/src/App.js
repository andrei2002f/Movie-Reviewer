import './App.css';
import Layout from './components/Layout';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import Header from './components/header/Header';
import Trailer from './components/trailer/Trailer';
import Reviews from './components/reviews/Reviews';
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import WatchList from './components/watchList/WatchList';

function App() {
  
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path = "/" element = {<Layout/>}>
          <Route path = "/" element = {<Home />} ></Route>
          <Route path = '/WatchList' element = {<WatchList />} ></Route>
          <Route path = '/Login' element = {<Login />} ></Route>
          <Route path = '/Register' element = {<Register />} ></Route>
          <Route path = '/Trailer/:ytTrailerId' element = {<Trailer />} ></Route>
          <Route path = '/Reviews/:movieId' element = {<Reviews />} ></Route>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
