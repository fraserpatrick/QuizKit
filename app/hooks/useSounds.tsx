import { useEffect, useRef } from 'react';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';

export const useSounds = () => {
    const notification = useRef<AudioPlayer | null>(null);
    const click = useRef<AudioPlayer | null>(null);
    const fanfare = useRef<AudioPlayer | null>(null);

    useEffect(() => {
        notification.current = createAudioPlayer(
            require('../../assets/sounds/notification.mp3')
        );
        click.current = createAudioPlayer(
            require('../../assets/sounds/mouse-click.mp3')
        );

        click.current.volume = 0.1;
        fanfare.current = createAudioPlayer(
            require('../../assets/sounds/success-fanfare.mp3')
        );
    }, []);

    const playNotification = () => {
        notification.current?.seekTo(0);
        notification.current?.play();
    };
    const playClick = () => {
        click.current?.seekTo(0);
        click.current?.play();
    };
    const playFanfare = () => {
        fanfare.current?.seekTo(0);
        fanfare.current?.play();
    };

    return {
        playNotification,
        playClick,
        playFanfare
    };
};