import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "../lib/validators";
import { useAuthStore } from "../store/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location.state?.redirectTo || "/feed";

  const { login, loading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { usernameOrEmail: "", password: "" },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login(data);
      navigate(redirectTo, { replace: true });
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Login failed"); // replace with toast()
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-neutral-dark bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Username or Email</label>
          <input
            {...register("usernameOrEmail")}
            className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            type="text"
          />
          {errors.usernameOrEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.usernameOrEmail.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password")}
            className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            type="password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-secondary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-primary/70">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-secondary hover:underline">
          Sign up
        </Link>
      </p>
    </section>
  );
}
