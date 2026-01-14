<script lang="ts">
	import { logged } from "$lib";

	$effect(() => {
        if(logged.isLogged) {
            window.location.replace(window.location.pathname + "/general")
        }
    })
</script>