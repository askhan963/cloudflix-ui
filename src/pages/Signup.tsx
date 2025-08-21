import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema, type SignupSchemaType } from "../lib/validators";
import { useAuthStore } from "../store/auth";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { username: "", email: "", password: "", role: "consumer" },
  });

  const onSubmit = async (data: SignupSchemaType) => {
    try {
      await signup({
        username: data.username,
        email: data.email, // now REQUIRED
        password: data.password,
        role: data.role,
      });

      await Swal.fire({
        icon: "success",
        title: "Account created",
        text: "Welcome to CloudFlix!",
        confirmButtonColor: "#3B82F6", // secondary
      });

      navigate("/feed", { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Signup failed. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Signup failed",
        text: msg,
        confirmButtonColor: "#3B82F6",
      });
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-xl border border-neutral-dark bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            {...register("username")}
            className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            type="text"
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            type="email"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            {...register("password")}
            className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            type="password"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            {...register("role")}
            className="mt-1 w-full rounded border border-neutral-dark px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="creator">Creator</option>
            <option value="consumer">Consumer</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-secondary px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-primary/70">
        Already have an account?{" "}
        <Link to="/login" className="text-secondary hover:underline">
          Login
        </Link>
      </p>
    </section>
  );
}
