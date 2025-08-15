"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { ...values, redirect: false });
    setLoading(false);
    if (!res) {
      setError("不明なエラーが発生しました");
      return;
    }
    if (res.error) {
      setError("メールまたはパスワードが正しくありません");
      return;
    }
    router.push("/");
    router.refresh();
  });

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
        </div>
        <div>
          <Label>パスワード</Label>
          <Input
            type="password"
            placeholder="******"
            {...register("password")}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "ログイン中..." : "ログイン"}
        </Button>
      </form>

      <div className="flex items-center gap-2">
        <div className="h-px w-full bg-gray-200" />
        <span className="text-xs text-gray-500">または</span>
        <div className="h-px w-full bg-gray-200" />
      </div>

      <div className="grid gap-2">
        <Button variant="outline" onClick={() => signIn("google")}>
          Googleでログイン
        </Button>
        <Button variant="outline" onClick={() => signIn("twitter")}>
          Twitterでログイン
        </Button>
      </div>
    </div>
  );
}
