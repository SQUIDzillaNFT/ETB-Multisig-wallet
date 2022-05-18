import React, { useEffect, useState } from 'react';
import { getWeb3, getWattet } from './utils.js';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccoutns] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
    };
    init();
  }, []);

  if(
    typeof web3 === 'undefined'
    || typeof accounts === 'undefined'
    || typeof wallet === 'undefined'
  ) {
    return <div> Loading...</div>
  }
  
  return (
    <div>
      multisig
    </div>
  );
}

export default App;
