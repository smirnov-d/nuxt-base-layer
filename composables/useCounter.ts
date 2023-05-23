const counter = ref(0);
export const useCounter = () => {
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
