import { getRoutines, saveRoutines, resetRoutines, generateId } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    let routines = getRoutines();
    
    // --- DOM Elements ---
    const dom = {
        container: document.getElementById('routines-container'),
        resetAllBtn: document.getElementById('reset-all'),
        addSlotBtn: document.getElementById('add-slot'),
        modal: {
            el: document.getElementById('custom-modal'),
            title: document.getElementById('modal-title'),
            message: document.getElementById('modal-message'),
            confirm: document.getElementById('modal-confirm'),
            cancel: document.getElementById('modal-cancel')
        }
    };

    // --- Modal Logic ---
    let modalCallback = null;

    const showModal = (title, message, onConfirm) => {
        dom.modal.title.textContent = title;
        dom.modal.message.textContent = message;
        dom.modal.el.classList.remove('hidden');
        setTimeout(() => dom.modal.el.classList.add('modal-open'), 10);
        modalCallback = onConfirm;
    };

    const hideModal = () => {
        dom.modal.el.classList.remove('modal-open');
        setTimeout(() => dom.modal.el.classList.add('hidden'), 300);
        modalCallback = null;
    };

    // --- Core Logic (DRY) ---
    const getTargetInfo = (target) => {
        const slot = target.closest('.routine-slot');
        if (!slot) return null;
        const routineId = slot.dataset.id;
        const routineIndex = routines.findIndex(r => r.id === routineId);
        const exerciseItem = target.closest('.exercise-item');
        const exerciseId = exerciseItem?.dataset.id;
        return { routineIndex, exerciseId, slot, exerciseItem };
    };

    const updateState = (action) => {
        action();
        saveRoutines(routines);
        renderAll();
    };

    const findExercise = (routineIndex, exerciseId) => 
        routines[routineIndex]?.exercises.find(ex => ex.id === exerciseId);

    // --- Actions ---
    const actions = {
        addSlot: () => updateState(() => {
            routines.push({ id: generateId(), name: `Nueva Rutina ${routines.length + 1}`, exercises: [] });
        }),
        resetAll: () => showModal('¿Borrar todo?', 'Esta acción eliminará todas tus rutinas permanentemente.', () => {
            routines = resetRoutines();
            renderAll();
        }),
        deleteSlot: (idx) => showModal('¿Eliminar rutina?', 'Se borrarán todos los ejercicios de esta rutina.', () => {
            updateState(() => routines.splice(idx, 1));
        }),
        addExercise: (idx) => updateState(() => {
            routines[idx].exercises.push({ id: generateId(), name: '', series: [false, false, false] });
        }),
        removeExercise: (rIdx, eId) => updateState(() => {
            routines[rIdx].exercises = routines[rIdx].exercises.filter(ex => ex.id !== eId);
        }),
        resetDay: (idx) => updateState(() => {
            routines[idx].exercises.forEach(ex => ex.series = ex.series.map(() => false));
        }),
        updateSerie: (rIdx, eId, sIdx, type) => updateState(() => {
            const ex = findExercise(rIdx, eId);
            if (!ex) return;
            if (type === 'toggle') ex.series[sIdx] = !ex.series[sIdx];
            if (type === 'add') ex.series.push(false);
            if (type === 'remove' && ex.series.length > 0) ex.series.pop();
            if (type === 'reset') ex.series = ex.series.map(() => false);
        })
    };

    // --- Event Listeners ---
    const setupEventListeners = () => {
        dom.resetAllBtn?.addEventListener('click', actions.resetAll);
        dom.addSlotBtn?.addEventListener('click', actions.addSlot);
        dom.modal.confirm?.addEventListener('click', () => { if (modalCallback) modalCallback(); hideModal(); });
        dom.modal.cancel?.addEventListener('click', hideModal);

        dom.container?.addEventListener('click', (e) => {
            const target = e.target;
            const info = getTargetInfo(target);
            if (!info) return;

            const { routineIndex, exerciseId } = info;

            if (target.closest('.add-exercise')) actions.addExercise(routineIndex);
            if (target.closest('.delete-slot')) actions.deleteSlot(routineIndex);
            if (target.closest('.reset-day-progress')) actions.resetDay(routineIndex);
            if (target.closest('.delete-exercise')) actions.removeExercise(routineIndex, exerciseId);
            
            const checkbox = target.closest('.serie-checkbox');
            if (checkbox) actions.updateSerie(routineIndex, exerciseId, parseInt(checkbox.dataset.index), 'toggle');
            if (target.closest('.add-serie')) actions.updateSerie(routineIndex, exerciseId, null, 'add');
            if (target.closest('.remove-serie')) actions.updateSerie(routineIndex, exerciseId, null, 'remove');
            if (target.closest('.reset-exercise-progress')) actions.updateSerie(routineIndex, exerciseId, null, 'reset');
        });

        dom.container?.addEventListener('input', (e) => {
            const info = getTargetInfo(e.target);
            if (!info) return;
            if (e.target.classList.contains('routine-name-input')) {
                routines[info.routineIndex].name = e.target.value;
                saveRoutines(routines);
            }
            if (e.target.classList.contains('exercise-name-input')) {
                const ex = findExercise(info.routineIndex, info.exerciseId);
                if (ex) { ex.name = e.target.value; saveRoutines(routines); }
            }
        });
    };

    // --- Templates (DRY) ---
    const createExerciseHTML = (ex) => {
        const completed = ex.series.filter(s => s).length;
        return `
            <div class="exercise-item group/item border-b border-white/5 py-4 last:border-0" data-id="${ex.id}">
                <div class="flex items-center justify-between gap-4">
                    <input type="text" value="${ex.name}" placeholder="Ejercicio..." class="input-ghost text-lg font-medium exercise-name-input" />
                    <button class="delete-exercise opacity-100 md:opacity-0 group-hover/item:opacity-100 text-gray-600 hover:text-red-500 transition-all p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
                <div class="flex flex-wrap items-center gap-2 mt-2 series-container" data-exercise-id="${ex.id}">
                    ${ex.series.map((s, i) => `
                        <label class="relative cursor-pointer group">
                            <input type="checkbox" ${s ? 'checked' : ''} class="checkbox-custom serie-checkbox" data-index="${i}" />
                        </label>
                    `).join('')}
                    <div class="flex gap-2 ml-2 shrink-0">
                        <button class="add-serie text-gray-500 hover:text-violet-400 transition-colors text-2xl font-bold p-1">+</button>
                        <button class="remove-serie text-gray-500 hover:text-red-400 transition-colors text-2xl font-bold p-1">-</button>
                        <button class="reset-exercise-progress text-gray-500 hover:text-yellow-400 transition-colors ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                    </div>
                    <span class="text-xs text-gray-500 ml-auto font-medium">${completed}/${ex.series.length}</span>
                </div>
            </div>`;
    };

    const renderAll = () => {
        if (!dom.container) return;
        if (routines.length === 0) {
            dom.container.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500 text-xl">No tienes rutinas. Haz clic en "Agregar Rutina".</div>';
            return;
        }
        dom.container.innerHTML = routines.map((r, i) => `
            <div class="card animate-fade-in flex flex-col gap-2 h-full routine-slot" data-id="${r.id}" data-index="${i}">
                <div class="flex justify-between items-center mb-4 gap-2">
                    <input type="text" value="${r.name}" placeholder="Nombre..." class="input-ghost text-xl font-bold text-gray-200 routine-name-input" />
                    <div class="flex gap-2 shrink-0">
                        <button class="reset-day-progress p-1 text-gray-500 hover:text-yellow-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                        <button class="delete-slot p-1 text-gray-500 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
                <div class="exercises-list flex-grow">
                    ${r.exercises.length === 0 ? '<p class="text-gray-600 text-sm italic py-4 text-center">Sin ejercicios.</p>' : r.exercises.map(ex => createExerciseHTML(ex)).join('')}
                </div>
                <button class="add-exercise mt-4 w-full py-2 border-2 border-dashed border-white/5 rounded-lg text-gray-500 hover:text-primary flex items-center justify-center gap-2 transition-all">
                    <span class="text-xl">+</span><span class="text-sm font-medium">Agregar ejercicio</span>
                </button>
            </div>`).join('');
    };

    setupEventListeners();
    renderAll();
});
