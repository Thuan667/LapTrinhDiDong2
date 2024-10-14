// data.ts
import { ImageSourcePropType } from 'react-native';

// Định nghĩa kiểu cho danh mục sản phẩm
export interface Category {
  id: string;
  name: string;
  image: ImageSourcePropType; // Hoặc any
}

// Định nghĩa kiểu cho sản phẩm
export interface Product {
  id: string;
  name: string;
  image: ImageSourcePropType; // Hoặc any
  price: string;
}

// Dữ liệu danh mục sản phẩm
export const categories: Category[] = [
  { id: '201', name: 'Áo', image: require('@/assets/images/danhmucao.png') },
  { id: '202', name: 'Mua Theo Cầu Thủ', image: require('@/assets/images/muatheocauthu.png') },
  { id: '203', name: 'Đồ Tập luyện', image: require('@/assets/images/dotapluyen.png') },
  { id: '204', name: 'Thời Trang', image: require('@/assets/images/thoitrang.png') },
];

// Dữ liệu sản phẩm
export const products: Product[] = [
  { id: '101', name: 'Mens Home Authentic Shirt 24/25 White', image: require('@/assets/images/aoreal01.png'), price: '500.000 VND' },
  { id: '102', name: 'Mens Away Authentic Shirt 24/25 Orange', image: require('@/assets/images/aoreal02.png'), price: '300.000 VND' },
  { id: '103', name: 'Mens Third Shirt 24/25 Charcoal', image: require('@/assets/images/aoreal03.png'), price: '200.000 VND' },
  { id: '104', name: 'Mens Home Authentic Shirt long 24/25 White', image: require('@/assets/images/aorealdaitay01.png'), price: '$150' },
  { id: '105', name: 'Mens Away Authentic Shirt long 24/25 Orange', image: require('@/assets/images/aorealdaitay03.png'), price: '$175' },
];
export const banners = [
    require('@/assets/images/banner.png'),
    require('@/assets/images/banner02.png'),
    require('@/assets/images/banner03.png'),
  ];