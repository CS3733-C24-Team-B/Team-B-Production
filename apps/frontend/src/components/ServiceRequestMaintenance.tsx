import React, {useState} from 'react';
import './App.css';

function App() {
    const [name, setName] = useState("");
    const [prio, setPrio] = useState("low");
    const [loc, setLoc] = useState("");
    const [what, setWhat] = useState("");
    const [status, setStatus] = useState("unassigned");

    return (
        <div className="App">
            <header>Sanitation Request Form</header>
            <form>
                <label>Name: </label>
                <input type="text" onChange={(e) => {
                    setName(e.target.value);
                }}/>
                <br/>
                <label>Priority: </label>
                <select onChange={(e) => {
                    setPrio(e.target.value);
                }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                </select>
                <br/>
                <label>Location: </label>
                <input type="text" onChange={(e) => {
                    setLoc(e.target.value);
                }}/>
                <br/>
                <label>What: </label>
                <input type="text" onChange={(e) => {
                    setWhat(e.target.value);
                }}/>
                <br/>
                <label>Status: </label>
                <select onChange={(e) => {
                    setStatus(e.target.value);
                }}>
                    <option value="unassigned">Unassigned</option>
                    <option value="assigned">Assigned</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
                <br/>
                <input value="Submit" type="button" onClick={() => {
                    console.log(name + "\n" + prio + "\n" + loc + "\n" + what + "\n" + status);
                }}/>
            </form>
        </div>
    );
}

export default App;
