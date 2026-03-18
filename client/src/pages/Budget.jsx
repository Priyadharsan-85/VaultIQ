import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetMeter from '../components/BudgetMeter';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const categories = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills'];

  const fetchData = async () => {
    try {
      const budgetRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/budget`);
      const transRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`);
      setBudgets(budgetRes.data);
      setTransactions(transRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSpentForCategory = (cat) => {
    return transactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Monthly Budget</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const b = budgets.find(item => item.category === cat);
          const spent = getSpentForCategory(cat);
          const limit = b ? b.monthlyLimit : 10000;
          
          return (
            <BudgetMeter 
              key={cat} 
              category={cat} 
              spent={spent} 
              limit={limit} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Budget;
