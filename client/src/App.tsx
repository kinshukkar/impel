import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom"
import { Provider } from 'react-redux';
import {
    ChakraProvider, Flex
} from "@chakra-ui/react"
import Header from "./components/Header";
import { DEFAULT_APP_METADATA, DEFAULT_CHAIN_ID, DEFAULT_LOGGER, DEFAULT_METHODS, DEFAULT_RELAY_PROVIDER }from "./constants";
import Home from "./views/Home"
import ConnectWallet from "./views/ConnectWallet";
import RegisterUser from "./views/RegisterUser";

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
        });
    },[neoN3Data]);

    return (
        <ChakraProvider>
                <Router>
                    <Flex direction="column" w="100vw" minH="100vh">
                        <Header/>
                        <Flex direction="column" flex={1} bg="#edf7ff" align="center"
                              backgroundPosition="bottom" backgroundRepeat="repeat-x">

                            <Switch>
                                <Route path="/" exact render={(props) => <ConnectWallet neoN3Data={neoN3Data} />}/>
                                <Route path="/connectToWallet" render={(props) => <ConnectWallet neoN3Data={neoN3Data} />}/>
                                <Route path="/registerUser" render={(props) => <RegisterUser neoN3Data={neoN3Data} />}/>
                                <Route path="/home" render={(props) => <Home neoN3Data={neoN3Data} />}/>
                                <Redirect
                                    to={{ pathname: '/' }}
                                />
                            </Switch>

                            <Flex align="center" bg="transparent" p={["1rem", "2rem 3.25rem"]} w="100%">
                                
                            </Flex>
                        </Flex>
                    </Flex>
                </Router>
        </ChakraProvider>
    )
}
