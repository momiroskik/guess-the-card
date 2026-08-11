import { TrickGame } from '@/domains/trick/components/TrickGame';
import { Footer } from '@/shared/ui/Footer';

export default function HomePage() {
  return (
    <div className="shell mx-auto w-full max-w-3xl">
      <div className="ambience" aria-hidden="true" />
      <TrickGame />
      <Footer />
    </div>
  );
}
