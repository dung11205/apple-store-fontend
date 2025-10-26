import axios from 'axios';

const API_URL = 'http://localhost:3000/products';

export const getProducts = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
};
