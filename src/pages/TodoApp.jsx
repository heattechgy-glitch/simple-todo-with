import { useState, useEffect } from 'react'

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      dueDate: dueDate || null,
      priority: priority,
      createdAt: new Date().toISOString()
    }

    setTodos([todo, ...todos])
    setNewTodo('')
    setDueDate('')
    setPriority('medium')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id) => {
    if (!editText.trim()) return
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ))
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50'
    }
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return '🔴 High'
      case 'medium':
        return '🟡 Medium'
      case 'low':
        return '🟢 Low'
      default:
        return priority
    }
  }

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    if (filter === 'high') return todo.priority === 'high' && !todo.completed
    return true
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const completedCount = todos.filter(t => t.completed).length
  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: '#3b82f6' }}>
            ✅ Todo App
          </h1>
          <p className="text-slate-400">Stay organized, get things done</p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="text-slate-400">
              <span className="text-white font-semibold">{activeCount}</span> active
            </span>
            <span className="text-slate-400">
              <span className="text-white font-semibold">{completedCount}</span> completed
            </span>
          </div>
        </header>

        <form onSubmit={addTodo} className="bg-slate-800 rounded-xl p-4 sm:p-6 mb-6 shadow-lg">
          <div className="space-y-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm text-slate-400 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-all"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: '#3b82f6' }}
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'active', 'completed', 'high'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              style={filter === f ? { backgroundColor: '#3b82f6' } : {}}
            >
              {f === 'all' && '📋 All'}
              {f === 'active' && '⏳ Active'}
              {f === 'completed' && '✅ Completed'}
              {f === 'high' && '🔴 High Priority'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sortedTodos.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm">Add a task above to get started!</p>
            </div>
          ) : (
            sortedTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-slate-800 rounded-xl p-4 shadow-lg transition-all hover:bg-slate-750 ${
                  todo.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      todo.completed
                        ? 'border-[#3b82f6] bg-[#3b82f6]'
                        : 'border-slate-500 hover:border-[#3b82f6]'
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(todo.id)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white focus:outline-none focus:border-[#3b82f6]