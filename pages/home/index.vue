<script setup lang="ts">
definePageMeta({
	path: "/",
});

const lat = ref<null | number>(null);
const lon = ref<null | number>(null);
const allowLocation = ref(false);

const forecastData = ref<null | any>(null);
const weatherData = ref<null | any>(null);

const getUserLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				allowLocation.value = true;
				lat.value = position.coords.latitude;
				lon.value = position.coords.longitude;
			},
			(error) => {
				allowLocation.value = false;
				lat.value = -6.2146;
				lon.value = 106.8451;
			}
		);
	}
};

const getForecast = async (city?: string) => {
	const response = city ? await $fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=829d3baa0d5330188fc90008907604c7`) : await $fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat.value}&lon=${lon.value}&units=metric&appid=829d3baa0d5330188fc90008907604c7`);
	forecastData.value = response;
};

const getWeatherByCity = async (city: string) => {
	const response = await $fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=829d3baa0d5330188fc90008907604c7`);
	weatherData.value = response;
};

const getWeather = async () => {
	const response = await $fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&units=metric&appid=829d3baa0d5330188fc90008907604c7`);
	weatherData.value = response;
};

onMounted(async () => {
	getUserLocation();
});

watch([lat, lon], async () => {
	if (lat.value && lon.value) {
		getForecast();
		getWeather();
	}
});

const searchCityLoading = ref(false);
const searchCity = async (city: string) => {
	searchCityLoading.value = true;

	await getWeatherByCity(city);
	await getForecast(city);

	searchCityLoading.value = false;
};
</script>

<template>
	<div class="p-20">
		<HomeComponentsSearchCity @search="searchCity" :disabled="searchCityLoading" />

		<div class="flex items-center gap-10 justify-center mt-20">
			<ClientOnly>
				<HomeComponentsWeatherChart v-if="forecastData" :data="forecastData" class="w-[50%]" />
			</ClientOnly>
			<HomeComponentsWeatherCard v-if="weatherData" :data="weatherData" class="w-[30%]" />
		</div>
		<HomeComponentsWeatherMap v-if="lat && lon" :lat="lat" :lon="lon" :allow-location="allowLocation" />
	</div>
</template>

<style scoped></style>
