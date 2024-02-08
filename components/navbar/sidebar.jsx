'use client'
import DarkModeSwitcher from '../DarkmodeToggle/Darkmodetoggle'
import './sidebar.css'
import Link from 'next/link'
import { useState } from 'react'
import {BsArrowRight, BsArrowLeft} from 'react-icons/bs'
const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)

    const handleClick = () => {
        setIsOpen(!isOpen)
    }
  return (
    
    <div >
        {isOpen ?
        <div >
        <div className="sidecontainer">
        <Link href={'/classes'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                <path d="M9.79165 25.8108V33.6442L23.5 41.125L37.2083 33.6442V25.8108L23.5 33.2917L9.79165 25.8108ZM23.5 5.875L1.95831 17.625L23.5 29.375L41.125 19.7596V33.2917H45.0416V17.625L23.5 5.875Z" fill="white"/>
                </svg>
            </div>
        </Link>
        <Link href={'/homework'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                <path d="M7.83331 41.125V17.625L23.5 5.875L39.1666 17.625V41.125H27.4166V27.4167H19.5833V41.125H7.83331Z" fill="white"/>
                </svg>
            </div>
        </Link>
        <Link href={'/notes'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="37" height="45" viewBox="0 0 37 45" fill="none">
                <path d="M24.6667 16.875H33.1459L24.6667 6.5625V16.875ZM10.7917 3.75H26.2084L35.4584 15V33.75C35.4584 34.7446 35.1335 35.6984 34.5553 36.4016C33.977 37.1049 33.1928 37.5 32.375 37.5H10.7917C9.97394 37.5 9.18968 37.1049 8.61144 36.4016C8.0332 35.6984 7.70835 34.7446 7.70835 33.75V7.5C7.70835 6.50544 8.0332 5.55161 8.61144 4.84835C9.18968 4.14509 9.97394 3.75 10.7917 3.75ZM4.62502 11.25V41.25H32.375V45H4.62502C3.80727 45 3.02301 44.6049 2.44477 43.9016C1.86654 43.1984 1.54169 42.2446 1.54169 41.25V11.25H4.62502Z" fill="white"/>
                </svg>
            </div>
        </Link>
        <Link href={'/chat'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
                <path d="M26.25 28.125V31.875C26.25 32.3723 26.0525 32.8492 25.7008 33.2008C25.3492 33.5525 24.8723 33.75 24.375 33.75H11.25L5.625 39.375V20.625C5.625 20.1277 5.82254 19.6508 6.17417 19.2992C6.52581 18.9475 7.00272 18.75 7.5 18.75H11.25M39.375 26.25L33.75 20.625H20.625C20.1277 20.625 19.6508 20.4275 19.2992 20.0758C18.9475 19.7242 18.75 19.2473 18.75 18.75V7.5C18.75 7.00272 18.9475 6.52581 19.2992 6.17417C19.6508 5.82254 20.1277 5.625 20.625 5.625H37.5C37.9973 5.625 38.4742 5.82254 38.8258 6.17417C39.1775 6.52581 39.375 7.00272 39.375 7.5V26.25Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </Link>
        
        </div> 
        <div className='centers'>
        <button onClick={handleClick} className='button-bg'>
            <BsArrowLeft/>
            </button>
            </div>
        </div>
            : <>
    
        <div>
            <div className="sidecontainer-closed">
        <Link href={'/'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                <path d="M7.83331 41.125V17.625L23.5 5.875L39.1666 17.625V41.125H27.4166V27.4167H19.5833V41.125H7.83331Z" fill="white"/>
                </svg>
            </div>
        </Link>
        <Link href={'/classes'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47" fill="none">
                <path d="M9.79165 25.8108V33.6442L23.5 41.125L37.2083 33.6442V25.8108L23.5 33.2917L9.79165 25.8108ZM23.5 5.875L1.95831 17.625L23.5 29.375L41.125 19.7596V33.2917H45.0416V17.625L23.5 5.875Z" fill="white"/>
                </svg>
            </div>
        </Link>
        <Link href={'/notes'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="37" height="45" viewBox="0 0 37 45" fill="none">
                <path d="M24.6667 16.875H33.1459L24.6667 6.5625V16.875ZM10.7917 3.75H26.2084L35.4584 15V33.75C35.4584 34.7446 35.1335 35.6984 34.5553 36.4016C33.977 37.1049 33.1928 37.5 32.375 37.5H10.7917C9.97394 37.5 9.18968 37.1049 8.61144 36.4016C8.0332 35.6984 7.70835 34.7446 7.70835 33.75V7.5C7.70835 6.50544 8.0332 5.55161 8.61144 4.84835C9.18968 4.14509 9.97394 3.75 10.7917 3.75ZM4.62502 11.25V41.25H32.375V45H4.62502C3.80727 45 3.02301 44.6049 2.44477 43.9016C1.86654 43.1984 1.54169 42.2446 1.54169 41.25V11.25H4.62502Z" fill="white"/>
                </svg>
            </div>
        </Link>
        <Link href={'/chat'}>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45 45" fill="none">
                <path d="M26.25 28.125V31.875C26.25 32.3723 26.0525 32.8492 25.7008 33.2008C25.3492 33.5525 24.8723 33.75 24.375 33.75H11.25L5.625 39.375V20.625C5.625 20.1277 5.82254 19.6508 6.17417 19.2992C6.52581 18.9475 7.00272 18.75 7.5 18.75H11.25M39.375 26.25L33.75 20.625H20.625C20.1277 20.625 19.6508 20.4275 19.2992 20.0758C18.9475 19.7242 18.75 19.2473 18.75 18.75V7.5C18.75 7.00272 18.9475 6.52581 19.2992 6.17417C19.6508 5.82254 20.1277 5.625 20.625 5.625H37.5C37.9973 5.625 38.4742 5.82254 38.8258 6.17417C39.1775 6.52581 39.375 7.00272 39.375 7.5V26.25Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </Link>
        
        </div>
            <button onClick={handleClick} className='center-button'>
            <BsArrowRight />
            </button>
        </div>

    
        </>}
        {/* <DarkModeSwitcher /> */}
    </div> 
  )
}

export default Sidebar