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
				lat.value = 0.7893;
				lon.value = 113.9213;
			}
		);
	}
};

const getForecast = async () => {
	const response = await $fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat.value}&lon=${lon.value}&units=metric&appid=829d3baa0d5330188fc90008907604c7`);
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
</script>

<template>
	<div class="p-20">
		<HomeComponentsSearchCity @search="getWeatherByCity" />

		<div class="flex items-center gap-10 justify-between">
			<HomeComponentsWeatherCard v-if="weatherData" :data="weatherData" class="w-[30%]" />
			<ClientOnly>
				<HomeComponentsWeatherChart v-if="forecastData" :data="forecastData" class="w-[50%]" />
			</ClientOnly>
		</div>
		<HomeComponentsWeatherMap v-if="lat && lon" :lat="lat" :lon="lon" :allow-location="allowLocation" />
	</div>
</template>

<style scoped></style>
