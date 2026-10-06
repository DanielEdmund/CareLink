import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, ShoppingBag, Star, ShieldAlert } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import SmartImage from '@/components/ui/SmartImage'
import { DemoTag } from '@/components/ui/StatusBadge'
import { pharmacyProducts } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { formatNaira } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

/** Featured demo pharmacy products with a local-only cart. */
export default function PharmacySection() {
  const { addToCart, pending, cart } = useCareLink()
  const featured = pharmacyProducts.slice(0, 4)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <section aria-labelledby="pharmacy-section-heading">
      <SectionHeading
        id="pharmacy-section-heading"
        eyebrow="Demo pharmacy"
        title="Everyday essentials"
        subtitle="All prices are demo prices. Adding items only changes local prototype state — no order is placed."
        action={
          <Link to="/pharmacy" className="cl-btn cl-btn-secondary cl-btn-sm">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            {cartCount > 0 ? `Cart (${cartCount})` : 'Open pharmacy'}
          </Link>
        }
      />

      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product, i) => (
          <motion.li
            key={product.id}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            custom={i}
            className="cl-card cl-card-hover flex flex-col overflow-hidden"
          >
            <div className="relative h-32 bg-brand-blue-soft">
              <SmartImage
                src={product.image}
                alt={`${product.name} — sample product photo`}
                rounded="rounded-none"
                className="h-32"
                imgClassName="h-full w-full object-cover"
              />
              <span className="absolute left-2 top-2">
                <DemoTag>Sample item</DemoTag>
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-3.5">
              <div>
                <h3 className="text-[14px] font-bold leading-snug text-brand-navy">{product.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-[12px] text-brand-slate">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {product.rating} ({product.reviews}) · {product.category}
                </p>
              </div>
              <p className="text-sm font-extrabold text-brand-navy">
                {formatNaira(product.price)}
                <span className="ml-1.5 text-[10px] font-bold uppercase text-status-warning">Demo price</span>
              </p>
              <div className="mt-auto">
                {!product.inStock ? (
                  <p className="rounded-lg bg-slate-100 px-3 py-2 text-center text-[12px] font-semibold text-brand-slate">
                    Out of stock (demo)
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={pending[`cart:${product.id}`]}
                    className="cl-btn cl-btn-primary cl-btn-sm w-full"
                    aria-label={`Add ${product.name} to demo cart`}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    {pending[`cart:${product.id}`] ? 'Adding…' : 'Add to demo cart'}
                  </button>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <p className="cl-safety-note mt-4">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          Products shown are sample listings only. CareLink does not sell, dispense or recommend
          medicines. Always speak to a qualified healthcare professional about real medication.
        </span>
      </p>
    </section>
  )
}
