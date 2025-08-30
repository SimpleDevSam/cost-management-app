'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Edit, Eye, PackageSearch, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { ptBR, se } from "date-fns/locale"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Customer } from "@/core/customer/customerEntity";
import { SaleModel } from "@/core/sale/mongooseModel";

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

  useEffect(() => {
    const fetchCustomers = async () => {
      try{
        setIsLoading(true)
        const data = await fetch('http://localhost:3000/api/customer/getAll')
        const customers = await data.json()
        setCustomers(customers)

      } catch (error){
        alert('Erro ao buscar usuários')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()

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

  const handleDelete = async (id:string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/customer/delete/${id}`, {method:'DELETE'})

      if (!response.ok) {
        throw new Error('Erro ao deletar usuário')
      }
      setCustomers(customers.filter(customer => customer._id !== id));
    } catch (error:any){
      alert(error.message)
    }

  }

  const TableHeaderContent = (
    <>
      <TableHead onClick={() => handleSort("totalAmountSpent")} className="cursor-pointer">
        <div className="flex items-center">Total gasto {renderSortIcon("totalAmountSpent")}</div>
      </TableHead>
      <TableHead onClick={() => handleSort("totalSales")} className="cursor-pointer">
        <div className="flex items-center">Quantas vendas {renderSortIcon("totalSales")}</div>
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
                      <TableRow key={customer._id}>
                        <TableCell>{formatCurrency(customer.totalAmountSpent)}</TableCell>
                        <TableCell>{customer.totalSales}</TableCell>
                        <TableCell>{customer.name} </TableCell>
                        <TableCell>{formatDate(customer.lastPurchase)} </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/customer/${customer._id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/customer/edit/${customer._id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button onClick={() => handleDelete(customer._id)}variant="ghost" size="icon">
                            <Trash2  className="h-4 w-4" />
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