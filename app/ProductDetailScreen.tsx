import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { products } from './(tabs)/data'; // Đảm bảo đường dẫn đúng

// Định nghĩa kiểu cho params
type ProductDetailRouteProp = RouteProp<{ params: { id: string } }, 'params'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const { id } = route.params; // Lấy ID sản phẩm từ tham số điều hướng
  const product = products.find(item => item.id === id); // Tìm sản phẩm dựa trên ID

  const [quantity, setQuantity] = useState('1'); 

  if (!product) {
    return (
    //   <View style={styles.container}>
         <Text>Không tìm thấy sản phẩm.</Text>
    //   </View>
     );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={product.image} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.description}>
        Admire both the timeless legacy and the new era of Real Madrid CF with our new 24/25 Home Kit. 
        The new pure and minimalist design looks back to the club's roots by exalting its iconic 'White'. 
        The color that the greatest players in soccer history have proudly represented, and will continue to represent.
      </Text>
      
      {/* Nhập số lượng sản phẩm */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Số lượng:</Text>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric" // Chỉ cho phép nhập số
          value={quantity}
          onChangeText={setQuantity} // Cập nhật trạng thái khi người dùng nhập
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Thanh toán</Text>

        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  price: {
    fontSize: 20,
    color: '#FF0000',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%', // Đảm bảo chiều rộng đầy đủ
    justifyContent: 'space-between', // Đặt khoảng cách giữa nhãn và input
  },
  quantityLabel: {
    fontSize: 18,
    color: '#333',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '30%', // Đặt chiều rộng cho input
    textAlign: 'center', // Căn giữa văn bản trong input
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Đảm bảo chiều rộng đầy đủ
    paddingHorizontal: 20, // Thêm padding cho nút
  },
  button: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1, // Để các nút có cùng chiều rộng
    marginHorizontal: 5, // Thêm khoảng cách giữa các nút
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', // Căn giữa văn bản trong nút
  },
});

export default ProductDetailScreen;
