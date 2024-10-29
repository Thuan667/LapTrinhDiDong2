import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categories, banners } from './data'; // Đường dẫn tới dữ liệu
import axios from 'axios'; // Thêm Axios vào đây

export interface Product {
  id: string; // Kiểu dữ liệu của ID sản phẩm
  name: string;
  image_name: string;
  price: number; // Giá sản phẩm
  imageUrl?: string; // URL hình ảnh sản phẩm
}

const SearchBarExample = () => {
  const animatedValue = new Animated.Value(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [products, setProducts] = useState<Product[]>([]); // State cho danh sách sản phẩm
  const [error, setError] = useState('');

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetailScreen', { id: productId });
  };

  const handleBuyPress = (productName: string) => {
    console.log('Mua sản phẩm:', productName);
  };

  const handleCartPress = (productName: string) => {
    console.log('Thêm vào giỏ hàng:', productName);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      const productsWithImages = await Promise.all(response.data.map(async (product: Product) => {
        try {
          const imageResponse = await axios.get(`http://localhost:8080/api/product/${product.id}/image`, { responseType: "blob" });
          const imageUrl = URL.createObjectURL(imageResponse.data);
          return { ...product, imageUrl };
        } catch (error) {
          console.error("Error fetching image for product ID:", product.id, error);
          return { ...product, imageUrl: "placeholder-image-url" }; // Placeholder nếu không lấy được hình ảnh
        }
      }));

      setProducts(productsWithImages);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    }
  };

  const fetchData = async (value: string) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value: string) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Animation cho banner
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

// Cập nhật mã dưới đây trong component SearchBarExample
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
        placeholder="Tìm kiếm"
        value={input}
        onChangeText={handleChange} // Sử dụng onChangeText thay cho onChange
        onFocus={() => setSearchFocused(true)} 
        onBlur={() => setSearchFocused(false)}
      />
      {/* Kết quả tìm kiếm hiện dưới thanh tìm kiếm */}
      {showSearchResults && (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleProductPress(item.id)}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.searchResultsList} // Thêm style cho FlatList
        />
      )}
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
          <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
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
  loginButton: {
    marginLeft: 10,
  },
  loginIcon: {
    width: 65,
    height: 35,
  },
  banner: {

    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  underline: {
    height: 2,
    backgroundColor: '#FF0000',
    width: '30%',
    marginBottom: 20,
  },
  // Styles
categoryCard: {
  marginRight: 20,
  alignItems: 'center',
  flexDirection: 'column', // Đảm bảo các thành phần nằm theo cột
  width: 100,
  height:350, // Thay đổi chiều rộng để phù hợp với nội dung
},
categoryImage: {
  width: '100%', // Đặt chiều rộng là 100% để chiếm hết không gian của card
  height: 80, // Điều chỉnh chiều cao nếu cần
  borderRadius: 10, // Đường bo viền nếu cần
  marginBottom: 5,
},

  categoryName: {
    fontSize: 15,
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#FF0000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buyButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  cartButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  searchResultsList: {
    top: 10, // Điều chỉnh khoảng cách từ đầu trang
    zIndex: 1, // Đảm bảo danh sách ở trên cùng
  },
  
});

export default SearchBarExample;
