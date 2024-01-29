
import React from 'react';

export default function PathPrinter(){

    const words: string[] = ['Apple', 'Banana', 'Orange'];
    // Join the array of words into a single string
    const joinedWords = words.join(' -> ');

    return (
        <div>
            <p>{joinedWords}</p>
        </div>
    );
};
