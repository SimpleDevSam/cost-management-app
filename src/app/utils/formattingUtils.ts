import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat("pt-BR").format(quantity) + "g"
  }

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

export const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-"
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }