document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const cards = document.querySelectorAll(".weather-card");
  const dots = document.querySelectorAll(".dot");
  const totalCards = cards.length;
  let currentIndex = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  // Configuración del carrusel
  function updateCarousel() {
    const offset = -currentIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
    updateDots();
    updateSwipeIndicator();
  }

  // Actualizar los dots de navegación
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Detectar gestos de swipe horizontal
  carousel.addEventListener("touchstart", (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = startX;
    carousel.style.transition = "none";
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();

    currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    // Limitar el arrastre en los bordes
    if (
      (currentIndex === 0 && diff > 0) ||
      (currentIndex === totalCards - 1 && diff < 0)
    ) {
      const resistance = 0.3;
      const offset =
        -currentIndex * 100 +
        ((diff * resistance) / carousel.offsetWidth) * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    } else {
      const offset = -currentIndex * 100 + (diff / carousel.offsetWidth) * 100;
      carousel.style.transform = `translateX(${offset}%)`;
    }
  });

  carousel.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;

    const diff = currentX - startX;
    const threshold = 50; // Umbral mínimo para cambiar de tarjeta

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        currentIndex--;
      } else if (diff < 0 && currentIndex < totalCards - 1) {
        currentIndex++;
      }
    }

    carousel.style.transition = "transform 0.3s ease-out";
    updateCarousel();

    // Reset de variables
    startX = 0;
    currentX = 0;
  });

  // Navegación por dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      carousel.style.transition = "transform 0.3s ease-out";
      updateCarousel();
    });
  });

  // Variables para el tema
  const weatherCard = document.querySelector(".weather-card");
  let isDarkTheme = false;

  // Función para cambiar el tema
  function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    weatherCard.classList.toggle("dark-theme");
  }

  // Simulación de datos del clima
  const mockWeatherData = {
    current: {
      temp: 23,
      description: "Soleado",
      humidity: 10,
      feelsLike: 24,
    },
    hourly: [
      { time: "11:00", temp: 22 },
      { time: "12:00", temp: 23 },
      { time: "13:00", temp: 25 },
      { time: "14:00", temp: 24 },
      { time: "15:00", temp: 25 },
      { time: "16:00", temp: 24 },
    ],
    daily: [
      { day: "Lun", temp: 22 },
      { day: "Mar", temp: 23 },
      { day: "Mié", temp: 24 },
      { day: "Jue", temp: 22 },
    ],
  };

  // Actualizar UI para el diseño 1
  function updateDesign1UI(data) {
    document.querySelectorAll(".design-1").forEach((card) => {
      card.querySelector(".temperature").textContent = `${data.current.temp}°C`;
      card.querySelector(".weather-description").textContent =
        data.current.description;

      const forecastContainer = card.querySelector(".hourly-forecast");
      if (forecastContainer) {
        forecastContainer.innerHTML = data.hourly
          .map(
            (hour) => `
        <div class="forecast-item">
          <span class="time">${hour.time} hs</span>
          <div class="forecast-temp">${hour.temp}°C</div>
        </div>
      `
          )
          .join("");
      }
    });
  }

  // Actualizar UI para el diseño 2
  function updateDesign2UI(data) {
    document.querySelectorAll(".design-2").forEach((card) => {
      // Actualizar selector de días
      const daySelector = card.querySelector(".day-selector");
      if (daySelector) {
        daySelector.innerHTML = data.daily
          .map(
            (day, index) => `
        <span class="day ${index === 0 ? "active" : ""}">${day.temp}°</span>
      `
          )
          .join("");
      }

      // Configurar el gráfico si existe Chart.js
      const canvas = card.querySelector("canvas");
      if (canvas && window.Chart) {
        new Chart(canvas, {
          type: "line",
          data: {
            labels: data.hourly.map((h) => h.time),
            datasets: [
              {
                label: "Temperatura",
                data: data.hourly.map((h) => h.temp),
                borderColor: "#FFFFFF",
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                display: false,
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    });
  }

  // Actualizar UI para el diseño 3
  function updateDesign3UI(data) {
    document.querySelectorAll(".design-3").forEach((card) => {
      const detailedForecast = card.querySelector(".detailed-forecast");
      if (detailedForecast) {
        detailedForecast.innerHTML = data.hourly
          .map(
            (hour) => `
        <div class="hour-card">
          <span class="time">${hour.time} hs</span>
          <div class="temp">${hour.temp}°C</div>
          <div class="humidity">10%</div>
        </div>
      `
          )
          .join("");
      }
    });
  }

  // Inicializar todas las interfaces
  updateDesign1UI(mockWeatherData);
  updateDesign2UI(mockWeatherData);
  updateDesign3UI(mockWeatherData);

  // Manejar el botón de búsqueda
  document.querySelectorAll(".search-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert("Función de búsqueda en desarrollo");
    });
  });

  // Actualizar el indicador de swipe según la posición
  function updateSwipeIndicator() {
    const indicator = document.querySelector(".swipe-indicator");
    if (currentIndex === totalCards - 1) {
      indicator.style.opacity = "0";
    } else {
      indicator.style.opacity = "1";
    }
  }

  // Inicializar el carrusel
  updateCarousel();
});
