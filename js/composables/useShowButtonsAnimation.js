import { ref, computed, nextTick } from 'vue';

export function useShowButtonsAnimation() {
	// State encapsulated and managed by the composable
	const areButtonsShown = ref(false);
	const showButtonsTimeout = ref(undefined);
	const buttonsShownStyle = ref({
		transition: 'opacity 0.5s, transform 0.5s',
		opacity: 1,
		transform: 'none'
	});
	const buttonsEnterFromLeaveToStyle = ref({
		opacity: 0,
		transform: 'translateX(20px)',
	});
	const buttonsStyle = ref({});

	async function showButtons() {
		if (!areButtonsShown.value) {
			areButtonsShown.value = true;
			// Manage style
			buttonsStyle.value = { ...buttonsShownStyle.value, ...buttonsEnterFromLeaveToStyle.value };
			// Make the browser to wait for the next repaint to apply changes
			// to transition properties
			requestAnimationFrame(() => {
				Object.assign(buttonsStyle.value, buttonsShownStyle.value);
			})
			// Manage timeout
			showButtonsTimeout.value = setTimeout(async () => {
				showButtonsTimeout.value = clearTimeout(showButtonsTimeout.value);
				// Change buttons' style
				Object.assign(buttonsStyle.value, buttonsEnterFromLeaveToStyle.value);
			}, 5000)
		}	else {
			// Manage style
			Object.assign(buttonsStyle.value, buttonsEnterFromLeaveToStyle.value);
			// Manage timeout
			showButtonsTimeout.value = clearTimeout(showButtonsTimeout.value);
		} 
	}

	function removeButtonsFromFlow(event) {
		if (buttonsStyle.value.opacity === 0) {
			areButtonsShown.value = false;
		}
	}

	return { buttonsStyle, areButtonsShown, showButtonsTimeout, showButtons, removeButtonsFromFlow };
};

