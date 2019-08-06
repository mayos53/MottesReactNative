import React from 'react';
import {Dimensions} from 'react-native';


const {width, height} = Dimensions.get('window');

const vh = height / 100;
const vw = width / 100;

export const sizeWidth = (size) => {
    return size * vw;
};

export const sizeHeight = (size) => {
    return size * vh;
};

export const sizeFont = (size) => {
    return size * vw;
};
