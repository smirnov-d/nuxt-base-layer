const counter = ref(0);
export const useRequestCounter = () => {
  const increment = () => {
    counter.value++;
  };
  const decrement = () => {
    counter.value--;
  }
  return {
    counter,
    increment,
    decrement,
  };
}
