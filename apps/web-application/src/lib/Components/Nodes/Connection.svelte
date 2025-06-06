<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy, onMount } from 'svelte';
	let point1Start: HTMLDivElement;
	let point1End: HTMLDivElement;
	let point2Start: HTMLDivElement;
	let point2End: HTMLDivElement;

	onMount(() => {
		const canvasInj = document.getElementById('injectCanvas')! as HTMLDivElement;
		canvasInj.innerHTML = '';
		const canvas = document.createElement('canvas');
		canvas.classList.add('w-screen', 'h-screen', 'absolute', 'top-0', 'left-0', 'z-10');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvasInj.appendChild(canvas);

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.removeEventListener("resize", resizeCanvas);
        window.addEventListener("resize", resizeCanvas);

		const ctx = canvas.getContext('2d')!;

		function connectPoints(ele1: HTMLDivElement, ele2: HTMLDivElement) {
			const [startCont1, endCont1] = [ele1.getBoundingClientRect(), ele2.getBoundingClientRect()];

			const contX1 = (startCont1.left + startCont1.width / 2) + window.scrollX;
			const contY1 = (startCont1.top + startCont1.height / 2) + window.scrollY;
			const contX2 = (endCont1.left + endCont1.width / 2) + window.scrollX;
			const contY2 = (endCont1.top + endCont1.height / 2) + window.scrollY;

			const ctrlContX1 = contX1 + 100;
			const ctrlContY1 = contY1;
			const ctrlContX2 = contX2 - 100;
			const ctrlContY2 = contY2;

			ctx.beginPath();
			ctx.strokeStyle = 'grey';
			ctx.lineWidth = 5;
			ctx.moveTo(contX1, contY1);
			ctx.bezierCurveTo(ctrlContX1, ctrlContY1, ctrlContX2, ctrlContY2, contX2, contY2);
			ctx.stroke();
			ctx.closePath();
		}
        const MAX_RADIUS = 5;
        let circles: { x: number, y: number, radius: number }[] = [];

        const animate = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            circles = circles.filter(v => v.radius < MAX_RADIUS);

            circles.forEach(({ x, y, radius }, i) => {
                ctx.beginPath();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.arc(x, y, radius + 0.2, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();

                circles[i] = { x, y, radius: radius + 0.2 };
            });

            const c = { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: 1 };
            ctx.beginPath();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 2;
            ctx.arc(c.x, c.y, 1, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            circles.push(c);

            connectPoints(point1Start, point1End);
		    connectPoints(point2Start, point2End);

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
	});

	onDestroy(() => {
		if (browser) {
			const canvasInj = document.getElementById('injectCanvas') as HTMLDivElement | null;

			if (canvasInj) canvasInj.innerHTML = '';
		}
	});
</script>

{#if browser}
	<div class="absolute flex items-center justify-around scale-container">
		<div>
			<div
				class="lg:w-52 relative rounded-xl custom-shadow-blue border-2 border-black md:w-52 md:h-32 w-32 lg:h-32 h-24 flex justify-center items-center bg-blue-300 text-yellow-50"
			>
				<div
					class="absolute right-[-10px] w-5 h-5 border-2 border-black bg-white rounded-full"
					bind:this={point1Start}
				></div>
				<p class="lg:text-3xl md:text-2xl font-bold text-xl">GRAPH</p>
			</div>
			<div
				class="lg:w-52 rounded-xl border-2 relative custom-shadow-blue border-black md:w-52 md:h-32 w-32 lg:h-32 h-24 flex justify-center items-center lg:mt-32 mt-20 bg-blue-300 text-yellow-50"
			>
				<div
					class="absolute right-[-10px] w-5 h-5 border-2 border-black bg-white rounded-full"
					bind:this={point2Start}
				></div>
				<p class="lg:text-3xl md:text-2xl font-bold text-xl">FLOW</p>
			</div>
		</div>
		<div
			class="lg:w-52 md:w-52 border-2 border-black custom-shadow-yellow md:h-32 w-32 lg:h-32 h-24 flex relative rounded-xl justify-center items-center bg-blue-300 text-yellow-50"
		>
			<div class="absolute left-[-10px]">
				<div
					class="w-5 h-5 mb-3 bg-white border-2 rounded-full border-black"
					bind:this={point1End}
				></div>
				<div
					class="w-5 h-5 bg-white border-2 border-black rounded-full"
					bind:this={point2End}
				></div>
			</div>
			<p class="lg:text-3xl md:text-2xl font-bold text-xl">SHIP</p>
		</div>
	</div>
{/if}
