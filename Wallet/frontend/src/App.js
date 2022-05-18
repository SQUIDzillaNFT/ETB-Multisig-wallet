import React, { useEffect, useState } from 'react';
import { getWeb3, getWattet } from './utils.js';
import './App.css';
import Header from './Header.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccoutns] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState('undefined');
  const [quorum, setQuorum] = useState('undefined');

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.getQuorum().call();
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
    };
    init();
  }, []);

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof wallet === 'undefined'
    || typeof approvers === 'undefined'
    || typeof quorum === 'undefined'
  ) {
    return <div> Loading...</div>
  }
  
  return (
    <div>
      multisig
      <Header approvers={approvers} quorum={quorum} />
    </div>
  );
}

export default App;
