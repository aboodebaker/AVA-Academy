'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { SlHome } from 'react-icons/sl';
import { TbBookFilled } from 'react-icons/tb';
import { BsFillChatFill } from 'react-icons/bs';
import { LiaStickyNoteSolid } from 'react-icons/lia';
import DarkModeSwitcher from '../DarkmodeToggle/Darkmodetoggle';
import Sticky from 'react-stickynode';
import './sidebar.css';



const Sidebar= ({ show, setter }) => {
  const router = useRouter();
  const [activeRoute, setActiveRoute] = useState(router.pathname);

  useEffect(() => {
    setActiveRoute(router.pathname);
  }, [router.pathname]);

  const MenuItem = ({
    icon,
    name,
    route,
  }) => {
    const isActive = router.pathname === route;
    const colorClass = isActive
      ? 'text-text rounded-md bg-backgroundAccent font-bold'
      : 'text-text hover:text-white/50';
    const iconColorClass = isActive ? 'text-text' : 'text-text hover:text-white/50';

    return (
      <Link href={route} passHref>
        <div
          onClick={() => {
            setter((oldVal) => !oldVal);
          }}
          className={`flex items-center text-md pl-6 py-1.5 ${colorClass} ${
            isActive ? 'mb-2' : 'mb-1'
          }`}
        >
          <div className={`text-xl w-6 h-6 mr-3 ${iconColorClass}`}>{icon}</div>
          <div className='text-xl'>{name}</div>
        </div>
      </Link>
    );
  };

  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setter((oldVal) => !oldVal);
      }}
    />
  )

  const className =
    'outer-sidebar w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40 ';
  const appendClass = show ? ' ml-0' : ' ml-[-250px] md:ml-0';

  return (
    <>
      <div className={`${className}${appendClass}`}>
        <Sticky>
          <div className="flex flex-col justify-between  height">
            <div>
              <div className="p-2 flex justify-center items-center">
                <Link href="/" passHref>
                  <div
                    className="text-text hover:text-text/50 font-extrabold p-3 font-mono text-4xl flex-col justify-center align-center"
                    onClick={() => {
                      setter((oldVal) => !oldVal);
                    }}
                  >
                    Teacher Platform
                  </div>
                </Link>
              </div>
              <div >
                <MenuItem name="Activities" route="/teacher-platform/activities" icon={<SlHome />} />
                <MenuItem name="Classes" route="/teacher-platform/classes" icon={<TbBookFilled />} />
                <MenuItem name="AI Chat" route="/teacher-platform/chat" icon={<BsFillChatFill />} />
                <MenuItem name="Upload" route="/teacher-platform/upload" icon={<LiaStickyNoteSolid />} />
                <MenuItem name="Progress" route="/teacher-platform/progress" icon={<LiaStickyNoteSolid />} />
              </div>
            </div>
            <div className="grow h-full"></div>
            <div className="flex items-center justify-center">
              <DarkModeSwitcher />
            </div>
          </div>
        </Sticky>
      </div>

      {show ? <ModalOverlay /> : <></>}
    </>
  );
};

export default Sidebar;
