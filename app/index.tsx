import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Твій API ключ
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
      const encodedCity = encodeURIComponent(city);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&lang=ua&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error('Місто не знайдено');
      const data = await response.json();
      setWeatherData(data);
    } catch (err: any) { 
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Виправлені назви іконок для TypeScript
  const getWeatherIcon = (weatherId: number): any => {
    if (weatherId >= 200 && weatherId < 300) return 'weather-lightning';
    if (weatherId >= 300 && weatherId < 500) return 'weather-rainy';
    if (weatherId >= 500 && weatherId < 600) return 'weather-pouring';
    if (weatherId >= 600 && weatherId < 700) return 'weather-snowy';
    if (weatherId >= 700 && weatherId < 800) return 'weather-fog';
    if (weatherId === 800) return 'weather-sunny';
    return 'weather-cloudy';
  };

  return (
    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        
        <Text style={styles.headerTitle}>WeatherApp</Text>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Пошук міста..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={city}
            onChangeText={setCity}
            onSubmitEditing={fetchWeather}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={fetchWeather}>
            <MaterialCommunityIcons name="magnify" size={28} color="#4facfe" />
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {weatherData && !loading && !error && (
          <View style={styles.mainCard}>
            <Text style={styles.cityText}>{weatherData.name}</Text>
            <Text style={styles.countryText}>{weatherData.sys.country}</Text>
            
            <MaterialCommunityIcons 
              name={getWeatherIcon(weatherData.weather[0].id)} 
              size={140} 
              color="#fff" 
              style={styles.mainIcon}
            />
            
            <View style={styles.tempRow}>
                <Text style={styles.tempText}>{Math.round(weatherData.main.temp)}</Text>
                <Text style={styles.degreeSymbol}>°C</Text>
            </View>
            
            <Text style={styles.descText}>{weatherData.weather[0].description}</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="water-outline" size={24} color="#fff" />
                <Text style={styles.infoVal}>{weatherData.main.humidity}%</Text>
                <Text style={styles.infoLab}>Вологість</Text>
              </View>
              <View style={[styles.infoBox, { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.2)' }]}>
                <MaterialCommunityIcons name="wind-power-outline" size={24} color="#fff" />
                <Text style={styles.infoVal}>{weatherData.wind.speed} м/с</Text>
                <Text style={styles.infoLab}>Вітер</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 25, paddingTop: 60, alignItems: 'center', paddingBottom: 40 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 20, opacity: 0.9 },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 60,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  input: { flex: 1, color: '#fff', fontSize: 18, fontWeight: '600' },
  searchBtn: { backgroundColor: '#fff', padding: 10, borderRadius: 15 },
  errorBox: { marginTop: 20, backgroundColor: 'rgba(255, 75, 75, 0.2)', padding: 15, borderRadius: 15 },
  errorText: { color: '#fff', fontWeight: '600' },
  mainCard: {
    marginTop: 30,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 35,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cityText: { fontSize: 38, fontWeight: '900', color: '#fff' },
  countryText: { fontSize: 18, color: '#fff', opacity: 0.8, marginTop: -5 },
  mainIcon: { marginVertical: 10, textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: {width: 0, height: 5}, textShadowRadius: 10 },
  tempRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tempText: { fontSize: 96, fontWeight: '200', color: '#fff' },
  degreeSymbol: { fontSize: 34, color: '#fff', marginTop: 20, fontWeight: '300' },
  descText: { fontSize: 22, color: '#fff', textTransform: 'capitalize', fontWeight: '500', opacity: 0.9 },
  infoRow: { flexDirection: 'row', marginTop: 40, width: '100%', paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  infoBox: { flex: 1, alignItems: 'center' },
  infoVal: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 5 },
  infoLab: { fontSize: 12, color: '#fff', opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 },
});