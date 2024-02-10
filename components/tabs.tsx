'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  data: any
}

const TabsDemo = ({ data }: Props) => (
  <div className="w-[400px]">
    <Tabs defaultValue="strengths">
      <TabsList className="grid grid-cols-3 mb-4">
        {Object.keys(data).map((key, index) => (
          <TabsTrigger key={index} value={key} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300">{key}</TabsTrigger>
        ))}
      </TabsList>
      {Object.keys(data).map((key, index) => (
        <TabsContent key={index} value={key} className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>{key}</CardTitle>
            </CardHeader>
            <CardContent className="overflow-auto">
              {renderContent(data[key])}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  </div>
);

const renderContent = (content: any) => {
  if (typeof content === 'object') {
    // If content is an object, convert it to an array of React elements
    return Object.keys(content).map((question, index) => (
      <div key={index}>
        <strong>{question}</strong>: {content[question]}
      </div>
    ));
  } else {
    // Otherwise, assume content is a string
    return <CardDescription>{content}</CardDescription>;
  }
};

export default TabsDemo;