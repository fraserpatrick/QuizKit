import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useSounds } from "../hooks/useSounds";

const { playClick } = useSounds();

interface ButtonProps {
    label: string;
    onPress: () => void;
}

const PrimaryButton: React.FC<ButtonProps>= ({label, onPress}) => {
    return (
        <TouchableOpacity onPress={() => { playClick(); onPress(); }}>
            <View style={styles.button}>
                <Text style={styles.buttonText}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default PrimaryButton;

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        backgroundColor: '#7a7a7aff',
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
