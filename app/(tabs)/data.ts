// data.ts
import { ImageSourcePropType } from 'react-native';

// Định nghĩa kiểu cho danh mục sản phẩm
export interface Category {
  id: string;
  name: string;
  image: ImageSourcePropType; // Hoặc any
}



// Dữ liệu danh mục sản phẩm
export const categories: Category[] = [
  { id: '201', name: 'Áo', image: require('@/assets/images/danhmucao.png') },
  { id: '202', name: 'Mua Theo Cầu Thủ', image: require('@/assets/images/muatheocauthu.png') },
  { id: '203', name: 'Đồ Tập luyện', image: require('@/assets/images/dotapluyen.png') },
  { id: '204', name: 'Thời Trang', image: require('@/assets/images/thoitrang.png') },
];

// Dữ liệu sản phẩm

export const banners = [
    require('@/assets/images/banner.png'),
    require('@/assets/images/banner02.png'),
    require('@/assets/images/banner03.png'),
  ];