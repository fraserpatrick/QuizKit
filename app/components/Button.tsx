import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "../hooks/useSounds";
import { AntDesign } from "@expo/vector-icons";

const { playClick } = useSounds();

interface ButtonProps {
    label: string;
    onPress: () => void;
    icon?: string;
}

export const PrimaryButton: React.FC<ButtonProps>= ({label, onPress}) => {
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const PrimaryButtonWithIcon: React.FC<ButtonProps> = ({label, onPress, icon}) => {
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.button}>
                <AntDesign
                    name={icon}
                    size={24}
                    color="#ffffff"
                />
                <Text style={styles.buttonText}>{label}</Text>
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
