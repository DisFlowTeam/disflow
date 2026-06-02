<script lang="ts">
import type { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

let { ref = $bindable(null), ...restProps }: DropdownMenuPrimitive.GroupProps =
	$props();
</script>

<DropdownMenuPrimitive.Group bind:ref data-slot="dropdown-menu-group" {...restProps} />
