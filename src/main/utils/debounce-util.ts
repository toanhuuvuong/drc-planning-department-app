export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): T => {
  let timerId: ReturnType<typeof setTimeout>;

  return ((...args: any[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => func(...args), delay);
  }) as T;
};
