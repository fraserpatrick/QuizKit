import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "@/hooks/useSounds";
import { AntDesign } from "@expo/vector-icons";

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

export default PrimaryButtonWithIcon;

const styles = StyleSheet.create({
    button:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007BFF',
        borderRadius: 10,
        marginTop: 4,
        marginBottom: 4,
        borderWidth: 2,
    },
    buttonText:{
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 20,
    },
});
