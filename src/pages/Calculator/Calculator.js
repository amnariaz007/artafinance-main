import React, { useState, useMemo, useCallback, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import MenuIcon from "../../assets/images/menu.svg";
import "./calculator.css";
import Slider from "../../components/Slider/Slider";
import Wallet from "../../components/Wallet";
import { numberWithCommas } from '../../utils/numberUtils.ts';



const Calculator = ({ setmobMenu, setModal, account, setAccount, ...props }) => {

	let {chainId, setChainId, tokenPrice, balance, interval, setInit } = props;
	tokenPrice = parseFloat(tokenPrice).toFixed(3)
	balance = parseFloat(balance).toFixed(3)
	const rate = 1.00025;
	const currentApy = (100*(rate**(365*24*3600/interval)-1)).toFixed(3);
	const [parentVal, setParentVal] = useState(30);

	const sliderValueChanged = useCallback(val => {
		// console.log("NEW VALUE", val);
		setParentVal(val);
	});

	const sliderProps = useMemo(
		() => ({
			min: 1,
			max: 365,
			value: parentVal,
			step: 0,
			label: "",
			onChange: e => sliderValueChanged(e)
		}),
		[parentVal]
	);

	const [amount, setAmount] = useState(0);
	const [apy, setAPY] = useState(currentApy);
	const [price1, setPrice1] = useState(tokenPrice);
	const [price2, setPrice2] = useState(tokenPrice);

	const handleAmountChange = useCallback(e => {
		setAmount(e.target.value);
	});

	const handleAmountMax = useCallback(e => {
		setAmount(balance);
	});

	const handleAPYChange = useCallback(e => {
		setAPY(e.target.value);
	});

	const handleAPYCurrent = useCallback(e => {
		setAPY(currentApy);
	});

	const handlePrice1Change = useCallback(e => {
		setPrice1(e.target.value);
	});

	const handlePrice1Current = useCallback(e => {
		setPrice1(tokenPrice);
	});

	const handlePrice2Change = useCallback(e => {
		setPrice2(e.target.value);
	});

	const handlePrice2Current = useCallback(e => {
		setPrice2(tokenPrice);
	});

	const [initialInvest, setInitialInvest] = useState(0);
	const [currentWealth, setCurrentWealth] = useState(0);
	const [rewardsEstimation, setRewardsEstimation] = useState(0);
	const [potentialReturn, setPotentialReturn] = useState(0);

	useEffect(() => {
		setInitialInvest((amount*price1).toFixed(3));
		setCurrentWealth((amount*tokenPrice).toFixed(3));
		let rewards = 0;
		if (apy>=100){
			rewards = (((apy/100)**(parentVal/365)-1)*amount).toFixed(3);
		}

		setRewardsEstimation(rewards);
		setPotentialReturn((rewards*price2).toFixed(3));
	  }, [amount, apy, price1, price2, parentVal]);

	return (
		<>
			<div className="root-container">
				<div className="sidebar">
					<Sidebar account={account}/>
				</div>
				<div className="main-container">
					<div className="topbar">
						<div className="connect-wallet-btn">
							<img src={MenuIcon} className="icon-mob" alt="logo" onClick={setmobMenu} />
							<h2><i></i></h2>
							<ul>
								<li className="menu__icon" onClick={setmobMenu}><img src={MenuIcon} className="icon-tab" alt="menu Icon" /></li>
								{/* <li><a >ARTA</a>
									<ul className="dropdown">
										<li>
										<a href="https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0xeDAAaA986bcb588025Cd16C548f5F769Bb32A00B" target="_blank">Buy on PancakeSwap</a>
										</li>
									</ul>
								</li> */}
								<li><Wallet account={account} setAccount={setAccount} chainId= {chainId} setChainId = {setChainId}/></li>
							</ul>
						</div>
					</div>
					<div className="main-container-area">
						<div className="calc-container">
							<div className="calc-heading">
								<h2>Calculator</h2>
								<span>Estimate your returns</span>
							</div>
							<div className="calc-price-container">
								<div className="calc-price-wrap">
									<h3 className="color-white">ARTA Price</h3>
									<h2>${numberWithCommas(tokenPrice)}</h2>
								</div>
								<div className="calc-price-wrap">
									<h3 className="color-white">Current APY</h3>
									<h2>{numberWithCommas(currentApy)}%</h2>
								</div>
								<div className="calc-price-wrap mob-mt">
									<h3 className="color-white">Your ARTA Balance</h3>
									<h2>{numberWithCommas(balance)} ARTA</h2>
								</div>
							</div>
							<div className="calc-grid-container">
								<div className="field-wrap">
									<span>ARTA Amount</span>
									<div className="field">
										<input type="number" name="amount" id="amount" value={amount} placeholder="Amount" onChange={handleAmountChange}/>
										<span onClick={handleAmountMax}>Max</span>
									</div>
								</div>
								<div className="field-wrap">
									<span>APY (%)</span>
									<div className="field">
										<input type="number" name="apy" id="apy" value={apy} placeholder="APY" onChange={handleAPYChange} />
										<span onClick={handleAPYCurrent}>Current</span>
									</div>
								</div>
								<div className="field-wrap">
									<span>ARTA price at purchase ($)</span>
									<div className="field">
										<input type="number" name="price1" id="price1" value={price1} placeholder="Price" onChange={handlePrice1Change} />
										<span onClick={handlePrice1Current}>Current</span>
									</div>
								</div>
								<div className="field-wrap">
									<span>Future ARTA market price ($)</span>
									<div className="field">
										<input type="number" name="price2" id="price2" value={price2} placeholder="Price" onChange={handlePrice2Change}/>
										<span onClick={handlePrice2Current}>Current</span>
									</div>
								</div>
							</div>
							<Slider {...sliderProps} classes="additional-css-classes" />
							{/* <Slider/> */}
							<div className="calc-matrix color-white">
								<div className="data">
									<p>Your initial investment</p>
									<span>${initialInvest}</span>
								</div>
								<div className="data">
									<p>Current wealth</p>
									<span>${currentWealth}</span>
								</div>
								<div className="data">
									<p>ARTA rewards estimation</p>
									<span>{rewardsEstimation} ARTA</span>
								</div>
								<div className="data">
									<p>Potential return</p>
									<span>${potentialReturn}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Calculator;
