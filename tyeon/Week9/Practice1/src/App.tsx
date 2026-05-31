import { useState } from 'react';
import './App.css';
import CounterWithState from './components/CounterWithState';
import CounterWithReducer from './components/CounterWithReducer';
import TodoWithState from './components/TodoWithState';
import TodoWithReducer from './components/TodoWithReducer';
import Summary from './components/Summary';

type Tab = 'counter' | 'todo' | 'summary';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('counter');

  return (
    <div className="app">
      <div className="app-header">
        <h1>useState vs useReducer</h1>
        <p>언제 useState를 쓰고, 언제 useReducer를 써야 할까?</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'counter' ? 'active' : ''}`}
          onClick={() => setActiveTab('counter')}
        >
          예제 1 — 카운터
        </button>
        <button
          className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          예제 2 — 할 일 목록
        </button>
        <button
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          비교 정리
        </button>
      </div>

      {activeTab === 'counter' && (
        <div className="comparison">
          <div className="card">
            <div className="card-header state-color">
              <span>useState</span>
              <span className="badge badge-state">Simple</span>
            </div>
            <div className="card-body">
              <CounterWithState />
            </div>
          </div>

          <div className="card">
            <div className="card-header reducer-color">
              <span>useReducer</span>
              <span className="badge badge-reducer">Action-based</span>
            </div>
            <div className="card-body">
              <CounterWithReducer />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'todo' && (
        <div className="comparison">
          <div className="card">
            <div className="card-header state-color">
              <span>useState</span>
              <span className="badge badge-state">여러 개 분산</span>
            </div>
            <div className="card-body">
              <TodoWithState />
            </div>
          </div>

          <div className="card">
            <div className="card-header reducer-color">
              <span>useReducer</span>
              <span className="badge badge-reducer">하나로 통합</span>
            </div>
            <div className="card-body">
              <TodoWithReducer />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'summary' && <Summary />}
    </div>
  );
}

export default App;
