import React from 'react';
import ProductList from './components/ProductList';
import OrderList from './components/OrderList';
import './App.css'; // Main application CSS

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>E-commerce Admin Panel</h1>
      </header>
      <main>
        <section className="product-section">
          <ProductList />
        </section>
        <section className="order-section">
          <OrderList />
        </section>
      </main>
    </div>
  );
}

export default App;
