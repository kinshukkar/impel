import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom"
import {
    ChakraProvider, Flex
} from "@chakra-ui/react"
import Home from "./views/Home"
import {WalletConnectContextProvider} from "@cityofzion/wallet-connect-sdk-react";
import Header from "./components/Header";
import CreateStream from "./views/CreateStream";
import PairingModal from "./components/modals/PairingModal";
import RequestModal from "./components/modals/RequestModal";
import { DEFAULT_APP_METADATA, DEFAULT_CHAIN_ID, DEFAULT_LOGGER, DEFAULT_METHODS, DEFAULT_RELAY_PROVIDER }from "./constants";

const wcOptions = {
    appMetadata: DEFAULT_APP_METADATA,
    chainId: DEFAULT_CHAIN_ID,
    logger: DEFAULT_LOGGER,
    methods: DEFAULT_METHODS,
    relayServer: DEFAULT_RELAY_PROVIDER
}
declare var NEOLineN3: any;

export default function App() {

    const [neoN3Data, setNeoN3Data] = useState({});

    const setN3Data = (data: any) => {
        setNeoN3Data(data);
    }

    useEffect(() => {
        window.addEventListener('NEOLine.N3.EVENT.READY', () => {
            const n3 = new NEOLineN3.Init();
            setN3Data(n3);
            // n3.pickAddress()
            // .then(result => {
            //     const { label, address } = result;
            //     console.log('label:' + label);
            //     console.log('address' + address);
            //     setN3Data({...neoN3Data, ...{ label, address }});

            //     n3.AddressToScriptHash({ address: address })
            //     .then(result => {
            //         const { scriptHash } = result;
            //         console.log('scriptHash' + scriptHash);
            //     });
            //     // .catch(({type: String, description: String, data: any}) => {
            //     //     switch(type) {
            //     //         case 'NO_PROVIDER':
            //     //             console.log('No provider available.');
            //     //             break;
            //     //         case 'MALFORMED_INPUT':
            //     //             console.log('Please check your input');
            //     //             break;
            //     //     }
            //     // });

            // });

            // n3.getProvider()
            // .then(provider => {
            //     const {
            //         name,
            //         website,
            //         version,
            //         compatibility,
            //         extra
            //     } = provider;

            //     setN3Data({ ...neoN3Data, ...{
            //         name,
            //         website,
            //         version,
            //         compatibility,
            //         extra
            //     }});
            
            //     console.log('Provider name: ' + name);
            //     console.log('Provider website: ' + website);
            //     console.log('Provider dAPI version: ' + version);
            //     console.log('Provider dAPI compatibility: ' + JSON.stringify(compatibility));
            //     console.log('Extra provider specific atributes: ' + JSON.stringify(compatibility));
            // })
        });
    },[neoN3Data]);

    return (
        <ChakraProvider>
            <WalletConnectContextProvider options={wcOptions}>
                <Router>
                    <Flex direction="column" w="100vw" minH="100vh">
                        <Header/>
                        <Flex direction="column" flex={1} bg="#edf7ff" align="center"
                              backgroundPosition="bottom" backgroundRepeat="repeat-x">

                            <Switch>
                                <Route path="/createStream" render={(props) => <CreateStream neoN3Data={neoN3Data} />}/>
                                <Route path="/" render={(props) => <Home neoN3Data={neoN3Data} />}/>
                            </Switch>

                            <Flex align="center" bg="#004e87" p={["1rem", "2rem 3.25rem"]} w="100%">
                                
                            </Flex>
                        </Flex>
                    </Flex>
                    <PairingModal/>
                    <RequestModal/>
                </Router>
            </WalletConnectContextProvider>
        </ChakraProvider>
    )
}
