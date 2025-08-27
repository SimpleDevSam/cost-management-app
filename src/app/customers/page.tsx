'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Edit, Eye, PackageSearch, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { useState } from "react";
import { ptBR, se } from "date-fns/locale"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const formatDate = (date: Date | null) => {
  if (!date) return "-"
  return format(date, "dd/MM/yyyy", { locale: ptBR })
}

export const mockCustomers: Customer[] = [
  {
    id: "1",
    totalSold: 12500.75,
    name: "Ana Silva",
    salesCount: 8,
    lastPurchase: new Date(2024, 6, 15) // July 15, 2024
  },
  {
    id: "2",
    totalSold: 8750.50,
    name: "Bruno Costa",
    salesCount: 12,
    lastPurchase: new Date(2024, 6, 12) // July 12, 2024
  },
  {
    id: "3",
    totalSold: 23400.00,
    name: "Carla Dias",
    salesCount: 5,
    lastPurchase: new Date(2024, 6, 18) // July 18, 2024
  },
  {
    id: "4",
    totalSold: 5600.25,
    name: "Daniel Martins",
    salesCount: 15,
    lastPurchase: new Date(2024, 6, 10) // July 10, 2024
  },
  {
    id: "5",
    totalSold: 18900.90,
    name: "Eduarda Lima",
    salesCount: 7,
    lastPurchase: new Date(2024, 6, 20) // July 20, 2024
  },
  {
    id: "6",
    totalSold: 3200.00,
    name: "Fernando Alves",
    salesCount: 9,
    lastPurchase: new Date(2024, 6, 8) // July 8, 2024
  },
  {
    id: "7",
    totalSold: 15750.40,
    name: "Gabriela Barbosa",
    salesCount: 6,
    lastPurchase: new Date(2024, 6, 22) // July 22, 2024
  },
  {
    id: "8",
    totalSold: 9800.60,
    name: "Heitor Rocha",
    salesCount: 11,
    lastPurchase: new Date(2024, 6, 5) // July 5, 2024
  },
  {
    id: "9",
    totalSold: 21000.30,
    name: "Isabela Castro",
    salesCount: 4,
    lastPurchase: new Date(2024, 6, 25) // July 25, 2024
  },
  {
    id: "10",
    totalSold: 4500.75,
    name: "João Pereira",
    salesCount: 14,
    lastPurchase: new Date(2024, 6, 3) // July 3, 2024
  },
  {
    id: "11",
    totalSold: 16700.20,
    name: "Karina Oliveira",
    salesCount: 8,
    lastPurchase: new Date(2024, 6, 19) // July 19, 2024
  },
  {
    id: "12",
    totalSold: 8900.45,
    name: "Leonardo Santos",
    salesCount: 10,
    lastPurchase: new Date(2024, 6, 14) // July 14, 2024
  },
  {
    id: "13",
    totalSold: 13400.80,
    name: "Mariana Costa",
    salesCount: 7,
    lastPurchase: new Date(2024, 6, 21) // July 21, 2024
  },
  {
    id: "14",
    totalSold: 27600.35,
    name: "Nicolas Ferreira",
    salesCount: 3,
    lastPurchase: new Date(2024, 6, 28) // July 28, 2024
  },
  {
    id: "15",
    totalSold: 6800.90,
    name: "Olivia Rodrigues",
    salesCount: 13,
    lastPurchase: new Date(2024, 6, 1) // July 1, 2024
  }
]

interface Customer {
  id: string
  totalSold: number
  name: string
  salesCount: number
  lastPurchase: Date
}

type SortKey = keyof Customer | null
type SortDirection = "asc" | "desc"

export default function Customers() {
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const itemsPerPage = 5

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers)
      setIsLoading(false)
    }, 1500)
  }, [])

  const filteredCustomers = useMemo(() => {
    if (searchTerm === '') return customers

    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, customers])


  const sortedCustomers = useMemo(() => {
    if (!sortKey) return filteredCustomers

    return [...filteredCustomers].sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]

      if (aValue === null) return 1
      if (bValue === null) return -1

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredCustomers, sortKey, sortDirection])

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedCustomers.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedCustomers, currentPage, itemsPerPage])


  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const TableHeaderContent = (
    <>
      <TableHead onClick={() => handleSort("totalSold")} className="cursor-pointer">
        <div className="flex items-center">Valor {renderSortIcon("totalSold")}</div>
      </TableHead>
      <TableHead onClick={() => handleSort("salesCount")} className="cursor-pointer">
        <div className="flex items-center">Vendas {renderSortIcon("salesCount")}</div>
      </TableHead>
      <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
        <div className="flex items-center">Cliente {renderSortIcon("name")}</div>
      </TableHead>
      <TableHead onClick={() => handleSort("lastPurchase")} className="cursor-pointer text-right">
        <div className="flex items-center">Ultima Compra{renderSortIcon("lastPurchase")}</div>
      </TableHead>
      <TableHead className="text-center">Ações</TableHead>
    </>
  )
  return (
    <div>
      <main className="w-full max-w-4xl m-auto my-6">
        <Card>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
            </CardHeader>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>)
              : filteredCustomers.length === 0 ?
                (<div className="text-center py-12">
                  <PackageSearch className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-lg text-muted-foreground">Nenhuma venda encontrada.</p>
                </div>) :
                (<Table>
                  <TableHeader>
                    <TableRow>{TableHeaderContent}</TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{formatCurrency(customer.totalSold)}</TableCell>
                        <TableCell>{customer.salesCount}</TableCell>
                        <TableCell>{customer.name} </TableCell>
                        <TableCell>{formatDate(customer.lastPurchase)} </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/view-sale/${customer.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/edit-sale/${customer.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>)
            }
          </CardContent>

        </Card>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.max(1, currentPage - 1))
                }}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(i + 1)
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }}
                aria-disabled={totalPages === currentPage}
                tabIndex={totalPages === currentPage ? -1 : undefined}
                className={totalPages === currentPage ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </div>
  );
}