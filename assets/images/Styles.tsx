import { Dimensions, StyleSheet } from 'react-native';


const { width } = Dimensions.get('window');

export default StyleSheet.create({
    loginScreen_button: {
        alignItems: 'center',
        backgroundColor: '#b55bffff',
        borderRadius: 15,
        marginTop: 4,
        marginBottom: 4,
    },
    loginScreen_buttonText: {
        textAlign: 'center',
        padding: 10,
        color: 'white',
    },
    loginScreen_container: {
        flex: 1,
        backgroundColor: '#e7e7e7ff',
    },
    loginScreen_scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginScreen_innerContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 50,
    },
    loginScreen_imageContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    loginScreen_image: {
        width: width * 0.8,
        height: (width * 0.8) * 0.5,
        resizeMode: 'contain',
    },
    loginScreen_inputContainer: {
        width: '80%',
        marginTop: -30,
    },
    loginScreen_input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#000000ff',
        borderRadius: 5,
        backgroundColor: '#ffffffff',
    },
    loginScreen_inputHeader: {
        fontSize: 18,
    }

})