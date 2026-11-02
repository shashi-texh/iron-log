import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TodoList } from '../components/todo/TodoList';
import { TodoForm } from '../components/todo/TodoForm';
import { showToast } from '../components/ui/Toast';
import { Plus, Filter, Download, Upload, CheckCircle, Circle } from 'lucide-react';

export function TodoPage() {
  const { todos, getActiveTodos, getCompletedTodos, addTodo, deleteTodo } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const importRef = useRef(null);

  const activeCount = getActiveTodos().length;
  const completedCount = getCompletedTodos().length;

  const handleExport = () => {
    if (todos.length === 0) {
      showToast('No tasks to export', 'info');
      return;
    }
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ironlog-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Tasks exported', 'success');
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const list = Array.isArray(data) ? data : data.todos;
        if (!Array.isArray(list)) throw new Error('Invalid file');
        const valid = list.filter(todo => todo && todo.title);
        valid.forEach(todo => addTodo({
          title: todo.title,
          description: todo.description,
          category: todo.category || 'general',
          priority: todo.priority || 'medium',
          dueDate: todo.dueDate,
          completed: Boolean(todo.completed),
        }));
        showToast(`Imported ${valid.length} task${valid.length === 1 ? '' : 's'}`, 'success');
      } catch {
        showToast('Could not import file. Expected a JSON array of tasks.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearCompleted = () => {
    if (completedCount === 0) {
      showToast('No completed tasks to clear', 'info');
      return;
    }
    if (!confirm(`Delete ${completedCount} completed task${completedCount === 1 ? '' : 's'}?`)) return;
    getCompletedTodos().forEach(todo => deleteTodo(todo.id));
    showToast('Completed tasks cleared', 'info');
  };

  const handleEditTodo = (e) => {
    setEditingTodo(e.detail);
    setShowForm(true);
  };

  useEffect(() => {
    window.addEventListener('editTodo', handleEditTodo);
    return () => window.removeEventListener('editTodo', handleEditTodo);
  }, []);

  return (
    <div className="page todo-page">
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>To-Do List</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Organize your training, nutrition, and recovery tasks</p>
          </div>
          <button onClick={() => { setEditingTodo(null); setShowForm(true); }} className="btn btn-primary">
            <Plus size={18} />
            Add Task
          </button>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--color-accent)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              {activeCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Active Tasks</div>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-success)' }}>
              {completedCount}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Completed</div>
          </div>
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center', borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-warning)' }}>
              {todos.length}
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Total Tasks</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={handleExport}>
            <Download size={18} />
            Export Tasks
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => importRef.current?.click()}>
            <Upload size={18} />
            Import Tasks
          </button>
          <input ref={importRef} type="file" accept="application/json,.json" onChange={handleImport} style={{ display: 'none' }} />
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }} onClick={handleClearCompleted}>
            <Circle size={18} />
            Clear Completed
          </button>
        </div>

        <TodoList />
      </div>

      {showForm && (
        <TodoForm
          initialData={editingTodo}
          onClose={() => { setShowForm(false); setEditingTodo(null); }}
        />
      )}
    </div>
  );
}