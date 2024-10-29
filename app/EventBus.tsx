// src/common/EventBus.ts
type Callback<T = any> = (data: T) => void;

interface Events {
  [event: string]: Callback[];
}

const eventBus = (() => {
  const events: Events = {};

  return {
    on<T>(event: string, callback: Callback<T>): void {
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(callback);
    },
    dispatch<T>(event: string, data: T): void {
      if (events[event]) {
        events[event].forEach(callback => callback(data));
      }
    },
    remove<T>(event: string, callback: Callback<T>): void {
      if (!events[event]) return;

      events[event] = events[event].filter(cb => cb !== callback);
    },
  };
})();

export default eventBus;
