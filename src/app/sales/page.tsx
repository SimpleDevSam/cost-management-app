"use client";

import * as React from "react"
import { useState, useMemo } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  PackageSearch,
  MoreHorizontal,
  Eye
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Skeleton
} from "@/components/ui/skeleton"
import { date } from "zod"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { GetAllSalesDTO } from "../api/sale/getAll/route";

// TypeScript Interface for Sale data
interface Sale {
  id: string
  amount: number
  soldAt: Date
  customer: string
  pgDate: Date | null
  deliveredDate: Date | null
  quantity: number
}

// Utility Functions
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

const formatQuantity = (quantity: number) => {
  return new Intl.NumberFormat("pt-BR").format(quantity) + "g"
}

type SortKey = 'customerId.name' | 'soldAt' | 'amount' | 'quantity' | 'pgDate' | 'deliveredDate' | null;
type SortDirection = "asc" | "desc"
export interface DateRange { from?: Date, to?: Date }

export default function SalesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [sales, setSales] = useState<GetAllSalesDTO[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [paymentStatus, setPaymentStatus] = useState("all")
  const [deliveryStatus, setDeliveryStatus] = useState("all")
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter();
  const itemsPerPage = 5

    useMemo(async () => {
      const data = await  fetch('http://localhost:3000/api/sale/getAll')
      const json = await data.json()
      setSales(json)
      setIsLoading(false)
  }, [])

  const clearFilters = () => {
    setSearchTerm("")
    setDateRange({ from: undefined, to: undefined })
    setPaymentStatus("all")
    setDeliveryStatus("all")
    setSortKey(null)
    setSortDirection("asc")
    setCurrentPage(1)
  }

  const filteredSales = useMemo(() => {
    let filtered = sales

    if (searchTerm) {
      filtered = filtered.filter((sale) =>
        sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((sale) => {
        const saleDate = sale.soldAt
        
        if (dateRange.from && dateRange.to) {
          return saleDate >= dateRange.from && saleDate <= dateRange.to
        } else if (dateRange.from) {
          return saleDate >= dateRange.from
        } else if (dateRange.to) {
          return saleDate <= dateRange.to
        }
        return true
      })
    }


    if (paymentStatus !== "all") {
      filtered = filtered.filter((sale) =>
        paymentStatus === "paid" ? sale.pgDate !== null : sale.pgDate === null
      )
    }

    if (deliveryStatus !== "all") {
      filtered = filtered.filter((sale) =>
        deliveryStatus === "delivered"
          ? sale.deliveredDate !== null
          : sale.deliveredDate === null
      )
    }

    return filtered
  }, [sales, searchTerm, dateRange, paymentStatus, deliveryStatus])

  const sortedSales = useMemo(() => {
    if (!sortKey) return filteredSales

    return [...filteredSales].sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortKey === "customerId.name") {
        aValue = a.customer.name ?? "";
        bValue = b.customer.name ?? "";
      } else {
        aValue = a[sortKey];
        bValue = b[sortKey];
      }

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    })
  }, [filteredSales, sortKey, sortDirection])

  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedSales.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedSales, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedSales.length / itemsPerPage)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  const handleFromDateChange = (date: Date | undefined) => {
    setDateRange(prev => ({ ...prev, from: date }))
  }

  const handleToDateChange = (date: Date | undefined) => {
    setDateRange(prev => ({ ...prev, to: date }))
  }

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  async function handleDelete(saleId: string, customerId:string) {
      try {
        const res = await fetch(`http://localhost:3000/api/sale/delete/${saleId}/${customerId}`)

        if (!res.ok) {
          const error = await res.json();
          toast(`❌ ${error.message}`)
          return;
        }

        setSales(sales.filter(sale => sale._id !== saleId));
        toast('✅ Venda deletada com sucesso!')
      } catch (err) {
        toast('❌ Erro ao deletar venda!')
      }
  }

  const TableHeaderContent = (
    <>
      <TableHead onClick={() => handleSort("amount")} className="cursor-pointer">
        <div className="flex items-center">Valor {renderSortIcon("amount")}</div>
      </TableHead>
      <TableHead onClick={() => handleSort("soldAt")} className="cursor-pointer">
        <div className="flex items-center">Data {renderSortIcon("soldAt")}</div>
      </TableHead>
      <TableHead onClick={() => handleSort("customerId.name")} className="cursor-pointer">
        <div className="flex items-center">Cliente {renderSortIcon("customerId.name")}</div>
      </TableHead>
      <TableHead>Pagamento</TableHead>
      <TableHead>Entrega</TableHead>
      <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer text-right">
        <div className="flex items-center justify-end">Quantidade {renderSortIcon("quantity")}</div>
      </TableHead>
      <TableHead className="text-center">Ações</TableHead>
    </>
  )

  return (
    <div className="container mx-auto p-4">
      <Card>
        <Button  className="mx-auto" onClick={() => router.push('/add-sale')}>+ Adicionar Venda</Button> 
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Buscar por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DatePicker date={dateRange?.from} onDateChange={handleFromDateChange} placeholder="Data Início"/>
            <DatePicker date={dateRange?.to} onDateChange={handleToDateChange} placeholder="Data Final"/>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="">
                <SelectValue placeholder="Status Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
              <SelectTrigger className="">
                <SelectValue placeholder="Status Entrega" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"  className="" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(itemsPerPage)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginatedSales.length === 0 ? (
            <div className="text-center py-12">
              <PackageSearch className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">Nenhuma venda encontrada.</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>{TableHeaderContent}</TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell>{formatCurrency(sale.amount)}</TableCell>
                        <TableCell>{formatDate(sale.soldAt)}</TableCell>
                        <TableCell>{sale.customer.name}</TableCell>
                        <TableCell>
                          <Badge variant={sale.pgDate ? "success" : "secondary"}>
                            {sale.pgDate ? "Pago" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sale.deliveredDate ? "success" : "secondary"}>
                            {sale.deliveredDate ? "Entregue" : "Pendente"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatQuantity(sale.quantity)}</TableCell>
                        <TableCell className="text-center">
                          <Link href={`/view-sale/${sale._id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/edit-sale/${sale._id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button onClick={() => handleDelete(sale._id, sale.customer._id)} variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="block md:hidden">
                {paginatedSales.map((sale) => (
                  <Card key={sale._id} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{sale.customer.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{formatDate(sale.soldAt)}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/view-sale/${sale._id}`} className="flex items-center w-full">
                                <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/edit-sale/${sale._id}`} className="flex items-center w-full">
                                <Edit className="mr-2 h-4 w-4" /> Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500"> <Trash2 className="mr-2 h-4 w-4" /> Excluir </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Valor</p>
                        <p>{formatCurrency(sale.amount)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Quantidade</p>
                        <p>{formatQuantity(sale.quantity)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Pagamento</p>
                        <Badge variant={sale.pgDate ? "success" : "secondary"}>
                          {sale.pgDate ? `Pago em ${formatDate(sale.pgDate)}` : "Pendente"}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium">Entrega</p>
                        <Badge variant={sale.deliveredDate ? "success" : "secondary"}>
                          {sale.deliveredDate ? `Entregue em ${formatDate(sale.deliveredDate)}` : "Pendente"}
                        </Badge>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
