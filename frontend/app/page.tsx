"use client"

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Wallet from "./artifacts/contracts/Wallet.sol/Wallet.json"
import { ToastError } from "./components/ToastError"

let WalletAddress = "0x76aab5A8c9373C2059d45B8E5D3129Cfb28765f4"

export default function Home() {

  const [balance, setBalance] = useState(0)
  const [amountSend, setAmountSend] = useState("")
  const [receiverAddress, setReceiverAddress] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [txStatus, setTxStatus] = useState("")
  const [txHash, setTxHash] = useState("")
  const [txReceipt, setTxReceipt] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [totalBalance, setTotalBalance] = useState(0)
  const [useCustomReceiverAddress, setUseCustomReceiverAddress] = useState(false)


  useEffect(() => {
    getBalance()
    getTotalBalance()
  }, [])

  async function getBalance() {
    if (typeof window.ethereum != "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider)
      try {
        let overrides = {
          from: accounts[0],
        }
        const data = await contract.getBalance(overrides)
        setBalance(data.toString())
      } catch (err) {
        setError(String(err).slice(0,50) + "...")
        console.log({err})
      }
    }
  }

  async function getTotalBalance() {
    if (typeof window.ethereum != "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, provider)
      try {
        let overrides = {
          from: accounts[0],
        }
        const data = await contract.getContractBalance(overrides)
        setTotalBalance(parseInt(data.toString(), 10) / 10 ** 18)
      } catch (err) {
        setError(String(err).slice(0,50) + "...")
        console.log({err})
      }
    }
  }

  async function transfer() {
    if (!amountSend) {
      return;
    }
    setError("")
    setSuccess("")
    if (typeof window.ethereum != "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer)
      try {
        const tx = {
          from: accounts[0],
          to: WalletAddress,
          value: ethers.parseEther(amountSend),
        }
        const transac = await contract.deposit({value: ethers.parseEther(amountSend)})
        await transac.wait()
        // const transaction = await signer.sendTransaction(tx)
        // await transaction.wait()
        setAmountSend("")
        getBalance()
        getTotalBalance()
        setSuccess("Transaction successful")

      } catch(err) {
        setError(String(err).slice(0,50) + "...")
        console.log({err})
      }
    }
  }

  async function withdraw() {
    if (!withdrawAmount) {
      return;
    }
    if (typeof window.ethereum != "undefined") {
      setError("")
      setSuccess("")
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(WalletAddress, Wallet.abi, signer)
      try {
        const receiver = useCustomReceiverAddress ? receiverAddress : accounts[0]
        const transac = await contract.withdraw(receiver ,ethers.parseEther(withdrawAmount))
        await transac.wait()
        setWithdrawAmount("")
        setReceiverAddress("")
        getBalance()
        getTotalBalance()
        setSuccess("Transaction successful")
      } catch (err) {
        console.log({err})
        setError(String(err).slice(0,50) + "...")
      }
    }
  }

  const changeAmountSend = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setAmountSend(e.target.value)
  }

  const changeReceiverAddress = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setReceiverAddress(e.target.value)
  }

  const changeWithdrawAmount = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(e.target.value)
  }

  const toggleReceiverSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseCustomReceiverAddress(!useCustomReceiverAddress)
    if (!useCustomReceiverAddress) {
      setReceiverAddress("")
    }
  }


  return (
  <main className="bg-gray-100 min-h-screen px-4 py-10 sm:py-16 md:px-8 lg:px-16 xl:px-24">
    <ToastError error={error} onClick={() => setError("")} />
    <h2 className="text-2xl font-bold mb-8 text-center">Total balance: {totalBalance} ETH</h2>
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg px-6 py-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Your balance: {balance / 10 ** 18} ETH</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col  justify-between items-center">
            <h3 className="text-lg font-bold mb-2 ">Send ETH</h3>
            <div className="flex items-center flex-col ">
              <input type="text" placeholder="Amount" className={`m-2 sm:m-3 w-full px-3 py-2 rounded-md border ${ isNaN(parseInt(amountSend)) && amountSend ? "border-red-500 focus:border-red-700 focus:ring focus:ring-red-200 text-red-700 " :  "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"} focus:ring-opacity-50 appearance-none`} onChange={changeAmountSend} value={amountSend}/>
              <button disabled={isNaN(parseInt(amountSend)) && amountSend != undefined} className={` ${isNaN(parseInt(amountSend)) && amountSend ? "bg-indigo-800 opacity-80" : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700" } rounded-md w-full px-4 py-2 text-white`} onClick={transfer}>Send</button>
            </div>
          </div>
          <div className="flex flex-col  justify-between items-center">
            <h3 className="text-lg font-bold mb-2 sm:mb-3">Withdraw ETH</h3>
            <div className='w-full flex flex-col items-center '>
              <div className="withdraw flex flex-col items-center space-y-3">
                <div className="sm:flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer px-3 py-3">
                    <input type="checkbox" value="" className="sr-only peer" onChange={toggleReceiverSwitch} checked={useCustomReceiverAddress} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[14px] after:left-[14px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Use custom withdraw address</span>
                  </label>
                </div>
                <input type="text" placeholder="Amount" className={`m-2 sm:m-3 w-full px-3 py-2 rounded-md border ${ isNaN(parseInt(withdrawAmount)) && withdrawAmount ? "border-red-500 focus:border-red-700 focus:ring focus:ring-red-200 text-red-700 " :  "border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200"} focus:ring-opacity-50 appearance-none`} onChange={changeWithdrawAmount} value={withdrawAmount}/>
                {useCustomReceiverAddress && <input type="text" placeholder="Receiver Address" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 appearance-none" onChange={changeReceiverAddress} value={receiverAddress}/>}
                <button disabled={isNaN(parseInt(withdrawAmount)) && withdrawAmount != undefined} className={` ${isNaN(parseInt(withdrawAmount)) && withdrawAmount ? "bg-indigo-800 opacity-80" : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700" } rounded-md w-full px-4 py-2 text-white`} onClick={withdraw}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  )
}
