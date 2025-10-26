import { useEffect, useState } from 'react';
import { getProducts } from '../api/productApi';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1> Danh sách sản phẩm Apple</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map((p) => (
          <div key={p._id} style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            textAlign: 'center'
          }}>
            <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} style={{ width: '100px', height: '100px' }} />
            <h3>{p.name}</h3>
            <p>{p.price} VNĐ</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
