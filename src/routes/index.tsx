import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header/Header';
import Layout from '../components/Layout/Layout';
import Market from '../pages/Market/Market';
import PortFolio from '../pages/PortFolio/PortFolio';

import styles from './routes.module.scss';

const RootRoute = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='' element={<Market />} />
          <Route path='portfolio' element={<PortFolio />} />
        </Route>
      </Routes>
    </>
  );
};

export default RootRoute;
