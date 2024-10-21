import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories,banners } from './data'; // Thay đổi đường dẫn nếu cần
import axios from 'axios'; // Thêm Axios vào đây

export interface Product {
  id: string; // Hoặc number, tùy vào kiểu dữ liệu trong MySQL
  name: string;
  image_name: string;
  price: number; // Hoặc string nếu giá được lưu dưới dạng chuỗi
  // Thêm bất kỳ thuộc tính nào khác mà bạn nhận từ API
  imageUrl?:string;
}


const SearchBarExample = () => {
  const [searchText, setSearchText] = useState('');
  const animatedValue = new Animated.Value(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigation = useNavigation();

  
  const [products, setProducts] = useState<Product[]>([]);  // Thêm state cho products
  const [error, setError] = useState('');
  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetailScreen', { id: productId });
  };
  

  // const handleCategoryPress = (category) => {
  //   navigation.navigate('CategoryScreen', { category });
  // };

  const onSearchPress = () => {
    console.log('Tìm kiếm:', searchText);
  };

  const handleBuyPress = (productName: string) => {
    console.log('Mua sản phẩm:', productName);
  };

  const handleCartPress = (productName: string) => {
    console.log('Thêm vào giỏ hàng:', productName);
  };

  useEffect(() => {
    const fetchProducts = async () => {
  
      try {
  
        const response = await axios.get('http://localhost:8080/api/products');
    
        const productsWithImages = await Promise.all(response.data.map(async (product: Product) => {
          try {
            const imageResponse = await axios.get(
              `http://localhost:8080/api/product/${product.id}/image`,
              { responseType: "blob" }
            );
            const imageUrl = URL.createObjectURL(imageResponse.data);
            return { ...product, imageUrl }; 
          } catch (error) {
            console.error("Error fetching image for product ID:", product.id, error);
            return { ...product, imageUrl: "placeholder-image-url" };  
          }
        }));
    
        setProducts(productsWithImages);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      }
    };
  
    fetchProducts();
  }, []);

  // Thực hiện animation cho banner
  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ]),
      ).start();
    };

    startAnimation();
  }, [animatedValue]);


  // Cập nhật chỉ số banner hiện tại
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prevIndex => (prevIndex + 1) % banners.length);
    }, 5000); // Thay đổi banner sau mỗi 5 giây

    return () => clearInterval(interval);
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10], // Điều chỉnh khoảng cách di chuyển
  });




  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Image
            source={require('@/assets/images/logo-oficial-store.png')}
            style={styles.loginIcon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
          <Text style={styles.searchButtonText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Image
          source={banners[currentBannerIndex]}
          style={styles.banner}
          resizeMode="cover"
        />
      </Animated.View>
{/* Danh mục sản phẩm */}
      <Text style={styles.sectionTitle}>Danh Mục Sản Phẩm</Text>
      <View style={styles.underline} />
      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        horizontal={true}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />


    {/* Danh sách sản phẩm */}
    <Text style={styles.sectionTitle}>Sản Phẩm Mới</Text>
      <View style={styles.underline} />
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <TouchableOpacity onPress={() => handleProductPress(item.id)}>


            {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}  
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.productImage} />
        )}


            </TouchableOpacity>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} VND</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyPress(item.name)}>
                  <Text style={styles.buttonText}>Mua</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cartButton} onPress={() => handleCartPress(item.name)}>
                  <Text style={styles.buttonText}>Giỏ hàng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loginButton: {
    marginLeft: 10,
  },
  loginIcon: {
    width: 65,
    height: 35,
  },
  banner: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  underline: {
    width: '100%',
    height: 2,
    backgroundColor: '#000000',
    marginBottom: 3,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 10,
    width: 120,
    height: 200,
    justifyContent: 'flex-start',
  },
  categoryImage: {
    width: 100,
    height: 70,
    borderRadius: 4,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 5,
    lineHeight: 20,
  },
productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#FF0000',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  cartButton: {
    backgroundColor: '#000000',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

export default SearchBarExample;