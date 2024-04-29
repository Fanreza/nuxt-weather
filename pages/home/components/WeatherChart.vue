<script setup lang="ts">
import { Chart } from "highcharts-vue";
import type { Options } from "highcharts";

const props = defineProps<{
	data: any;
}>();

const showChart = ref(true);
const redrawChart = () => {
	showChart.value = false;

	nextTick(() => {
		showChart.value = true;
	});
};

const chartOptions = {
	series: [
		{
			name: "Temperature",
			data: [] as number[],
		},
	],
	title: {
		text: `Temperature Forecast `,
		align: "left",
	},
};

watch(
	() => props.data,
	async () => {
		chartOptions.series[0].data = props.data.list.map((item: any) => item.main.temp);
		chartOptions.title.text = `Temperature Forecast for ${props.data.city.name}`;

		redrawChart();
	},
	{ immediate: true }
);
</script>

<template>
	<div>
		<Chart v-if="showChart" class="hc" :options="chartOptions as Options" ref="chart"></Chart>
	</div>
</template>

<style scoped></style>
