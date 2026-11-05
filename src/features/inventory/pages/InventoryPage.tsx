import { useState, useEffect } from 'react'
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  ShoppingCart,
  Boxes,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageLoader } from '@/components/ui/loading'
import { pmsApi } from '@/services/api-client'
import { formatCurrency } from '@/lib/utils'
import type { InventoryItem } from '@/types'

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const res = await pmsApi.getInventory()
        setItems(res)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = items.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())
  )

  const lowStockCount = items.filter((i) => i.currentStock <= i.reorderLevel).length

  if (loading) return <PageLoader text="Loading Hotel Stores & Inventory..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Hotel Inventory & Central Stores</h1>
            {lowStockCount > 0 && <Badge variant="warning">{lowStockCount} Reorder Alerts</Badge>}
          </div>
          <p className="text-sm text-gray-500 mt-1">Manage housekeeping linen, in-room amenities, and F&B provisions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" className="gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Stock-In / Receive Goods</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Create Purchase Order</span>
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="w-72">
            <Input
              placeholder="Search items by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">SKU / Item Name</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Category</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Current Stock</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Reorder Threshold</th>
                <th className="px-5 py-3.5 text-left rtl:text-right font-semibold">Last Unit Cost</th>
                <th className="px-5 py-3.5 text-right rtl:text-left font-semibold">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => {
                const isLow = item.currentStock <= item.reorderLevel

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-bold text-gray-900">{item.name}</td>
                    <td className="px-5 py-4">
                      <Badge variant="outline">{item.category}</Badge>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-base">
                      {item.currentStock} <span className="text-xs font-normal text-gray-400">{item.unit}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-gray-500 text-xs">{item.reorderLevel} {item.unit}</td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold">{formatCurrency(item.lastPurchasePrice)}</td>
                    <td className="px-5 py-4 text-right rtl:text-left">
                      {isLow ? (
                        <Badge variant="destructive">Low Stock Alert</Badge>
                      ) : (
                        <Badge variant="success">Optimal</Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
