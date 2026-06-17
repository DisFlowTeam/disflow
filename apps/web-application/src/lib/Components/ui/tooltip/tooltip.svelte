<script lang="ts">
import type { Tooltip as TooltipPrimitive } from "bits-ui";

let { open = $bindable(false), ...restProps }: TooltipPrimitive.RootProps =
	$props();
</script>

<TooltipPrimitive.Root bind:open {...restProps} />
