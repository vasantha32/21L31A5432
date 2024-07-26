import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../apiService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    company: 'AMZ',
    category: 'Laptop',
    top: 10,
    minPrice: 1,
    maxPrice: 10000,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    const { company, category, top, minPrice, maxPrice } = filters;
    const data = await getProducts(company, category, top, minPrice, maxPrice);
    setProducts(data);
  };

  return (
    <div>
      <h1>Top Products</h1>
      {/* Add filter and sorting UI components here */}
      <div>
        {products.map((product, index) => (
          <div key={index}>
            <Link to={{ pathname: `/product/${index}`, state: { product } }}>{product.productName}</Link>
            <p>Price: {product.price}</p>
            <p>Rating: {product.rating}</p>
            <p>Discount: {product.discount}</p>
            <p>Availability: {product.availability}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
