import React from "react";
import MenuIcon from "../../assets/images/menu.svg";
import "./referral.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Wallet from "../../components/Wallet";
import CountDown from '../../components/CountDown';
import {numberWithCommas} from '../../utils/numberUtils.ts';


const Referral = ({setmobMenu, setModal, account, setAccount, ...props}) => {

	let {chainId, setChainId} = props;

	return (
		<>
			<div className="root-container">
				<div className= "sidebar">
					<Sidebar account={account}/>
				</div>
				<div className="main-container">
					<div className="topbar">
						<div className="connect-wallet-btn">
							<img src={MenuIcon} className="icon-mob" alt="logo" onClick={setmobMenu} />
							<h2><i></i></h2>
							<ul>
								<li className="menu__icon" onClick={setmobMenu}><img src={MenuIcon} className="icon-tab" alt="menu Icon" /></li>
								{/* <li><a >AXN</a>
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
                        <div className="referral-container">
                            <div className="ref-wrap">
                                <div className="ref-data">
                                    <p>Your total referrals</p>
                                    <h3>0 users</h3>
                                </div>
                                <div className="ref-data">
                                    <p>Your AXN referral reward</p>
                                    <h3>0 AXN <span>(0$)</span></h3>
                                </div>
                                <div className="ref-data">
                                    <p>Your BUSD referral reward</p>
                                    <h3>0 BUSD</h3>
                                </div>
                                <div className="ref-data">
                                    <p>Pending AXN reward</p>
                                    <h3>0 AXN <span>(0$)</span></h3>
                                </div>
                                <div className="ref-data">
                                    <p>Pending $BUSD reward</p>
                                    <h3>0 BUSD</h3>
                                </div>
                                <button>Claim Referral Rewards</button>
                            </div>
                            <div className="ref-link-wrap">
                                <h3>Your referral link</h3>
                                <div className="ref-inp-wrap">
                                    <input type="text" name="refid" id="refid" value='https://arta.finance/?ref=' />
                                    <button>Copy</button>
                                </div>
                                <ul className="instruction-points">
                                    <li>1. send your referral link to your friends</li>
                                    <li>2. When they claim their AXN or BUSD rewards by holding xAXN you will receive bonus <br /> .....</li>
                                </ul>
                                <div className="level-wrap">
                                  <p>Earning AXN by Levels</p>
                                  <ul>
                                      <li><p className="level"> Lv1: <span>5%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv2: <span>2.5%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv3: <span>1%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv4: <span>1%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv5: <span>0.5%</span></p><p>0</p></li>
                                  </ul>
                                </div>
                                <div className="level-wrap">
                                  <p>Earning $BUSD by Levels</p>
                                  <ul>
                                      <li><p className="level"> Lv1: <span>5%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv2: <span>2.5%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv3: <span>1%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv4: <span>1%</span></p><p>0</p></li>
                                      <li><p className="level"> Lv5: <span>0.5%</span></p><p>0</p></li>
                                  </ul>
                                </div>
                            </div>
                        </div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Referral;
