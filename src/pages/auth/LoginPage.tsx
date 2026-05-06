import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Zap } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async ({ email, password }: LoginForm) => {
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <Zap size={18} className="text-zinc-950" />
          </div>
          <span className="text-xl font-semibold text-zinc-100 tracking-tight">SmartLink</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h1 className="text-base font-semibold text-zinc-100 mb-1">Admin sign in</h1>
          <p className="text-xs text-zinc-500 mb-6">Access the SmartLink dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@smartlink.com"
              autoComplete="email"
              {...register('email', { required: true })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register('password', { required: true })}
            />

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
