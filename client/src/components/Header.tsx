import * as React from "react";
import {Flex, Image, Link, Spacer, Spinner, Text, useToast} from "@chakra-ui/react";
import {matchPath, useLocation, Link as RLink} from "react-router-dom";
import CopyIcon from "./icons/CopyIcon";
import copy from "clipboard-copy";
import {useEffect, useState} from "react";
import LogoutIcon from "./icons/LogoutIcon";

const chainMeta = {
    name: 'Neo3',
    logo: '',
}

export default function Header() {
    let location = useLocation()
    const toast = useToast()
    const [id, setId] = useState<string | undefined>(undefined)

    useEffect(() => {
        const path = matchPath<{ id: string | undefined }>(location.pathname, {path: '/stream/:id'})
        setId(path?.params.id)
    }, [location])

    const copyUrl = () => {
        copy(window.location.href)

        toast({
            title: "URL copied to clipboard",
            status: "success",
            duration: 2000,
            isClosable: true,
        })
    }

    const ellipseAddress = (address = "", width = 10) => {
        return `${address.slice(0, width)}...${address.slice(-width)}`;
    }

    return (
        <Flex align="center" borderBottom="1px" borderColor="#BFD7EB" h={["3.5rem", "6rem"]} px={["1rem", "3rem"]}>
            <RLink to="/">
                <Flex direction="row">
                    <Image src="/impel.svg" alt="Impel" h={["2rem", "3rem"]} />
                    <Text alignSelf="center" fontSize="1.5rem">Impel</Text>
                </Flex>
            </RLink>
            <Spacer/>
        </Flex>
    );
}
