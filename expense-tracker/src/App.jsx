import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './index.css';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const titleInputRef = useRef(null);

  useEffect(() => {
    // Mock API Fetch Simulation
    const fetchInitialData = async () => {
      setTimeout(() => {
        const mockData = [
          { id: 1, title: 'Internet Charges', amount: 500 },
          { id: 2, title: 'Train Ticket', amount: 250 },
        ];
        setExpenses(mockData);
        setLoading(false);
        titleInputRef.current?.focus();
      }, 1000);
    };
    fetchInitialData();
  }, []);

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setTitle(expense.title);
    setAmount(expense.amount);
    titleInputRef.current.focus();
  };

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    if (editingId) {
      setExpenses(expenses.map(exp => 
        exp.id === editingId ? { ...exp, title, amount: parseFloat(amount) } : exp
      ));
      setEditingId(null);
    } else {
      const newExpense = {
        id: Date.now(),
        title,
        amount: parseFloat(amount),
      };
      setExpenses((prev) => [...prev, newExpense]);
    }

    setTitle('');
    setAmount('');
    titleInputRef.current.focus();
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="main-wrapper">
      <div className="tracker-card">
        <h2 className="header">Expense Tracker</h2>
        
        <form className="input-row" onSubmit={handleSubmit}>
          <input 
            ref={titleInputRef}
            type="text" 
            placeholder="Expense Title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          <input 
            type="number" 
            placeholder="Amount ₹" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
          <button type="submit" className="add-btn">
            {editingId ? 'Update' : 'Add Expense'}
          </button>
        </form>

        <h3 className="total-text">Total Expense: ₹{totalExpense.toFixed(2)}</h3>

        <div className="expense-container">
          {expenses.map((expense) => (
            <ExpenseItem 
              key={expense.id} 
              expense={expense} 
              onDelete={deleteExpense} 
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ExpenseItem = React.memo(({ expense, onDelete, onEdit }) => {
  return (
    <div className="expense-row">
      <span className="exp-title">{expense.title}</span>
      <div className="exp-details">
        <span className="exp-amount">₹{expense.amount}</span>
        <div className="btn-group">
          <button className="action-btn edit" onClick={() => onEdit(expense)}>✏️</button>
          <button className="action-btn delete" onClick={() => onDelete(expense.id)}>❌</button>
        </div>
      </div>
    </div>
  );
});

export default ExpenseTracker;