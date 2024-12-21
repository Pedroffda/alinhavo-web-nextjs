'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ScissorsIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MeusPedidosPage() {
  const [pedidos, setPedidos] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuário não autenticado')

        const { data, error } = await supabase
          .from('pedidos')
          .select('*')
          .eq('usuario_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setPedidos(data)
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
        setError('Não foi possível carregar seus pedidos. Por favor, tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [supabase])

  if (loading) return <div className="text-center mt-8">Carregando seus pedidos...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <ScissorsIcon className="h-8 w-8 text-[#ff9900] mr-2" />
            <CardTitle className="text-2xl font-bold">Meus Pedidos</CardTitle>
          </div>
          <CardDescription>
            Acompanhe o status dos seus pedidos personalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pedidos.length === 0 ? (
            <p className="text-center">Você ainda não tem pedidos. Que tal <a href="/criar-pedido" className="text-blue-500 hover:underline">criar um agora</a>?</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Roupa</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Estilo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido: any) => (
                  <TableRow key={pedido.id}>
                    <TableCell>{pedido.tipoRoupa}</TableCell>
                    <TableCell>{pedido.tamanho}</TableCell>
                    <TableCell>{pedido.cor}</TableCell>
                    <TableCell>{pedido.estilo}</TableCell>
                    <TableCell>{pedido.status || 'Em análise'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}