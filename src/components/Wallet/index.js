import { useEffect, useState } from "react";
import { networkParams } from "./networks";
import { toHex, truncateAddress } from "../../utils/addressUtils";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { providerOptions } from "./providerOptions";

const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions // required
});

export default function Wallet(props) {
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();
  const [account, setAccount] = useState(props.account);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState(props.chainId);
  const [network, setNetwork] = useState();
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (error) {
      setError(error);
    }
  };

  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  //   const handleInput = (e) => {
  //     const msg = e.target.value;
  //     setMessage(msg);
  //   };

  // const switchNetwork = async () => {
  //   const toNetworkId = 56;
  //   try {
  //     await library.provider.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: toHex(toNetworkId) }]
  //     });
  //     setChainId(toNetworkId);

  //   } catch (switchError) {
  //     if (switchError.code === 4902) {
  //       try {
  //         await library.provider.request({
  //           method: "wallet_addEthereumChain",
  //           params: [networkParams[toHex(toNetworkId)]]
  //         });
  //       } catch (error) {
  //         setError(error);
  //       }
  //     }
  //   }
  // };

  //   const signMessage = async () => {
  //     if (!library) return;
  //     try {
  //       const signature = await library.provider.request({
  //         method: "personal_sign",
  //         params: [message, account]
  //       });
  //       setSignedMessage(message);
  //       setSignature(signature);
  //     } catch (error) {
  //       setError(error);
  //     }
  //   };

  //   const verifyMessage = async () => {
  //     if (!library) return;
  //     try {
  //       const verify = await library.provider.request({
  //         method: "personal_ecRecover",
  //         params: [signedMessage, signature]
  //       });
  //       setVerified(verify === account.toLowerCase());
  //     } catch (error) {
  //       setError(error);
  //     }
  //   };

  const refreshState = () => {
    setAccount();
    setChainId();
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = async () => {
    web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    props.setAccount(account);
  }, [account]);

  useEffect(() => {
    props.setChainId(chainId);
  }, [chainId]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };

      const handleChainChanged = (_hexChainId) => {
        setChainId(_hexChainId);
        console.log("Chain:",chainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  return (
    <div>
      {!account ? (
        <a onClick={connectWallet}>Connect Wallet</a>
      ) : (
       // chainId===0x56?
        <a onClick={disconnect}>Disconnect</a>
      //  <a onClick={switchNetwork}>Wrong Network</a>
      )}

    </div>
  );
}
