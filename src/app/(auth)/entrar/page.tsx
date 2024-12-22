"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScissorsIcon } from "lucide-react";
import { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <ScissorsIcon className="h-12 w-12 text-[#ff9900]" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Entrar no Alinhavo" : "Criar conta no Alinhavo"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Entre com seu email e senha para acessar sua conta"
              : "Crie sua conta para começar a usar o Alinhavo"}
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              formAction={isLogin ? login : signup}
            >
              {isLogin ? "Entrar" : "Criar conta"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <Button
                variant="link"
                className="pl-1 underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Criar conta" : "Entrar"}
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
