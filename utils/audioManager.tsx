import { createAudioPlayer } from "expo-audio";

export const notificationPlayer = createAudioPlayer(
    require("@/assets/sounds/notification.mp3")
);

export const clickPlayer = createAudioPlayer(
    require("@/assets/sounds/mouse-click.mp3")
);

export const fanfarePlayer = createAudioPlayer(
    require("@/assets/sounds/success-fanfare.mp3")
);

clickPlayer.volume = 0.1;
//creates players for each sound effect