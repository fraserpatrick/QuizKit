import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "@/hooks/useSounds";
import { AntDesign } from "@expo/vector-icons";
import { PrimaryColour, SecondaryColour } from "@/components/SelectedStyles";

type AntIconName = React.ComponentProps<typeof AntDesign>["name"];

interface ButtonProps {
    label: string;
    onPress: () => void;
    icon?: AntIconName;
}

const iconItem = (iconName: AntIconName) => {
    return (
        <AntDesign
            name={iconName}
            size={24}
            color="#ffffff"
        />
    );
}

const headerItem = (iconName: AntIconName) => {
    return (
        <AntDesign
            name={iconName}
            size={20}
            color="#ffffff"
        />
    );
}

export const PrimaryButton: React.FC<ButtonProps>= ({label, onPress}) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const PrimaryButtonWithIcon: React.FC<ButtonProps> = ({label, onPress, icon}) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.button}>
                    {icon && iconItem(icon)}
                    <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const PrimaryButtonWithIconRight: React.FC<ButtonProps> = ({label, onPress, icon}) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
                {icon && iconItem(icon)}
            </View>
        </TouchableOpacity>
    );
};

export const HeaderButton: React.FC<ButtonProps> = ({label, onPress, icon}) => {
    const { playClick } = useSounds();
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={[styles.button, styles.headerButton]}>
                {icon && headerItem(icon)}
                <Text style={styles.headerButtonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    button:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PrimaryColour,
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 4,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
    headerButton: {
        backgroundColor: SecondaryColour,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginHorizontal: 5
    },
    headerButtonText: {
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 16,
    }
});
