<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

const props = defineProps<{
	lat: number;
	lon: number;
	allowLocation: boolean;
}>();

const center = ref([props.lat, props.lon]);
const zoom = ref(5);

const userDataWeather = ref(null);
const loadUserLocation = ref(false);

const onMapReady = (mapIns: any) => {
	setUserLocation(mapIns);

	mapIns.on("click", async (e: any) => {
		const lat = e.latlng.lat;
		const lon = e.latlng.lng;

		center.value = [lat, lon];

		await getWeatherLocation(lat, lon);

		if (userDataWeather.value) {
			mapIns.setView([lat, lon], 13);

			L.popup()
				.setLatLng([lat, lon])
				.setContent(`<b>${userDataWeather.value.name}</b><br>${userDataWeather.value.weather[0].description}<br>${Math.round(userDataWeather.value.main.temp)}°C`)
				.openOn(mapIns);
		}
	});
};

const setUserLocation = (mapInst: any) => {
	if (userDataWeather.value && props.allowLocation) {
		mapInst.setView(center.value, 13);

		const icon = L.icon({
			iconUrl: `https://openweathermap.org/img/w/${userDataWeather.value.weather[0].icon}.png`,
			iconSize: [50, 50],
			iconAnchor: [25, 25],
			popupAnchor: [0, -25],
		});

		L.marker(center.value, { icon })
			.addTo(mapInst)
			.bindPopup(`<b>${userDataWeather.value.name}</b><br>${userDataWeather.value.weather[0].description}<br>${Math.round(userDataWeather.value.main.temp)}°C`)
			.openPopup();
	}
};

const getWeatherLocation = async (lat: number, lon: number) => {
	const response = await $fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=829d3baa0d5330188fc90008907604c7`);

	userDataWeather.value = await response;
};

watch(
	() => props.lat,
	async (lat) => {
		if (lat) {
			await getWeatherLocation(props.lat, props.lon);

			loadUserLocation.value = true;
		}
	},
	{ immediate: true }
);
</script>

<template>
	<div class="h-[700px] mx-auto mt-20">
		<LMap v-if="loadUserLocation" @ready="onMapReady" ref="map" :zoom="zoom" :center="center" inertia>
			<LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors' layer-type="base" name="OpenStreetMap" />
		</LMap>

		<div v-else class="flex justify-center items-center h-[700px]">
			<Loader2 class="w-4 h-4 mr-2 animate-spin" />
		</div>
	</div>
</template>
