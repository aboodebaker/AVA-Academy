import React from 'react';
import { IconProps } from './types';

export const Quiz: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="#000000"
      preserveAspectRatio="xMidYMid meet"
      {...rest}
    >
      <path d="M170 820 c-19 -19 -20 -33 -20 -370 0 -337 1 -351 20 -370 18 -18 33
        -20 197 -20 147 0 179 -3 194 -16 23 -21 86 -43 124 -44 57 0 109 22 151 64
        51 51 64 94 60 205 -2 82 -3 85 -39 117 -20 19 -47 34 -60 34 -40 0 -47 18
        -47 115 l0 90 -108 108 -107 107 -173 0 c-159 0 -174 -2 -192 -20z m444 -218
        c-43 -2 -83 -1 -91 2 -9 4 -13 29 -13 93 l0 88 90 -90 91 -90 -77 -3z m-319
        -122 c0 -18 -6 -26 -23 -28 -13 -2 -25 3 -28 12 -10 26 4 48 28 44 17 -2 23
        -10 23 -28z m360 0 l0 -25 -143 -3 c-120 -2 -143 0 -148 13 -4 8 -4 22 0 30 5
        13 28 15 148 13 l143 -3 0 -25z m-360 -120 c0 -18 -6 -26 -23 -28 -13 -2 -25
        3 -28 12 -10 26 4 48 28 44 17 -2 23 -10 23 -28z m252 0 c-32 -27 -41 -30
        -106 -30 -74 0 -91 10 -77 45 4 12 26 15 111 15 l106 0 -34 -30z m173 15 c0
        -22 45 -41 63 -27 19 16 63 -28 45 -46 -9 -9 -9 -18 0 -37 41 -90 -37 -205
        -138 -205 -76 0 -150 74 -150 151 0 46 39 108 82 130 21 11 38 26 38 34 0 10
        10 15 30 15 20 0 30 -5 30 -15z m-425 -135 c0 -18 -6 -26 -23 -28 -13 -2 -25
        3 -28 12 -10 26 4 48 28 44 17 -2 23 -10 23 -28z m191 14 c-3 -9 -6 -22 -6
        -30 0 -21 -108 -20 -116 1 -13 34 3 45 67 45 52 0 60 -2 55 -16z"/>
      <path d="M694 258 c-23 -20 -34 -38 -32 -52 5 -34 41 -32 72 4 52 62 20 101
        -40 48z"/>
    </svg>
  );
};