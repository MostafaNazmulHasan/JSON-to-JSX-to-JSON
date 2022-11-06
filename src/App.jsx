import { useState } from 'react'
import './App.css';
function* generateId() {
  let id = 0;
  while (true) {
    yield id++;
  }
}
const getId = generateId();
// console.log(getId.next());
// console.log(getId.next());
// console.log(getId.next());
// console.log(getId.next());

const InitialInputState = {
  a: 0,
  b: 0,
}
const App = () => {
  const [inputState, setInputState] = useState({ ...InitialInputState });
  const [result, setResult] = useState(0);
  const [histories, setHistories] = useState([]);
  const [restoredHistory, setRestoredHistory] = useState(null);

  const handleInputFields = (e) => {
    setInputState({
      ...inputState,
      [e.target.name]: parseInt(e.target.value)
    })
  }
  const handleClearOps = () => {
    setInputState({ ...InitialInputState })
    setResult(0)
  };
  const handleOperations = (operator) => {
    if (!inputState.a || !inputState.b) {
      alert('Invalid Input');
      return;
    }
    const f = new Function(
      'operator',
      `return ${inputState.a} ${operator} ${inputState.b}`
    );
    const result = f(operator)
    setResult(result);

    const history = {
      id: getId.next(),
      inputs: inputState,
      operator,
      date: new Date(),
      result,
    }
    setHistories([...histories, history])
  }
  const handleRestoreBtn = (historyItem) => {
    setInputState({ ...historyItem.inputs });
    setResult(historyItem.result);
    setRestoredHistory(historyItem.id);
  }

  return (
    <div>
      <h1>{result}</h1>
      <div>
        <p>Inputs:</p>
        <input type="number" value={inputState.a} onChange={handleInputFields} name='a' />
        <input type="number" value={inputState.b} onChange={handleInputFields} name='b' />
      </div>
      <div>
        <p>Operations:</p>
        <button onClick={() => handleOperations('+')}>+</button>
        <button onClick={() => handleOperations('-')}>-</button>
        <button onClick={() => handleOperations('*')}>*</button>
        <button onClick={() => handleOperations('/')}>/</button>
        <button onClick={handleClearOps}>Clear</button>

      </div>
      <div>
        <p>History</p>
        {histories.length === 0 ?
          (<p>There is no history</p>) :
          (<ul>
            {histories.map(historyItem =>
            (<li key={historyItem.id}>
              <p>Operations: {historyItem.inputs.a} {historyItem.operator} {historyItem.inputs.b},Result= {historyItem.result} </p>
              <small>Date:{historyItem.date.toLocaleDateString()} Time:{historyItem.date.toLocaleTimeString()}</small>
              <br />
              <button onClick={() => handleRestoreBtn(historyItem)}
              disabled={
                restoredHistory !== null && restoredHistory == historyItem.id
              }
              >Restore</button>
            </li>))
            }


          </ul>)}


      </div>
    </div>
  )
};

export default App
