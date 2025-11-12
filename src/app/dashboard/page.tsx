"use client";

import React, { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { ProductResponse, SaleResponse } from "@/types/api";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalSales: number;
  totalRevenue: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sales, setSales] = useState<SaleResponse[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const [productsData, salesData] = await Promise.all([
        apiService.getAllProducts(),
        apiService.getAllSales(),
      ]);

      setProducts(productsData);
      setSales(salesData);

      const totalProducts = productsData.length;
      const lowStockProducts = productsData.filter(
        (p) => p.quantidade <= 5
      ).length;

      const totalSales = salesData.length;
      const totalRevenue = salesData.reduce(
        (sum, sale) =>
          sum + sale.precoNoMomentoDaVenda * sale.quantidadeVendida,
        0
      );

      setStats({
        totalProducts,
        lowStockProducts,
        totalSales,
        totalRevenue,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const lowStockProducts = products.filter((p) => p.quantidade <= 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu estoque e vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Produtos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Estoque Baixo
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.lowStockProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Vendas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalSales}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receita Total
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    R$ {stats.totalRevenue.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Produtos com Estoque Baixo
            </h3>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-md"
                >
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        Estoque: {product.quantidade} unidades
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      R$ {product.preco.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Resumo de Produtos
          </h3>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum produto cadastrado
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando seus primeiros produtos.
              </p>
              <div className="mt-6">
                <a
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Package className="-ml-1 mr-2 h-5 w-5" />
                  Adicionar Produto
                </a>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.slice(0, 5).map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        {product.imagem ? (
                          <img
                            className="h-10 w-10 rounded-lg object-cover mr-4"
                            src={product.imagem}
                            alt={product.nome}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {product.preco.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.statusProduto === "ATIVO"
                              ? "bg-green-100 text-green-800"
                              : product.statusProduto === "INATIVO"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.statusProduto === "ATIVO"
                            ? "Ativo"
                            : product.statusProduto === "INATIVO"
                            ? "Inativo"
                            : "Em Falta"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length > 5 && (
                <div className="px-6 py-3 bg-gray-50 text-center">
                  <a
                    href="/products"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Ver todos os produtos ({products.length})
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
