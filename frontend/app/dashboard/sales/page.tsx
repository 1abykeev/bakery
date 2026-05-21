// frontend/src/app/dashboard/sales/page.tsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product, Sale } from "@/types";
import SellModal from "@/components/sales/SellModal";

export default function SalesPage() {
  const [products, setProducts]             = useState<Product[]>([]);
  const [recentSales, setRecentSales]       = useState<Sale[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  async function fetchData() {
    try {
      const [prodRes, salesRes] = await Promise.all([
        api.get("/products/"),
        api.get("/sales/"),
      ]);
      setProducts(prodRes.data);
      setRecentSales(salesRes.data.slice(0, 10)); // show last 10
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  function handleSold(sale: Sale, updatedStock: number) {
    // Update product stock in local state
    setProducts((prev) =>
      prev.map((p) => p.id === sale.product_id ? { ...p, stock: updatedStock } : p)
    );
    // Add to recent sales at top
    setRecentSales((prev) => [sale, ...prev].slice(0, 10));
    setSelectedProduct(null);
  }

  const stockColor = (stock: number) =>
    stock === 0 ? "text-red-500 bg-red-50"
    : stock < 10 ? "text-amber-600 bg-amber-50"
    : "text-green-600 bg-green-50";

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Сатуу</h1>
        <p className="text-stone-500 text-sm mt-1">
          Продуктту тандап, сатуу баскычын басыңыз
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="space-y-8">

          {/* ── Products list ── */}
          <div>
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-stone-700 font-semibold">Продукт жок</p>
                <p className="text-stone-400 text-sm mt-1">
                  «Продукттар» бөлүмүнөн продукт кошуңуз
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between px-5 py-4 bg-white border border-stone-100 rounded-xl hover:shadow-sm transition-all duration-150"
                  >
                    {/* Left: product info */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-xl">
                        {product.emoji || "🧁"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{product.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {product.price} сом / данасы
                          {product.expenses.length > 0 && (
                            <span className="ml-2 text-stone-300">
                              · {product.expenses.length} чыгым
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right: stock + sell button */}
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${stockColor(product.stock)}`}>
                        {product.stock} дана
                      </span>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        disabled={product.stock === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition shadow-sm shadow-amber-100"
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {product.stock === 0 ? "Жок" : "Сатуу"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Recent sales ── */}
          {recentSales.length > 0 && (
            <div>
              <div className="mb-4">
                <h2 className="text-base font-bold text-stone-800">Акыркы сатуулар</h2>
                <p className="text-stone-400 text-xs mt-0.5">Акыркы 10 сатуу</p>
              </div>
              <div className="space-y-2">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between px-5 py-3.5 bg-white border border-stone-100 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 text-base">
                        🧾
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">
                          {sale.product_name}
                          <span className="text-stone-400 font-normal ml-1">× {sale.quantity}</span>
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {sale.client_name || "Кардар белгисиз"}
                          {sale.client_phone && ` · ${sale.client_phone}`}
                          {" · "}
                          {new Date(sale.sold_at).toLocaleDateString("ky-KG")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">+{sale.total_price} сом</p>
                      {sale.expense_snapshots.length > 0 && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          {sale.expense_snapshots.length} чыгым жазылды
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sell Modal */}
      {selectedProduct && (
        <SellModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSold={handleSold}
        />
      )}
    </div>
  );
}