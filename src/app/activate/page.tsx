"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

const activateSchema = z.object({
  celular: z.string().min(10, "Celular deve ter no mínimo 10 dígitos"),
  codigoAtivacao: z.string().min(1, "Código de ativação é obrigatório"),
});

type ActivateFormData = z.infer<typeof activateSchema>;

const ActivatePage: React.FC = () => {
  const router = useRouter();
  const [activateError, setActivateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateFormData>({
    resolver: zodResolver(activateSchema),
  });

  const onSubmit = async (data: ActivateFormData) => {
    try {
      setIsLoading(true);
      setActivateError("");

      const apiData = {
        celular: `+55${data.celular}`,
        codigoAtivacao: data.codigoAtivacao,
      };
      await apiService.activateSeller(apiData);

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error: any) {
      setActivateError(
        error.response?.data?.message ||
          "Erro ao ativar conta. Verifique o código e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Conta ativada com sucesso!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sua conta foi ativada. Redirecionando para o login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Ativar sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite o código de ativação que foi enviado para seu WhatsApp
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="celular"
                className="block text-sm font-medium text-gray-700"
              >
                Celular
              </label>
              <input
                {...register("celular")}
                type="text"
                inputMode="tel"
                autoComplete="tel"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite seu celular"
              />
              {errors.celular && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.celular.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="codigoAtivacao"
                className="block text-sm font-medium text-gray-700"
              >
                Código de Ativação
              </label>
              <input
                {...register("codigoAtivacao")}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o código de ativação"
              />
              {errors.codigoAtivacao && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.codigoAtivacao.message}
                </p>
              )}
            </div>
          </div>

          {activateError && (
            <div className="flex items-center space-x-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <>
                <span>{activateError}</span>
              </>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Ativando..." : "Ativar conta"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivatePage;
