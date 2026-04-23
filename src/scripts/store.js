const STORAGE_KEY = "rutina-semanal";

export const getInitialData = () => {
    return [
        {
            id: generateId(),
            name: "Rutina 1",
            exercises: []
        }
    ];
};

export const getRoutines = () => {
    if (typeof window === 'undefined') return getInitialData();
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : getInitialData();
};

export const saveRoutines = (routines) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
    window.dispatchEvent(new CustomEvent('routines-updated', { detail: routines }));
};

export const resetRoutines = () => {
    const empty = getInitialData();
    saveRoutines(empty);
    return empty;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
