<script lang="ts">
	import { page } from "$app/state";
	import { CommandNode, getGunUser, logged, ProjectNode } from "$lib";
    import CommandBanner from "$lib/Components/Dashboard/Projects/CommandBanner.svelte";
	import Swal from "sweetalert2";

	let listenerRegistered = false;
	let unsub: (() => unknown) | undefined;

	let commands = $state<{ name: string, updatedAt: number }[]>([]);

    $effect(() => {
        if(listenerRegistered || !logged.isLogged) return;
        listenerRegistered = true;

        const project = new ProjectNode(page.params.id!);

        unsub = project.watchCommands((cmd) => {
            const hasIndex = commands.findIndex(v => cmd.name === v.name);
            if(hasIndex === -1) return commands.push(cmd);
            commands[hasIndex] = cmd;
        })

        return () => {
            unsub?.();
        }
    });
</script>

<div class="h-full w-full p-3">
	<button
		class="text-blue-400 cursor-pointer border-blue-400 px-3 py-2 border-2 rounded-lg hover:rounded-sm hover:text-blue-500 hover:border-blue-500 transition-all"
        onclick={async () => {
            const isConfirm = await Swal.fire({
                title: "Create a Command",
                input: 'text',
                inputAttributes: {
                    autocapitalize: "off"
                },
                icon: "info",
                showCancelButton: true,
				confirmButtonText: 'Confirm',
				theme: 'dark',
				showLoaderOnConfirm: true,
                preConfirm: async (inputValue: string) => {
                    inputValue = inputValue.toLowerCase();

                    const DISCORD_COMMAND_REGEX = /^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

                    if(!DISCORD_COMMAND_REGEX.test(inputValue)) {
                        Swal.showValidationMessage("Command name could not be used");
                        return;
                    }

                    const namespace = CommandNode.createNamespace(page.params.id!, inputValue);
                    // @ts-expect-error
                    const commandExists = !!(await getGunUser().get(namespace).then());

                    if(commandExists) {
                        Swal.showValidationMessage("Command name is taken already!");
                        return;
                    }

                    const project = new ProjectNode(page.params.id!);

                    await project.createCommand(inputValue);
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
        }}
	>
		Create Command
	</button>
    <div class="w-full mt-3 h-11/12 overflow-y-auto">
        <div class="w-full flex flex-wrap gap-4">
            {#each commands as cmd}
                <CommandBanner name={cmd.name} projectId={page.params.id!} updatedAt={cmd.updatedAt} />
            {/each}
        </div>
    </div>
</div>
