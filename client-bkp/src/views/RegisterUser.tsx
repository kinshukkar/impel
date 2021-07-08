import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {
    FormControl, FormLabel, Input, Spacer, Text, Button, Flex,
    Box, Heading, CircularProgress
} from "@chakra-ui/react";
import { EmailIcon } from '@chakra-ui/icons';
import {Link, useHistory} from "react-router-dom"
import Neon, {sc} from "@cityofzion/neon-js";
import {DEFAULT_NEO_NETWORK_MAGIC, DEFAULT_NEO_RPC_ADDRESS, DEFAULT_SC_SCRIPTHASH} from "../constants";
import SpinnerWithMessage from "../components/SpinnerWithMessage";
import {Stream} from "../types/Stream";
import ErrorMessage from "../components/errorMessage";

const RegisterUser = ({
    neoN3Data,
  }) => {

    console.log('neoN3Data in RegisterUser component---', neoN3Data);

    const history = useHistory();

    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);
    history.push({
        // pathname: '/home',
        state: { userName }
    });

    try {
      // await userLogin({ userName, password });
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      setError('Invalid username or password');
      setIsLoading(false);
      setUserName('');
    }
  };

    return (<>
        <Flex width="full" align="center" justifyContent="center">
      <Box
        p={16}
        w='100%'
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        {isLoggedIn ? (
          <Box textAlign="center">
            <Text>{userName} logged in!</Text>
            <Button
              colorScheme="purple"
              variant="solid"
              width="full"
              mt={4}
              onClick={() => setIsLoggedIn(false)}
            >
              Sign out
            </Button>
          </Box>
        ) : (
          <>
            {/* <Box textAlign="center">
              <Heading>Register User</Heading>
            </Box> */}
            <Box my={4} width="full" textAlign="left">
              <form onSubmit={handleSubmit}>
                {error && <ErrorMessage message={error} />}
                <FormControl isRequired>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter your username to register"
                    size="lg"
                    onChange={event => setUserName(event.currentTarget.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="purple" variant="solid"
                  type="submit"
                  width="full"
                  mt={4}
                >
                  {isLoading ? (
                    <CircularProgress
                      isIndeterminate
                      size="24px"
                      color="teal"
                    />
                  ) : (
                    'Register User'
                  )}
                </Button>
              </form>
            </Box>
          </>
        )}
      </Box>
    </Flex>
    </>)
};

RegisterUser.propTypes = {
    neoN3Data: PropTypes.object,
};

export default RegisterUser;
