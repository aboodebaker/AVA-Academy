'use client'
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
//import { ArrowsExpandIcon } from "@heroicons/react/outline";
import { Button, Card, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import { Fragment, } from "react";


const Tables = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const available = false

  if (available == false) {
  return (
    <>
      <Card className="relative max-w-xxl mx-auto h-96 overflow-hidden">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>User</TableHeaderCell>
              <TableHeaderCell className="text-right">Country</TableHeaderCell>
              <TableHeaderCell className="text-right">Last Active</TableHeaderCell>
              <TableHeaderCell className="text-right">Transactions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.topic}>
                <TableCell>{item.topic}</TableCell>
                <TableCell className="text-right">
                  <Text>{item.gameType}</Text>
                </TableCell>
                <TableCell className="text-right">
                  <Text>{item.time}</Text>
                </TableCell>
                <TableCell className="text-right">
                  <Text>{item.transactions}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
          <Button
            icon={null}
            className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
            onClick={openModal}
          >
            Show more
          </Button>
        </div>
      </Card>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-xxl transform overflow-hidden ring-tremor bg-white
                                    p-6 text-left align-middle shadow-tremor transition-all rounded-xl"
                >
                  <div className="relative mt-3">
                    <Table className="h-[450px]">
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell className="bg-white">User</TableHeaderCell>
                          <TableHeaderCell className="bg-white text-right">country</TableHeaderCell>
                          <TableHeaderCell className="bg-white text-right">
                            lastActive
                          </TableHeaderCell>
                          <TableHeaderCell className="bg-white text-right">
                            transactions
                          </TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow key={item.topic}>
                            <TableCell>{item.topic}</TableCell>
                            <TableCell className="text-right">
                              <Text>{item.gameType}</Text>
                            </TableCell>
                            <TableCell className="text-right">
                              <Text>{item.lastActive}</Text>
                            </TableCell>
                            <TableCell className="text-right">
                              <Text>{item.transactions}</Text>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white z-0 h-20 w-full" />
                    </Table>
                  </div>
                  <Button
                    className="mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                    onClick={closeModal}
                  >
                    Go back
                  </Button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )}
  return (
    <>
      <p> table</p>
    </>
}

export default Tables
