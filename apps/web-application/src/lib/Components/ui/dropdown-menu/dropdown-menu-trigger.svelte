<script lang="ts">
import type { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

let {
	ref = $bindable(null),
	...restProps
}: DropdownMenuPrimitive.TriggerProps = $props();
</script>

<DropdownMenuPrimitive.Trigger bind:ref data-slot="dropdown-menu-trigger" {...restProps} />
