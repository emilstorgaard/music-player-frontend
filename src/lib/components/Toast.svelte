<script lang="ts">
  import { toastStore } from '$lib/stores/toastStore';
</script>
  
<style>
  .toast {
    transition: opacity 0.3s ease-out;
  }
</style>


{#if $toastStore.visible}
  <div class="fixed top-4 right-4 transform -translate-x-1/2 z-50 max-w-xs w-full">
    <div class={`toast p-4 rounded-lg shadow-lg ${$toastStore.type === 'error' ? 'bg-red-500' : $toastStore.type === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
      <p class="font-semibold">{$toastStore.message}</p>
    </div>
  </div>
{/if}