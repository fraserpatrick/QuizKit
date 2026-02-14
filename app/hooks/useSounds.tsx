import { useEffect, useRef } from 'react';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';

export const useSounds = () => {
    const notification = useRef<AudioPlayer | null>(null);

    useEffect(() => {
        notification.current = createAudioPlayer(
            require('../../assets/sounds/notification.mp3')
        );
    }, []);

    const playNotification = () => {
        notification.current?.seekTo(0);
        notification.current?.play();
    };
    return {
        playNotification
    };
};