'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Edit, Eye, MoreHorizontal, PackageSearch, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Customer } from "@/core/customer/customerEntity";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "../utils/formattingUtils";


type SortKey = keyof Customer | null
type SortDirection = "asc" | "desc"

export default function Customers() {
  const [isSubmiting, setIsSubmiting] = useState(false)
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
      try {
        setIsLoading(true)
        const data = await fetch('/api/customer/getAll')
        const customers = await data.json()
        setCustomers(customers)

      } catch (error) {
        toast('❌ Erro ao buscar usuários')
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

  const handleDelete = async (id: string) => {
    try {
      setIsSubmiting(true)
      const response = await fetch(`/api/customer/delete/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error('❌ Não foi possível deletar cliente')
      }
      setCustomers(customers.filter(customer => customer._id !== id));
      toast('✅ Cliente deletado com sucesso!')
    } catch (error: any) {
      toast(error.message)
    } finally {
      setIsSubmiting(false)
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
            <div className="flex flex-col md:flex-col gap-4 mb-4">
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
            </CardHeader>
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
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
                (<div className="hidden md:block">
                  <Table>
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
                              <Button disabled={isSubmiting} variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/customer/edit/${customer._id}`}>
                              <Button disabled={isSubmiting} variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button disabled={isSubmiting} onClick={() => handleDelete(customer._id)} variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>)
            }
            <div className="block md:hidden">
              {paginatedCustomers.map((customer) => (
                <Card key={customer._id} className="mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{customer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{formatDate(customer.createdAt)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/customer/${customer._id}`} className="flex items-center w-full">
                              <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/customer/edit/${customer._id}`} className="flex items-center w-full">
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={isSubmiting} className="text-red-500">
                            <Trash2 onClick={() => handleDelete(customer._id)} className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Total Gasto</p>
                      <p>{formatCurrency(customer.totalAmountSpent)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Vendas</p>
                      <p>{customer.totalSales}</p>
                    </div>
                    <div>
                      <p className="font-medium">Última Compra</p>
                      <p>{formatDate(customer.lastPurchase)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}