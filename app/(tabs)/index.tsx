import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Твій API ключ з OpenWeatherMap
const API_KEY = '63f38a24a325c5cb96dab86bdf53dcd7'; 

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!city.trim()) return; 

    setLoading(true);
    setError(null);
    Keyboard.dismiss(); 

    try {
      // Кодуємо назву міста, щоб інтернет правильно розумів кирилицю
      const encodedCity = encodeURIComponent(city);
      
      // Додаємо &lang=ua для українського опису погоди
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&lang=ua&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Місто не знайдено');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err: any) { 
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) return 'weather-lightning';
    if (weatherId >= 300 && weatherId < 500) return 'weather-rainy';
    if (weatherId >= 500 && weatherId < 600) return 'weather-pouring';
    if (weatherId >= 600 && weatherId < 700) return 'weather-snowy';
    if (weatherId >= 700 && weatherId < 800) return 'weather-fog';
    if (weatherId === 800) return 'weather-sunny';
    if (weatherId > 800) return 'weather-cloudy';
    return 'weather-cloudy';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Моя Погода</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Введіть назву міста"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={fetchWeather} 
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <MaterialCommunityIcons name="magnify" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {weatherData && !loading && !error && (
        <View style={styles.weatherInfo}>
          <Text style={styles.cityName}>{weatherData.name}, {weatherData.sys.country}</Text>
          <MaterialCommunityIcons 
            name={getWeatherIcon(weatherData.weather[0].id)} 
            size={100} 
            color="#333" 
          />
          <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.description}>{weatherData.weather[0].description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="water-percent" size={24} color="#666" />
              <Text style={styles.detailText}>{weatherData.main.humidity}%</Text>
              <Text style={styles.detailLabel}>Вологість</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="weather-windy" size={24} color="#666" />
              <Text style={styles.detailText}>{weatherData.wind.speed} м/с</Text>
              <Text style={styles.detailLabel}>Вітер</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  loader: {
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  weatherInfo: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize', 
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
});