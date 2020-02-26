import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Text } from 'react-native'
import styled from 'styled-components'

const SpinnerContainer = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    position: absolute;
`;

const Spinner = ({ animate = false, loadingMessage, color, onPress }) => {
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        setMessage(loadingMessage);
    }, [loadingMessage])

    return (animate &&
        <SpinnerContainer onPress={onPress}>
            <ActivityIndicator animating={animate} color={'#fff'} size={'large'} />
            <Text style={{ color: '#fff', marginTop: 5 }}>{message}</Text>
        </SpinnerContainer>
    )
}

export default Spinner
