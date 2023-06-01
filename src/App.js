import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3";
import Lottery from './lottery';


const App =()=>{
  
  const [manageradd, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [inputAmount, setinputAmount] = useState('');
  
  const [message, setMessage] = useState('');

  const fetchData = async ()=>{
    const manager = await Lottery.methods.manager().call();
    const players = await Lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(Lottery.options.address);


    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  };

  useEffect(()=>{
    fetchData();
  },[]);
  
  const pickWinner =async ()=>{
    const accounts = await web3.eth.getAccounts();

    setMessage('Your request is being processed...');

    await Lottery.methods.pickWinner().send(
      {
        from: accounts[0],
      }
    );
    setMessage("The winner is chosen!!!");
  };

  const submitHandler = async (event)=>{
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage('Your transaction is being processed...');

    await Lottery.methods.enter().send(
      {
        from: accounts[0],
        value: web3.utils.toWei(inputAmount, 'ether'),
      }
    );
    setMessage('Your transaction is successful!!');
  };

  return(
    <div>
      <h2>Welcome to the Lottery Contract</h2>
      <p>The address of the manager is {manageradd}</p>
      <p>The total number of players participated are {players.length}</p>
      <p>The available money in the lottery is {web3.utils.fromWei(balance,'ether')} Ether </p>

      <hr/>
        <form onSubmit={submitHandler}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={inputAmount}
              onChange={(event) => setinputAmount(c=>c=event.target.value )}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h3>Ready to pick a winner!!?</h3>
        <button onClick={pickWinner}>Pick A Winner</button>
        <hr/>
        <h1>{message}</h1>
      </div>
    
  )
};
export default App;
