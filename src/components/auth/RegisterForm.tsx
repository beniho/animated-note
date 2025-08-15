"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    displayName: z.string().min(1).max(100).optional(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(
    async ({ email, username, displayName, password }) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, displayName, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg = body?.error || `登録に失敗しました (HTTP ${res.status})`;
          setError(msg);
          setLoading(false);
          return;
        }
        // 成功時は自動ログイン
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        setLoading(false);
        if (signInRes && !signInRes.error) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/login");
        }
      } catch (e) {
        setLoading(false);
        setError("ネットワークエラーが発生しました");
      }
    }
  );

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <Label>メールアドレス</Label>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label>ユーザー名</Label>
          <Input
            type="text"
            placeholder="your_username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-red-600">{errors.username.message}</p>
          )}
        </div>
        <div>
          <Label>表示名（任意）</Label>
          <Input
            type="text"
            placeholder="Your Name"
            {...register("displayName")}
          />
          {errors.displayName && (
            <p className="text-xs text-red-600">{errors.displayName.message}</p>
          )}
        </div>
        <div>
          <Label>パスワード</Label>
          <Input
            type="password"
            placeholder="******"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <div>
          <Label>パスワード（確認）</Label>
          <Input
            type="password"
            placeholder="******"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "登録中..." : "登録"}
        </Button>
      </form>
    </div>
  );
}
