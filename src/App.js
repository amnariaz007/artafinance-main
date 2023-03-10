import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard'
import { Routes, Route } from "react-router-dom";
import Calculator from './pages/Calculator/Calculator';
import Account from './pages/Account/Account';
import Referral from './pages/Referral/Referral';
import MobSidebar from './components/MobSidebar/MobSidebar';
import TokenAbi from './abis/AXN.json';
import erc20Abi from './abis/ERC20.json';
import { ethers } from 'ethers';
import axios from 'axios'
import Loading from './components/Loading';


const _TOKEN_ADDRESS = "0x018aA455F231E76580cB234cA8D8FbF383784061";
const WBNB_TOKEN_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";

function App() {
  const [mobMenu, setmobMenu] = useState(false)
  // const [Modal, setModal] = useState(false)
  const handlerSetmonMenu = () => {
    setmobMenu(!mobMenu)
  }

  const [init, setInit] = useState(false);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [GIFVal, setGIFVal] = useState(0);
  const [firePitBalance, setFirePitBalance] = useState(0);
  const [poolBalance, setPoolBalance] = useState(0);

  const [interval, setIntervalSec] = useState(15 * 60);
  const [remainTime, setRemainTime] = useState(0);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");


  const [walletBalance, setWalletBalance] = useState(0);
  // const [rebaseDuration, setRebaseDuration] = useState(1800);
  // const [nextRewardAmount, setNextRewardAmount] = useState();
  // const [nextRewardYield, setNextRewardYield] = useState();
  // const [roi, setRoi] = useState();

  const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');
  const  TokenContract = new ethers.Contract( _TOKEN_ADDRESS,  TokenAbi, provider);

  const handlerSetModal = () => {
    // event.preventDefault()
    console.log('clicked');
    // setModal(!Modal)
  }

  useEffect(() => {
    const interval = setInterval(refreshPage, 10000);
    return () => clearInterval(interval);
  }, []);

  // event on initialize page.
  useEffect(() => {
    if (!init) {
      refreshPage();
    }
    // return () => clearInterval(interval);
  }, [init]);

  useEffect(() => {
    getWalletInfo(account,  TokenContract);
  }, [account]);



  async function refreshPage() {
    try {
      // let stTime = new Date().getTime();
      const lRTime = await  TokenContract._lastRebasedTime();
      const utcTimestamp = new Date().getTime();
      const deltaTime = parseInt(utcTimestamp / 1000) - parseInt(lRTime);
      const remainTime = interval - deltaTime % interval;
      setRemainTime(remainTime);
      setInit(true);
      // let endTime = new Date().getTime();
      // console.log("time to remainTime: ", (endTime-stTime)/1000);


      // stTime = new Date().getTime();
      const tokenPrice = await getTokenPriceByPair( TokenContract, provider);

      // endTime = new Date().getTime();
      // console.log("time to price: ", (endTime-stTime)/1000);

      // stTime = new Date().getTime();
      const totalSupply = await  TokenContract.totalSupply();
      // endTime = new Date().getTime();
      // console.log("time to totalSupply: ", (endTime-stTime)/1000);

      setTotalSupply(ethers.utils.formatUnits(totalSupply, 5))// * tokenPrice).toFixed(2));

      // stTime = new Date().getTime();
      const circulatingSupply = await  TokenContract.getCirculatingSupply()
      // endTime = new Date().getTime();
      // console.log("time to circulatingSupply: ", (endTime-stTime)/1000);

      setCirculatingSupply(ethers.utils.formatUnits(circulatingSupply, 5))// * tokenPrice).toFixed(2));

      // stTime = new Date().getTime();
      const balances = await getBalancesInfo( TokenContract);
      // endTime = new Date().getTime();
      // console.log("time to balances: ", (endTime-stTime)/1000);
      if(account){
        await getWalletInfo(account,  TokenContract);
      }

    }
    catch (err) {
      console.log("Refresh page. error! (%s)", err.message);
    }
  }

  async function getTokenPriceByPair( Token, provider) {
    try {

      const pairAddr = await  Token.pair();
      const poolBalance = await  Token.balanceOf(pairAddr);
      const wbnbContract = new ethers.Contract(WBNB_TOKEN_ADDRESS, erc20Abi, provider);
      const bnbInPool = await wbnbContract.balanceOf(pairAddr);
      const pB = parseFloat(ethers.utils.formatUnits(poolBalance, 5));
      const derivedBNB = pB?(parseFloat(ethers.utils.formatEther(bnbInPool)) / pB):0.0;
      console.log("derivedBNB:", derivedBNB);

      const bnbPrice = await getBNBPrice();
      // console.log("bnbPrice:", bnbPrice);
      const price = parseFloat(bnbPrice) * derivedBNB
      setTokenPrice(price);
      // console.log("[ ] :: Price of   = %s $", price);
      return price;
    } catch (err) {
      console.log("[ ] Getting price of token error!");
      return 0;
    }
  }

  const getBNBPrice = async () => {
    const url = 'https://deep-index.moralis.io/api/v2/erc20/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/price?chain=bsc';
    const resp = await axios.get(url,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          "X-API-Key": "YEEwMh0B4VRg6Hu5gFQcKxqinJ7UizRza1JpbkyMgNTfj4jUkSaZVajOxLNabvnt"
        }
      }
    );

    // console.log("Price get result:",resp);
    return resp.data.usdPrice;
  }

  async function getWalletInfo(account,  Token) {
    if (!account) {
      setWalletBalance(0);
      return 0;
    }
    try {
      const tokenBalance = await  Token.balanceOf(account);
      const balance = ethers.utils.formatUnits(tokenBalance, 5);
      setWalletBalance(balance.toString());
      return balance;
    } catch (err) {
      console.log("[ ] Getting wallet balance error! (%s)", err.message);
    }
    return 0;
  }

  async function getBalancesInfo( Token) {
    if (typeof  Token === "undefined") {
      return 0;
    }
    try {
      const treasuryAddr = await  Token.treasuryReceiver();
      const GIFAddr = await  Token.genInsuranceFundReceiver();
      const firePitAddr = await  Token.firePit();
      const poolAddr = await  Token.pair();

      const treasuryBalance = await  Token.balanceOf(treasuryAddr)

      const firePitBalance = await  Token.balanceOf(firePitAddr)
      const poolBalance = await  Token.balanceOf(poolAddr)

      const bnbInGIF = await provider.getBalance(GIFAddr);
      // console.log("bnbInGIF", bnbInGIF.toNumber());
      const bnbPrice = await getBNBPrice();
      setTreasuryBalance(ethers.utils.formatUnits(treasuryBalance, 5))
      setGIFVal(parseFloat(ethers.utils.formatUnits(bnbInGIF, 18))*parseFloat(bnbPrice))
      setFirePitBalance(ethers.utils.formatUnits(firePitBalance, 5))
      setPoolBalance(ethers.utils.formatUnits(poolBalance, 5))

      return 1;
    } catch (err) {
      console.log("[ ] Getting wallet balance error! (%s)", err.message);
    }
    return 0;
  }

  return (
    <>
      <Routes>
        <Route path="/" exact element={init ?
          <Dashboard
            setmobMenu={handlerSetmonMenu}
            setModal={handlerSetModal}
            account={account}
            setAccount={setAccount}
            chainId={chainId}
            setChainId={setChainId}
            tokenPrice={tokenPrice}
            totalSupply={totalSupply}
            circulatingSupply={circulatingSupply}
            treasuryBalance={treasuryBalance}
            GIFVal={GIFVal}
            poolBalance={poolBalance}
            firePitBalance={firePitBalance}
            interval={interval}
            remainTime={remainTime}
            setRemainTime={setRemainTime}
            setInit={setInit}
          /> : <Loading />}
        />
        <Route path="/account" exact element={init ?
          <Account setmobMenu={handlerSetmonMenu} setModal={handlerSetModal} account={account}
            setAccount={setAccount} chainId={chainId} setChainId={setChainId} tokenPrice={tokenPrice} balance={walletBalance} interval={interval} remainTime={remainTime}
            setInit={setInit}
          /> : <Loading />}
        />
        <Route path="/calculator" exact element={init ?
          <Calculator setmobMenu={handlerSetmonMenu} setModal={handlerSetModal} account={account}
            setAccount={setAccount} chainId={chainId} setChainId={setChainId} tokenPrice={tokenPrice} balance={walletBalance} interval={interval}
          /> : <Loading />}
        />
        <Route path="/referral" exact element={init ?
          <Referral setmobMenu={handlerSetmonMenu} setModal={handlerSetModal} account={account}
            setAccount={setAccount} chainId={chainId} setChainId={setChainId} tokenPrice={tokenPrice} balance={walletBalance} interval={interval}
          /> : <Loading />}
        />
      </Routes>
      <MobSidebar mobMenu={mobMenu} setmobMenu={handlerSetmonMenu} />
    </>
  );
}

export default App;
