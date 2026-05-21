import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  const toast = ({ title, description, variant }: ToastProps) => {
    if (variant === 'destructive') {
      return sonnerToast.error(title, {
        description,
      });
    }
    return sonnerToast.success(title, {
      description,
    });
  };

  return { toast };
}