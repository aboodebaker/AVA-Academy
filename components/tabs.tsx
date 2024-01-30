import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';

type Props = {
    data: any
}


const TabsDemo = ({data} : Props) => (
  <Tabs.Root
    className="flex flex-col w-[300px] shadow-[0_2px_10px] shadow-blackA2"
    defaultValue="tab1"
  >
    <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
      <Tabs.Trigger
        className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
        value="tab1"
      >
        Account
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content
      className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
      value="tab1"
    >
      <p className="mb-5 text-mauve11 text-[15px] leading-normal">
        Make changes to your account here. Click save when you're done.
      </p>
    </Tabs.Content>
  </Tabs.Root>
);

export default TabsDemo;