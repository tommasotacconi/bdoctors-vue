import { ref } from 'vue';

export function useRippleEffect() {
	const rippleStyle = ref({});
	const isAnimating = ref(false);

	const triggerRipple = (event, buttonRef) => {
		if (!buttonRef) return;

		// Get button dimensions and cursor position
		const rect = buttonRef.getBoundingClientRect();
		const size = Math.max(rect.width, rect.height); // Circle size to cover the button
		const x = event.clientX - rect.left - size / 2; // X position relative to the button
		const y = event.clientY - rect.top - size / 2; // Y relative position

		// Set ripple style
		rippleStyle.value = {
			width: `${size}px`,
			height: `${size}px`,
			top: `${y}px`,
			left: `${x}px`,
		};

		// Trigger animation
		isAnimating.value = true;

		// Reset animation after it completes
		setTimeout(() => {
			isAnimating.value = false;
		}, 1000); // Match the animation duration in CSS
	};

	return { rippleStyle, isAnimating, triggerRipple };
}