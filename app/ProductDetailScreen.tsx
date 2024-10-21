import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;  // Đường dẫn ảnh
  view_count: number; // Số lượt xem
  rating: number;    // Đánh giá trung bình
}

const ProductDetailScreen = () => {
  const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();
  const { id } = route.params; // Lấy id sản phẩm từ params
  const [product, set_product] = useState<Product | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState('');
  const [user_rating, set_user_rating] = useState(0); // Đánh giá của người dùng

  const handle_product_detail_screen_press = () => {
    router.push('/(tabs)');
  };

  const handle_star_press = (rating: number) => {
    set_user_rating(rating);
  };

  const handle_add_to_cart = () => {
    console.log(`Thêm sản phẩm ${product?.name} vào giỏ hàng`);
    // Logic để thêm sản phẩm vào giỏ hàng có thể được thêm vào đây
  };

  const handle_checkout = () => {
    console.log(`Mua ngay sản phẩm ${product?.name}`);
    // Logic để chuyển tới trang thanh toán có thể được thêm vào đây
  };

  useEffect(() => {
    const fetch_product_details = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        const product_data = response.data;

        const image_response = await axios.get(
          `http://localhost:8080/api/product/${product_data.id}/image`,
          { responseType: 'blob' }
        );
        const image_url = URL.createObjectURL(image_response.data);

        set_product({ ...product_data, imageUrl: image_url });
        set_loading(false);
      } catch (err) {
        set_error('Có lỗi xảy ra khi tải sản phẩm');
        set_loading(false);
      }
    };

    fetch_product_details();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading_container}>
        <ActivityIndicator size="large" color="#FF0000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error_container}>
        <Text style={styles.error_text}>{error}</Text>
      </View>
    );
  }

  return (
    product ? (
      <ScrollView style={styles.container}>
        {/* Nút quay lại */}
        <TouchableOpacity style={styles.back} onPress={handle_product_detail_screen_press}>
          <Ionicons name="arrow-back" size={35} color="black" />
        </TouchableOpacity>

        {/* Hình ảnh sản phẩm */}
        <Image source={{ uri: product.imageUrl }} style={styles.product_image} />

        {/* Tên và giá sản phẩm */}
        <Text style={styles.product_name}>{product.name}</Text>
        <Text style={styles.product_price}>{product.price} VND</Text>



        {/* Số lượt xem */}
        <Text style={styles.view_count}>Lượt xem: {product.view_count}</Text>



        {/* Đánh giá 5 sao */}
        <View style={styles.rating_container}>
          <Text style={styles.rating_label}>Đánh giá của bạn:</Text>
          <View style={styles.stars_container}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handle_star_press(star)}>
                <Ionicons
                  name={star <= user_rating ? 'star' : 'star-outline'}
                  size={30}
                  color={star <= user_rating ? '#FFD700' : '#CCCCCC'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.average_rating}>Đánh giá trung bình: {product.rating} / 5</Text>
        </View>

        {/* Mô tả sản phẩm */}
        <Text style={styles.product_description}>{product.description}</Text>

        {/* Nút Giỏ hàng và Mua ngay */}
        <View style={styles.button_container}>
          <TouchableOpacity style={styles.cart_button} onPress={handle_add_to_cart}>
            <Text style={styles.button_text}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buy_button} onPress={handle_checkout}>
            <Text style={styles.button_text}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ) : null
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  product_image: {
    width: 400,
    height: 300,
    borderRadius: 15,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  product_name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  product_price: {
    fontSize: 20,
    color: '#FF0000',
    marginBottom: 20,
  },
  product_description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  view_count: {
    fontSize: 16,
    marginBottom: 20,
  },
  rating_container: {
    marginBottom: 20,
  },
  rating_label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stars_container: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  average_rating: {
    fontSize: 16,
    color: '#FF0000',
  },
  loading_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error_text: {
    color: 'red',
    fontSize: 18,
  },
  back: {
    padding: 5,
    marginTop: 10,
    marginLeft: -10,
  },
  button_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cart_button: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    width: '48%',
  },
  buy_button: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 5,
    width: '48%',
  },
  button_text: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
