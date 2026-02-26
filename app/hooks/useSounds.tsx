import { notificationPlayer, clickPlayer, fanfarePlayer } from "@/app/utils/audioManager";

export const useSounds = () => {
    const playNotification = () => {
        notificationPlayer.seekTo(0);
        notificationPlayer.play();
    };
    const playClick = () => {
        clickPlayer.seekTo(0);
        clickPlayer.play();
    };
    const playFanfare = () => {
        fanfarePlayer.seekTo(0);
        fanfarePlayer.play();
    };

    return {
        playNotification,
        playClick,
        playFanfare
    };
};