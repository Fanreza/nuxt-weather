<script setup lang="ts">
const props = defineProps<{
	disabled: boolean;
}>();

const emit = defineEmits(["search"]);

const searchCity = useDebounceFn((e: Event) => {
	const city = (e.target as HTMLInputElement).value;
	emit("search", city);
}, 1000);
</script>

<template>
	<div>
		<div class="grid w-full max-w-sm items-center gap-1.5 mx-auto">
			<Label for="city">Search City</Label>
			<Input id="city" type="text" placeholder="type city" @input="searchCity" :disabled="disabled" />
		</div>
	</div>
</template>

<style scoped></style>
