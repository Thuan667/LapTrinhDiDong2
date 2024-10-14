import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: any;
  rating: number;
  sales: number;
}

const CartScreen = () => {
  const navigation = useNavigation();
  
  const [searchText, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Mens Home Authentic Shirt 24/25 White',
      price: 500000,
      quantity: 2,
      image: require('@/assets/images/aoreal01.png'), 
      rating: 4.5,
      sales: 120,
    },
    {
      id: 2,
      name: 'Mens Away Authentic Shirt 24/25 Orange',
      price: 200000,
      quantity: 1,
      image: require('@/assets/images/aoreal02.png'), 
      rating: 4.0,
      sales: 85,
    },
    {
      id: 3,
      name: 'Mens Third Shirt 24/25 Charcoal',
      price: 300000,
      quantity: 1,
      image: require('@/assets/images/aoreal03.png'),
      rating: 5.0,
      sales: 150,
    },
  ]);

  const filteredItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const increaseQuantity = (itemId: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          key={i}
          name={i <= rating ? 'star' : 'star-o'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price.toLocaleString()} VND</Text>
        
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <Text style={styles.salesText}>{item.sales} đã bán</Text>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
            <Icon name="remove" size={24} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
            <Icon name="add" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
        <Text style={styles.backButtonText}>Trang chủ</Text>
      </TouchableOpacity>

      {/* Thanh tìm kiếm với nút tìm và logo */}
      <View style={styles.searchContainer}>
        {/* Thêm logo bên trái */}
        <Image source={require('@/assets/images/logo-oficial-store.png')} style={styles.logo} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => {/* Hàm tìm kiếm có thể thực hiện ở đây */}}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng tiền: {getTotalPrice().toLocaleString()} VND</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: {
    width: 35,
    height: 35,
    marginRight: 15, // Khoảng cách giữa logo và thanh tìm kiếm
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  salesText: {
    fontSize: 12,
    color: 'gray',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  footer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 10,
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
