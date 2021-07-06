import * as React from "react"
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

export default function App() {
    return (
        <ChakraProvider>
            <WalletConnectContextProvider options={wcOptions}>
                <Router>
                    <Flex direction="column" w="100vw" minH="100vh">
                        <Header/>
                        <Flex direction="column" flex={1} bg="#edf7ff" align="center"
                              backgroundPosition="bottom" backgroundRepeat="repeat-x">

                            <Switch>
                                <Route path="/createStream" component={CreateStream}/>
                                <Route path="/" component={Home}/>
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
