
import React, { Component } from "react";
import Mem from "./contracts/meme.json";
import getWeb3 from "./getWeb3";
//import {create} from "ipfs-http-client";
//import * as IPFS from 'ipfs-core'
import "./App.css";

//const ipfs = create('https://ipfs.infura.io:5001')
//const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
//const ipfs = IPFS.create()
var val,id=0;
class App extends Component {
  state = { hash:'',buffer:null,web3:false,images:[],author:[],account:"address of account."};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      this.setState({account:this.accounts[0]});
      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = Mem.networks[this.networkId];
      this.contract= new this.web3.eth.Contract(
        Mem.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({web3:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  run=async (event) => {
   event.preventDefault()

   const file=event.target.files[0];

   const reader =new window.FileReader()
  reader.readAsArrayBuffer(file)
  console.log(reader.result);
  reader.onloadend=()=>{
  this.setState({buffer:Buffer(reader.result)})
  console.log(this.state.buffer);
}
    
  };

    descr=async (e)=>{
    val=e.target.value;
  
    }

    done= async (event)=>{ event.preventDefault()

   console.log("Submitting file to ipfs...")
   const result=  await ipfs.add(this.state.buffer)
   console.log(result[0].hash);
   await this.contract.methods.upload(result[0].hash,val).send({ from: this.accounts[0],gasPrice: '20000000000' })
   this.setState({ hash: result[0].hash})
       
   const ig=   await this.contract.methods.images(id).call({ from: this.accounts[0]})
   this.setState({images:[...this.state.images,result[0].hash]})
   this.setState({author:[...this.state.author,ig]})
   
   id++;
    console.log(this.state.author);
    console.log(id);
    

 
    }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <nav className="nav">
        <h1>Picture of the day </h1>
        <p>{this.state.account}</p>
       </nav>
       <h2>Upload picture</h2>
       
       <form onSubmit={this.done} className >
       <input type='file'  accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.run} />
      <p> &nbsp;</p>
      <p> &nbsp;</p>
       <input type="text"   onChange={this.descr} placeholder="Image description..." />
       <input type="submit" />Upload!
       <p> &nbsp;</p>
        <p> &nbsp;</p>
   <ul>
   {this.state.author.map((im,key)=>{
     return(
     <><li><img src={`https://ipfs.infura.io/ipfs/${im.hash}`} style={{ maxWidth: '420px'}}/> 
     <p className="descrip">{im.description}</p></li>
     </>)
       })
    }
   </ul>
    


    
       </form>
      </div>
    );
  }
}

export default App;
