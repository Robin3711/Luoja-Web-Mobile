import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';

const ImageSelect = ({ uri, onImageSelect }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onImageSelect(uri)}>
            <Image source={{ uri }} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    image: {
        width: 150,
        height: 150,
        marginRight: 10,
        resizeMode: 'cover',
    },
});

export default ImageSelect;