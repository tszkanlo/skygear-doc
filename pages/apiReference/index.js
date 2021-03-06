import React from 'react';

import Banner from '../../components/Banner/Banner';
import Header from '../../components/Header/Header';
import TitleBar from '../../components/TitleBar/TitleBar';
import ApiReference from './ApiReference';
import Footer from '../../components/Footer/Footer';

const ApiReferencePage = () => (
  <div>
    <Banner>
      <Header />
      <TitleBar>
        <h1>API Reference</h1>
      </TitleBar>
    </Banner>
    <ApiReference />
    <Footer />
  </div>
);

export default ApiReferencePage;
