import RegisterForm from "@/components/auth/RegisterForm";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-3xl font-bold">新規登録</h1>
      <RegisterForm />
    </main>
  );
}
