import { writable } from 'svelte/store';

export const toastStore = writable<{
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}>({
  visible: false,
  message: '',
  type: 'error'
});

// Function to trigger toast
export function triggerToast(message: string, type: 'success' | 'error' | 'info', duration: number = 3000) {
    console.log("her sætter jeg toastStore", true, message, type);
  toastStore.set({ visible: true, message, type });

  setTimeout(() => {
    toastStore.set({ visible: false, message: '', type });
  }, duration);
}
