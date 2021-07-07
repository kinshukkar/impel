import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {Box, Flex, HStack, Spacer, Text, Button} from "@chakra-ui/react";
import { EmailIcon } from '@chakra-ui/icons';
import {Link, useHistory} from "react-router-dom"
import Neon, {sc} from "@cityofzion/neon-js";
import {DEFAULT_NEO_NETWORK_MAGIC, DEFAULT_NEO_RPC_ADDRESS, DEFAULT_SC_SCRIPTHASH} from "../constants";
import SpinnerWithMessage from "../components/SpinnerWithMessage";
import {Stream} from "../types/Stream";

const ConnectWallet = ({
    neoN3Data,
  }) => {
    const history = useHistory();
    const [loadingMyStreams, setLoadingMyStreams] = useState(false)

    console.log('neoN3Data in ConnectWallet component---', neoN3Data);

    const handleLogin = () => {
        history.push('/registerUser');
    }

    return (<>
        <Spacer/>
        <Text maxW="44rem" color="#004e87" fontSize={["1.4rem", "2rem"]} textAlign="center" m="0.5rem" my="1rem">
            Welcome to Impel
        </Text>
        <Button leftIcon={<EmailIcon />} colorScheme="purple" variant="solid" size="lg" onClick={handleLogin}>
            Login
        </Button>
        <Spacer/>
    </>)
};

ConnectWallet.propTypes = {
    neoN3Data: PropTypes.object,
};

export default ConnectWallet;
