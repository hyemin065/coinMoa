import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header/Header';
import Layout from '../components/Layout/Layout';
import Exchange from '../pages/Exchange/Exchange';
import Market from '../pages/Market/Market';
import PortFolio from '../pages/PortFolio/PortFolio';
import SignIn from '../pages/SignIn/SignIn';
import SignUp from '../pages/SignUp/SignUp';

const RootRoute = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Market />} />
          <Route path='exchange' element={<Exchange />} />
          <Route path='portfolio' element={<PortFolio />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='signin' element={<SignIn />} />
        </Route>
      </Routes>
    </>
  );
};

export default RootRoute;
