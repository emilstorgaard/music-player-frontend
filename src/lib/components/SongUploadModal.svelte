<script lang="ts">
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
    let file: File | null = null; // File type
    let fileName: string | null = null; // Store the name of the file
  
    function handleSongUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        file = target.files[0];
        fileName = file.name; // Store the name of the selected file
      }
    }
  
    async function submit() {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const response = await fetch('https://music.emilstorgaard.dk/api/Songs', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            console.log('File uploaded successfully');
            close();
          } else {
            console.error('File upload failed');
          }
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }
  
    function close() {
      dispatch('close');
    }
  </script>
  
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-gray-900 text-white rounded-lg p-6 shadow-lg w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Upload File</h2>
      <input 
        type="file" 
        on:change={handleSongUpload} 
        class="mb-4 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-green-500" 
      />
      {#if fileName}
        <div class="mb-2 text-gray-400">{fileName}</div>
      {/if}
      <div class="flex justify-end">
        <button 
          on:click={close} 
          class="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded mr-2"
        >
          Cancel
        </button>
        <button 
          on:click={submit} 
          class="bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  </div>
  