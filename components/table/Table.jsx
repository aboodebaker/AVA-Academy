import React, { useState } from "react";
import {
  Card,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  BadgeDelta,
  MultiSelect,
  MultiSelectItem,
} from "@tremor/react";

const salesPeople = [
  {
    name: "Peter Doe",
    leads: 45,
    sales: "1,000,000",
    quota: "1,200,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
    deltaType: "moderateIncrease",
  },
  {
    name: "Lena Whitehouse",
    leads: 35,
    sales: "900,000",
    quota: "1,000,000",
    variance: "low",
    region: "Region B",
    status: "average",
    deltaType: "unchanged",
  },
  {
    name: "Phil Less",
    leads: 52,
    sales: "930,000",
    quota: "1,000,000",
    variance: "medium",
    region: "Region C",
    status: "underperforming",
    deltaType: "moderateDecrease",
  },
  {
    name: "John Camper",
    leads: 22,
    sales: "390,000",
    quota: "250,000",
    variance: "low",
    region: "Region A",
    status: "overperforming",
    deltaType: "increase",
  },
  {
    name: "Max Balmoore",
    leads: 49,
    sales: "860,000",
    quota: "750,000",
    variance: "low",
    region: "Region B",
    status: "overperforming",
    deltaType: "increase",
  },
  {
    name: "Peter Moore",
    leads: 82,
    sales: "1,460,000",
    quota: "1,500,000",
    variance: "low",
    region: "Region A",
    status: "average",
    deltaType: "unchanged",
  },
  {
    name: "Joe Sachs",
    leads: 49,
    sales: "1,230,000",
    quota: "1,800,000",
    variance: "medium",
    region: "Region B",
    status: "underperforming",
    deltaType: "moderateDecrease",
  },
];




const Tables = ({item}) => {
  const [selectedNames, setSelectedNames] = useState([]);

  const isSalesPersonSelected = (salesPerson) =>
    salesPeople.includes(salesPerson.name) || item.length === 0;
  return (
    <Card>
    <MultiSelect
      onValueChange={setSelectedNames}
      placeholder= 'hi'
      className="max-w-xs"
    >
      {salesPeople.map((item) => (
        <MultiSelectItem key={item.id} value={item.id}>
          {item.id}
        </MultiSelectItem>
      ))}
    </MultiSelect>
    <Table className="mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell className="text-right">Leads</TableHeaderCell>
          {/* <TableHeaderCell className="text-right">Sales ($)</TableHeaderCell> */}
          {/* <TableHeaderCell className="text-right">Quota ($)</TableHeaderCell>
          <TableHeaderCell className="text-right">Variance</TableHeaderCell>
          <TableHeaderCell className="text-right">Region</TableHeaderCell>
          <TableHeaderCell className="text-right">Status</TableHeaderCell> */}
        </TableRow>
      </TableHead>

      <TableBody>
        {salesPeople
          .filter((item) => isSalesPersonSelected(item))
          .map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell className="text-right">{item.id}</TableCell>
              <TableCell className="text-right">{item.summary}</TableCell>
              {/* <TableCell className="text-right">{item.quota}</TableCell> */}
              {/* <TableCell className="text-right">{item.variance}</TableCell>
              <TableCell className="text-right">{item.region}</TableCell>
              <TableCell className="text-right">
                <BadgeDelta deltaType={item.deltaType} size="xs">
                  {item.status}
                </BadgeDelta>
              </TableCell> */}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </Card>
  )
}

export default Tables