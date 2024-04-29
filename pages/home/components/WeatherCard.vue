<script setup lang="ts">
const props = defineProps<{
	data: any;
}>();
</script>

<template>
	<div>
		<Card class="w-full">
			<CardHeader>
				<img :src="`https://openweathermap.org/img/w/${data.weather[0].icon}.png`" alt="" class="w-20 h-20" />
				<CardTitle>{{ data.name }}</CardTitle>
				<CardDescription>{{ data.weather[0].description }}</CardDescription>
			</CardHeader>
			<CardContent>
				<span class="font-bold text-3xl">{{ data.main.temp }} °C</span>
			</CardContent>
		</Card>
	</div>
</template>

<style scoped></style>
