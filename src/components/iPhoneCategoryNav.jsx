// src/components/iPhoneCategoryNav.jsx
import { useState } from 'react';
import styles from './iPhoneCategoryNav.module.css';

import img17pro from '../assets/nav_iphone_17pro.png';
import imgAir from '../assets/nav_iphone_air.png';
import img17 from '../assets/nav_iphone_17.png';
import img16 from '../assets/nav_iphone_16.png';
import img16e from '../assets/nav_iphone_16e.png';
import imgCompare from '../assets/nav_compare.png';
import imgAccessories from '../assets/nav_accessories.png';
import imgShop from '../assets/nav_shop.png';
import imgIos from '../assets/nav_ios.png';

export default function IPhoneCategoryNav() {
  const [activeCategory, setActiveCategory] = useState('iphone-17-pro');

  const categories = [
    { id: 'iphone-17-pro', name: 'iPhone 17 Pro', label: 'Mới', image: img17pro },
    { id: 'iphone-air', name: 'iPhone Air', label: 'Mới', image: imgAir },
    { id: 'iphone-17', name: 'iPhone 17', label: 'Mới', image: img17 },
    { id: 'iphone-16', name: 'iPhone 16', image: img16 },
    { id: 'iphone-16e', name: 'iPhone 16e', image: img16e },
    { id: 'so-sanh', name: 'So Sánh', image: imgCompare },
    { id: 'phu-kien', name: 'Phụ Kiện', image: imgAccessories },
    { id: 'mua-sam', name: 'Mua Sắm', image: imgShop },
    { id: 'ios', name: 'iOS', image: imgIos }
  ];

  return (
    <div className={styles.categoryNavWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>iPhone</h1>

        <div className={styles.categoriesWrapper}>
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.categoryItem} ${
                  activeCategory === category.id ? styles.active : ''
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className={styles.imageWrapper}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className={styles.categoryImage}
                  />
                </div>

                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name}</span>
                  {category.label && (
                    <span className={styles.newLabel}>{category.label}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
