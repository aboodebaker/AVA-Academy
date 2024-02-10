// @ts-nocheck
'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import AuthProvider from '@/components/AuthProvider/AuthProvider'
import Tester from '@/components/layout/tester'
import Sidebar from '@/components/navbar/sidebar'
import DarkModeSwitcher from '@/components//DarkmodeToggle/Darkmodetoggle'
import { ThemeProvider } from '@/components/DarkmodeToggle/shadCn'
import Providers from '@/components/Providers'
import { usePathname } from "next/navigation";
import Sticky from 'react-stickynode';
const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  if (pathname.startsWith('/chat')) {
    return (
    <html lang="en">
      <head>
        <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" async></script>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="title" content="Create Next App"/>
        <meta name="description" content="Generated by create next app"/>
        <meta name="manifest" content="/manifest.json"/>
        <meta name="theme-color" content="#ffffff"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>AVA Academy</title>
      </head>

      <body>
        <AuthProvider>
          <Providers>


              <div className="outer-none">
                
                <div className="sidebar">
                  <Sidebar /> 
                </div>
                
                <div className="inner">
                  <div  className="min-h-screen" >
                    {children}
                  </div>
                </div>
                <div className='dark-switch'>
                <DarkModeSwitcher />
                </div>
              </div>

          </Providers>
        </AuthProvider>
      </body>
    </html>)
  }

  if (pathname.includes('/teacher-platform')) {
    return (
          <html lang="en">
      <head>
        <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" async></script>
                <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="title" content="Create Next App"/>
        <meta name="description" content="Generated by create next app"/>
        <meta name="manifest" content="/manifest.json"/>
        <meta name="theme-color" content="#ffffff"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>AVA Academy</title>
      </head>

      <body>
        <AuthProvider>
        <Providers>
        <div className="flex">
          <div className="">
            
              <Tester />
             
              {/* <MenuBarMobile setter={setShowSidebar} />
              <Sidebar show={showSidebar} setter={setShowSidebar} /> */}
            </div>

            <div className="flex flex-col flex-grow  md:w-full min-h-screen inner">
                {children}
            </div>
        </div>
        </Providers>
        </AuthProvider>

        </body>
            </html>
    )
  }

  if (pathname.startsWith('/teacher-platform/chat')) {
    return (
          <html lang="en">
      <head>
        <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" async></script>
                <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="title" content="Create Next App"/>
        <meta name="description" content="Generated by create next app"/>
        <meta name="manifest" content="/manifest.json"/>
        <meta name="theme-color" content="#ffffff"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>AVA Academy</title>
      </head>

      <body>
        <AuthProvider>
        <Providers>
        <div className="flex">
          <div className="">
            
              <Tester />
             
              {/* <MenuBarMobile setter={setShowSidebar} />
              <Sidebar show={showSidebar} setter={setShowSidebar} /> */}
            </div>

            <div className="flex flex-col flex-grow  md:w-full min-h-screen inner">
                {children}
            </div>
        </div>
        </Providers>
        </AuthProvider>

        </body>
            </html>
    )
  }

  return (
    <html lang="en">
      <head>
        <script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" async></script>
                <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="title" content="Create Next App"/>
        <meta name="description" content="Generated by create next app"/>
        <meta name="manifest" content="/manifest.json"/>
        <meta name="theme-color" content="#ffffff"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>AVA Academy</title>
      </head>

      <body >
        <AuthProvider>
          <Providers>
          <div className="outer">
            <div className="sidebar">
              <Sidebar />
            </div>
            <div className="inner">
              <div  className=" full-screen">
                {children}
              </div>
            </div>
            <div className='dark-switch'>
            <DarkModeSwitcher />
            </div>
          </div>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

