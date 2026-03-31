import { Star, Users, TrendingUp } from "lucide-react";
import type { GeneratedReview } from "@/lib/review-generator";

interface LeadSiteSocialProofProps {
  reviews: GeneratedReview[];
  colors: {
    accent: string;
    secondary: string;
  };
  salesStat?: string;
}

const LeadSiteSocialProof = ({ reviews, colors, salesStat }: LeadSiteSocialProofProps) => {
  return (
    <section className="py-16 px-5 md:px-8 lg:px-16 max-w-5xl mx-auto">
      {/* Stats bar */}
      {salesStat && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-sm"
            style={{ backgroundColor: `hsl(${colors.secondary})`, color: `hsl(${colors.accent})` }}>
            <Users className="w-4 h-4" />
            {salesStat}
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold shadow-sm"
            style={{ backgroundColor: `hsl(${colors.secondary})`, color: `hsl(${colors.accent})` }}>
            <TrendingUp className="w-4 h-4" />
            Aumento de contatos pelo Google
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <p
          className="uppercase text-xs tracking-[0.2em] font-medium mb-3"
          style={{ color: `hsl(${colors.accent})` }}
        >
          Avaliações reais
        </p>
        <h2 className="salon-heading mb-4">O que nossos clientes dizem</h2>
        <div
          className="w-16 h-0.5 mx-auto mb-4"
          style={{ backgroundColor: `hsl(${colors.accent})` }}
        />
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5"
              style={{ fill: `hsl(${colors.accent})`, color: `hsl(${colors.accent})` }}
            />
          ))}
          <span className="text-muted-foreground text-sm font-medium ml-2">
            5.0 no Google
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="rounded-xl p-6 shadow-sm border border-border/50"
            style={{ backgroundColor: `hsl(${colors.secondary})` }}
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  style={{ fill: `hsl(${colors.accent})`, color: `hsl(${colors.accent})` }}
                />
              ))}
            </div>
            <p className="text-foreground text-sm leading-relaxed mb-4 italic">
              "{r.text}"
            </p>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              — {r.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeadSiteSocialProof;
