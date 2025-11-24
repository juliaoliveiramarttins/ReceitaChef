import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

export default function PotIcon({ size = 80 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            {/* Fumaça laranja */}
            <G opacity="0.8">
                <Path
                    d="M35 25 Q30 15, 35 5"
                    stroke="#FF6347"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
                <Path
                    d="M50 20 Q45 10, 50 0"
                    stroke="#FF7F50"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                />
                <Path
                    d="M65 25 Q70 15, 65 5"
                    stroke="#FF8C00"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
            </G>

            {/* Alça esquerda */}
            <Path
                d="M20 45 Q15 50, 20 55"
                stroke="#1a1a1a"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
            />

            {/* Alça direita */}
            <Path
                d="M80 45 Q85 50, 80 55"
                stroke="#1a1a1a"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
            />

            {/* Tampa */}
            <Path
                d="M25 40 L75 40 L73 35 L27 35 Z"
                fill="#2a2a2a"
                stroke="#1a1a1a"
                strokeWidth="2"
            />

            {/* Puxador da tampa */}
            <Circle cx="50" cy="37" r="4" fill="#333" />

            {/* Corpo da panela */}
            <Path
                d="M25 45 L23 75 Q23 85, 30 88 L70 88 Q77 85, 77 75 L75 45 Z"
                fill="#1a1a1a"
                stroke="#0a0a0a"
                strokeWidth="2"
            />

            {/* Brilho na panela */}
            <Path
                d="M30 50 Q32 48, 35 50 L35 70 Q32 68, 30 70 Z"
                fill="#333"
                opacity="0.5"
            />
        </Svg>
    );
}
