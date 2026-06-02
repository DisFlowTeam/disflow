<script lang="ts">
import type { Tooltip as TooltipPrimitive } from "bits-ui";

let { ...restProps }: TooltipPrimitive.PortalProps = $props();
</script>

<TooltipPrimitive.Portal {...restProps} />
