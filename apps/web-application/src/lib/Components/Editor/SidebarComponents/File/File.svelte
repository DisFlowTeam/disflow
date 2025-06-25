<script lang="ts">
	import { changeContent } from "./Switch";

    let { name }: { name: string } = $props();
	import FaBars from 'svelte-icons/fa/FaBars.svelte';
	import Dropdown from '$lib/Components/Theme/Dropdown/Dropdown.svelte';

	const DropdownOptions: string[] = ['Clear', 'Download', 'Rename', 'Delete'];
  function openFile(fileName: string) {
    console.log(`Opening file: ${fileName}`);
  }
	function onOptionSelected(option: string) {
		switch (option) {
			case 'Clear':
				console.log('Clear selected');
				break;
			case 'Download':
				console.log('Download selected');
				break;
              case 'Rename':
         console.log('Rename selected');
        break;  
       case 'Delete':
        console.log('Delete selected');
        break;
		}
	}
</script>
<div class="flex items-center justify-between px-3 pt-3">
  <button class="flex items-center cursor-pointer" onclick={() => openFile(name)}>
      <img src="/DISFLOW_ICO.png" alt="Disflow file" class="h-10 rounded-sm">
      <span class="ml-3 text-gray-200 text-lg">{name}</span>

    </button>
  <div class="flex items-center space-x-2">
    <Dropdown options={DropdownOptions} onSelect={onOptionSelected}>
      <div class="flex items-center h-8 px-2 rounded-lg text-gray-300 cursor-pointer">
        <FaBars />
      </div>
    </Dropdown>
  </div>
  </div>
