// frontend/src/app/dashboard/products/page.tsx

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product, Expense } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import ProductAddModal from "@/components/products/ProductAddModal";
import ExpenseAddModal from "@/components/products/ExpenseAddModal";
import ExpenseItem from "@/components/products/ExpenseItem";
import ProductExpenseRow from "@/components/products/ProductExpenseRow";
import AddExpenseToProductModal from "@/components/products/AddExpenseToProductModal";
import StockRow from "@/components/products/StockRow";

type Tab = "products" | "expenses" | "stock";

export default function ProductsPage() {
  const [products, setProducts]                       = useState<Product[]>([]);
  const [expenses, setExpenses]                       = useState<Expense[]>([]);
  const [loading, setLoading]                         = useState(true);
  const [activeTab, setActiveTab]                     = useState<Tab>("products");
  const [showProductModal, setShowProductModal]       = useState(false);
  const [showExpenseModal, setShowExpenseModal]       = useState(false);
  const [selectedProduct, setSelectedProduct]         = useState<Product | null>(null);

  async function fetchAll() {
    try {
      const [prodRes, expRes] = await Promise.all([
        api.get("/products/"),
        api.get("/products/expenses/"),
      ]);
      setProducts(prodRes.data);
      setExpenses(expRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  // ── Products ──────────────────────────────────────────
  function handleProductAdded(p: Product) {
    setProducts((prev) => [p, ...prev]);
    setShowProductModal(false);
  }

  async function handleProductDelete(id: number) {
    if (!confirm("Продуктту жок кылуу керекпи?")) return;
    try {
      await api.delete(`/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Жок кылуу мүмкүн болгон жок.");
    }
  }

  // ── Expenses ──────────────────────────────────────────
  function handleExpenseAdded(e: Expense) {
    setExpenses((prev) => [e, ...prev]);
    setShowExpenseModal(false);
  }

  async function handleExpenseDelete(id: number) {
    if (!confirm("Чыгымды жок кылуу керекпи?")) return;
    try {
      await api.delete(`/products/expenses/${id}/`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Жок кылуу мүмкүн болгон жок.");
    }
  }

  // ── Product ↔ Expense linking ─────────────────────────
  function handleProductUpdated(updated: Product) {
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setSelectedProduct(null);
  }

  async function handleRemoveExpenseFromProduct(productId: number, peId: number) {
    try {
      const res = await api.delete(`/products/${productId}/remove_expense/${peId}/`);
      setProducts((prev) => prev.map((p) => p.id === productId ? res.data : p));
    } catch {
      alert("Чыгымды өчүрүү мүмкүн болгон жок.");
    }
  }

  // ── Stock ─────────────────────────────────────────────
  function handleStockUpdated(updated: Product) {
    setProducts((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  }

  // ── Tab config ────────────────────────────────────────
  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: "Продукттар" },
    { key: "expenses", label: "Чыгымдар" },
    { key: "stock",    label: "Склад" },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Продукттар</h1>
        <p className="text-stone-500 text-sm mt-1">
          {products.length} продукт · {expenses.length} чыгым түрү
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.key
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          {/* ── TAB 1: Products ── */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-stone-500">{products.length} продукт катталган</p>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-amber-200 text-sm"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Продукт кошуу
                </button>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-amber-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-stone-700 font-semibold text-lg">Продукт жок</p>
                  <p className="text-stone-400 text-sm mt-1 mb-6">Биринчи продуктту кошуп баштаңыз</p>
                  <button onClick={() => setShowProductModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition">
                    Продукт кошуу
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} onDelete={handleProductDelete} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TAB 2: Expenses ── */}
          {activeTab === "expenses" && (
            <div className="space-y-8">

              {/* Section A: Expense types */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-stone-800">Чыгым түрлөрү</h2>
                    <p className="text-stone-400 text-xs mt-0.5">Кант, Ун, Май ж.б. — бир жолу кошулат, бардык продуктта колдонулат</p>
                  </div>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl transition shadow-sm shadow-amber-200 text-sm"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Чыгым кошуу
                  </button>
                </div>

                {expenses.length === 0 ? (
                  <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-stone-500 text-sm font-medium">Чыгым жок</p>
                    <p className="text-stone-400 text-xs mt-1">Кант, Ун сыяктуу чыгымдарды кошуңуз</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {expenses.map((e) => (
                      <ExpenseItem key={e.id} expense={e} onDelete={handleExpenseDelete} />
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-200" />

              {/* Section B: Link expenses to products */}
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-bold text-stone-800">Продукттарга чыгым кошуу</h2>
                  <p className="text-stone-400 text-xs mt-0.5">Ар бир продукт үчүн кандай чыгымдар кеткенин жазыңыз</p>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-10 bg-stone-50 rounded-2xl border border-stone-100">
                    <p className="text-stone-500 text-sm font-medium">Продукт жок</p>
                    <p className="text-stone-400 text-xs mt-1">Биринчи «Продукттар» өтмөгүнөн продукт кошуңуз</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {products.map((p) => (
                      <ProductExpenseRow
                        key={p.id}
                        product={p}
                        expenses={expenses}
                        onAddExpense={(prod) => setSelectedProduct(prod)}
                        onRemoveExpense={handleRemoveExpenseFromProduct}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: Stock ── */}
          {activeTab === "stock" && (
            <div>
              <div className="mb-5">
                <h2 className="text-base font-bold text-stone-800">Склад</h2>
                <p className="text-stone-400 text-xs mt-0.5">Ар бир продукттун учурдагы санын жаңыртыңыз</p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-24 bg-stone-50 rounded-2xl border border-stone-100">
                  <p className="text-stone-500 text-sm font-medium">Продукт жок</p>
                  <p className="text-stone-400 text-xs mt-1">«Продукттар» өтмөгүнөн продукт кошуңуз</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {products.map((p) => (
                    <StockRow key={p.id} product={p} onUpdated={handleStockUpdated} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showProductModal && (
        <ProductAddModal onClose={() => setShowProductModal(false)} onAdded={handleProductAdded} />
      )}
      {showExpenseModal && (
        <ExpenseAddModal onClose={() => setShowExpenseModal(false)} onAdded={handleExpenseAdded} />
      )}
      {selectedProduct && (
        <AddExpenseToProductModal
          product={selectedProduct}
          expenses={expenses}
          onClose={() => setSelectedProduct(null)}
          onUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
}