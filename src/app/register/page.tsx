"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Package } from "lucide-react";
import { validateCnpj, formatCnpj, cleanCnpj } from "@/utils/cnpj";
import {
  validateCelular,
  formatCelular,
  cleanCelular,
  formatCelularToE164,
} from "@/utils/celular";
import { validateEmailComplete, normalizeEmail } from "@/utils/email";

const registerSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    cnpj: z
      .string()
      .min(1, "CNPJ é obrigatório")
      .refine((cnpj) => {
        const cleaned = cleanCnpj(cnpj);
        return cleaned.length === 14;
      }, "CNPJ deve ter 14 dígitos")
      .refine((cnpj) => validateCnpj(cnpj), "CNPJ inválido"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .refine((email) => validateEmailComplete(email), "Email inválido"),
    celular: z
      .string()
      .min(1, "Celular é obrigatório")
      .refine((celular) => {
        const cleaned = cleanCelular(celular);
        return cleaned.length === 10 || cleaned.length === 11;
      }, "Celular deve ter 10 ou 11 dígitos")
      .refine((celular) => validateCelular(celular), "Celular inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmSenha, {
    message: "Senhas não coincidem",
    path: ["confirmSenha"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const cnpjValue = watch("cnpj");
  const celularValue = watch("celular");
  const emailValue = watch("email");

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCnpj(e.target.value);
    setValue("cnpj", formatted);
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCelular(e.target.value);
    setValue("celular", formatted);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeEmail(e.target.value);
    setValue("email", normalized);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setRegisterError("");

      const { confirmSenha, ...sellerData } = data;
      // Remove formatação do CNPJ e celular antes de enviar para a API
      const cleanedData = {
        ...sellerData,
        cnpj: cleanCnpj(sellerData.cnpj),
        celular: formatCelularToE164(sellerData.celular),
        email: normalizeEmail(sellerData.email),
      };
      await apiService.createSeller(cleanedData);

      setSuccess(true);
      setTimeout(() => {
        router.push("/activate");
      }, 2000);
    } catch (error: any) {
      setRegisterError(
        error.response?.data?.message || "Erro ao criar conta. Tente novamente."
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
            <Package className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Conta criada com sucesso!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Um código de ativação foi enviado para seu WhatsApp.
              Redirecionando para a página de ativação...
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              faça login aqui
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <input
                {...register("nome")}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite seu nome"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cnpj"
                className="block text-sm font-medium text-gray-700"
              >
                CNPJ
              </label>
              <input
                {...register("cnpj")}
                type="text"
                maxLength={18}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="00.000.000/0000-00"
                onChange={handleCnpjChange}
              />
              {errors.cnpj && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.cnpj.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="exemplo@email.com"
                onChange={handleEmailChange}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                maxLength={20}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+55 (11) 99999-9999"
                onChange={handleCelularChange}
              />
              {errors.celular && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.celular.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="senha"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("senha")}
                  type={showPassword ? "text" : "password"}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.senha.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmSenha"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Senha
              </label>
              <div className="mt-1 relative">
                <input
                  {...register("confirmSenha")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmSenha && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmSenha.message}
                </p>
              )}
            </div>
          </div>

          {registerError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {registerError}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
