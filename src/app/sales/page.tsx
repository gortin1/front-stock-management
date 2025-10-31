"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiService } from "@/services/api";
import { ProductResponse, SaleRequest, SaleResponse } from "@/types/api";
import { ShoppingCart, Plus, Package, DollarSign } from "lucide-react";

const saleSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantidade: z.number().int().min(1, "Quantidade deve ser pelo menos 1"),
});

type SaleFormData = z.infer<typeof saleSchema>;

const SalesPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  });

  const selectedProductId = watch("productId");
  const selectedProduct = products.find(
    (p) => p.id === Number(selectedProductId)
  );
  const selectedQuantity = watch("quantidade");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, salesData] = await Promise.all([
        apiService.getAllProducts(),
        apiService.getAllSales(),
      ]);
      setProducts(productsData.filter((p) => p.status));
      setSales(salesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async (data: SaleFormData) => {
    try {
      setError("");
      setSuccess("");

      const saleData: SaleRequest = {
        productId: data.productId,
        quantidade: data.quantidade,
      };

      const newSale = await apiService.createSale(saleData);

      await loadData();

      setSales((prev) => [newSale, ...prev]);

      setSuccess("Venda realizada com sucesso!");
      handleCloseModal();
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao realizar venda");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setError("");
    setSuccess("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + sale.precoNoMomentoDaVenda * sale.quantidadeVendida,
    0
  );
  const totalSales = sales.length;
  const totalItemsSold = sales.reduce(
    (sum, sale) => sum + sale.quantidadeVendida,
    0
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="text-gray-600">
            Gerencie suas vendas e acompanhe o desempenho
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Nova Venda
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    {totalSales}
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
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Itens Vendidos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalItemsSold}
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
                    R$ {totalRevenue.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Histórico de Vendas
          </h3>

          {sales.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma venda realizada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece realizando sua primeira venda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unitário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.produtoNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantidadeVendida}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {sale.precoNoMomentoDaVenda.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        R${" "}
                        {(
                          sale.precoNoMomentoDaVenda * sale.quantidadeVendida
                        ).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(sale.dataDaVenda)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nova Venda
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Produto
                  </label>
                  <select
                    {...register("productId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.nome} - R$ {product.preco.toFixed(2)} (Estoque:{" "}
                        {product.quantidade})
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.productId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.quantidade || 1}
                    {...register("quantidade", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="1"
                  />
                  {errors.quantidade && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.quantidade.message}
                    </p>
                  )}
                  {selectedProduct && (
                    <p className="mt-1 text-sm text-gray-500">
                      Estoque disponível: {selectedProduct.quantidade} unidades
                    </p>
                  )}
                </div>

                {selectedProduct && selectedQuantity && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Resumo da Venda
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Produto:</span>
                        <span>{selectedProduct.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preço unitário:</span>
                        <span>R$ {selectedProduct.preco.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <span>{selectedQuantity}</span>
                      </div>
                      <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                        <span>Total:</span>
                        <span>
                          R${" "}
                          {(selectedProduct.preco * selectedQuantity).toFixed(
                            2
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !selectedProduct || !selectedQuantity
                    }
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processando..." : "Confirmar Venda"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;
