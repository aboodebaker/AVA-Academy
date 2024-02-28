import React from 'react';
import { IconProps } from './types';

export const Calendar: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="currentColor"
      {...rest}
    >
        <path d="M26.25 28.125V31.875C26.25 32.3723 26.0525 32.8492 25.7008 33.2008C25.3492 33.5525 24.8723 33.75 24.375 33.75H11.25L5.625 39.375V20.625C5.625 20.1277 5.82254 19.6508 6.17417 19.2992C6.52581 18.9475 7.00272 18.75 7.5 18.75H11.25M39.375 26.25L33.75 20.625H20.625C20.1277 20.625 19.6508 20.4275 19.2992 20.0758C18.9475 19.7242 18.75 19.2473 18.75 18.75V7.5C18.75 7.00272 18.9475 6.52581 19.2992 6.17417C19.6508 5.82254 20.1277 5.625 20.625 5.625H37.5C37.9973 5.625 38.4742 5.82254 38.8258 6.17417C39.1775 6.52581 39.375 7.00272 39.375 7.5V26.25Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
  );
};
