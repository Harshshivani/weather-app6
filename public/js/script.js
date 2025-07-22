document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const refreshButton = document.getElementById('refresh-button');
    
    const cityNameElement = document.getElementById('city-name');
    const currentDateElement = document.getElementById('current-date');
    const weatherIconElement = document.getElementById('weather-icon');
    const temperatureElement = document.getElementById('temperature');
    const weatherDescriptionElement = document.getElementById('weather-description');
    const humidityElement = document.getElementById('humidity');
    const windSpeedElement = document.getElementById('wind-speed');
    
    let currentCity = 'London'; // Default city
    
    // Initialize the app
    updateDateTime();
    fetchWeatherData(currentCity);
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
    
    // Event Listeners
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            currentCity = city;
            fetchWeatherData(city);
            cityInput.value = '';
        }
    });
    
    refreshButton.addEventListener('click', function() {
        fetchWeatherData(currentCity);
    });
    
    // Functions
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        currentDateElement.textContent = now.toLocaleDateString('en-US', options);
    }
    
    async function fetchWeatherData(city) {
        try {
            // Show loading state
            cityNameElement.textContent = 'Loading...';
            temperatureElement.textContent = '--';
            weatherDescriptionElement.textContent = '--';
            humidityElement.textContent = '--%';
            windSpeedElement.textContent = '-- m/s';
            
            // Fetch weather data from our backend
            const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            
            // Update UI with weather data
            cityNameElement.textContent = data.name;
            temperatureElement.textContent = Math.round(data.main.temp);
            weatherDescriptionElement.textContent = data.weather[0].description;
            humidityElement.textContent = `${data.main.humidity}%`;
            windSpeedElement.textContent = `${data.wind.speed} m/s`;
            
            // Set weather icon
            const iconCode = data.weather[0].icon;
            weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIconElement.alt = data.weather[0].main;
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            cityNameElement.textContent = 'Error';
            weatherDescriptionElement.textContent = 'Failed to fetch weather data. Please try again.';
        }
    }
});