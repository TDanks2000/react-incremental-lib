export const useLoadSaveGame = <T>(): T => {
  const data = localStorage.getItem('data');

  if (data) return JSON.parse(data) as T;
  return {} as T;
};
