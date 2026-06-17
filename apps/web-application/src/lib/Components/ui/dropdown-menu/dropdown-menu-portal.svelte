<script lang="ts">
import type { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

let { ...restProps }: DropdownMenuPrimitive.PortalProps = $props();
</script>

<DropdownMenuPrimitive.Portal {...restProps} />
