import { Modal, TouchableWithoutFeedback, Keyboard, View, Pressable, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";

interface BaseModalProps {
    visible: boolean;
    titleText: string;
    infoText: string;
    cancelText: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => void;
    confirmButtonStyle?: StyleProp<ViewStyle>;
}

export const BaseModal: React.FC<BaseModalProps> = ({visible, titleText, infoText, cancelText, confirmText, onClose, onConfirm, confirmButtonStyle}) => {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable
                    style={StyleSheet.absoluteFillObject}
                    onPress={onClose}
                />

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{titleText}</Text>
                        <Text>{infoText}</Text>

                        <View style={styles.buttonRow}>
                            <Pressable
                                style={({ pressed }) => [styles.modalButton, pressed && styles.buttonPressed]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonText}>
                                    {cancelText}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={({ pressed }) => [ styles.modalButton, confirmButtonStyle, pressed && styles.buttonPressed]}
                                onPress={onConfirm}
                            >
                                <Text style={styles.buttonText}>
                                    {confirmText}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </TouchableWithoutFeedback>

            </View>
        </Modal>
    );
};

export const DestructiveModal: React.FC<BaseModalProps> = (props) => {
    return (
        <BaseModal
            {...props}
            confirmButtonStyle={{ backgroundColor: "red" }}
        />
    );
};


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "85%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: '#b9b9b9'
    },
    buttonPressed:{
        backgroundColor: '#8a8a8a'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 0.5,
        textAlign: "center",
    },
});