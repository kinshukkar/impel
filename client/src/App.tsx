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
import Header from "./components/Header";
import PairingModal from "./components/modals/PairingModal";
import RequestModal from "./components/modals/RequestModal";
import { DEFAULT_APP_METADATA, DEFAULT_CHAIN_ID, DEFAULT_LOGGER, DEFAULT_METHODS, DEFAULT_RELAY_PROVIDER }from "./constants";

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
                                <Route path="/" render={(props) => <Home neoN3Data={neoN3Data} />}/>
                            </Switch>

                            <Flex align="center" bg="#004e87" p={["1rem", "2rem 3.25rem"]} w="100%">
                                
                            </Flex>
                        </Flex>
                    </Flex>
                    <PairingModal/>
                    <RequestModal/>
                </Router>
        </ChakraProvider>
    )
}
