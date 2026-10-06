import { useMemo, useState } from 'react'
import { Search, ShoppingBag, Plus, Minus, Trash2, Star, ShieldAlert, PackageCheck, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from '@/components/ui/SectionHeading'
import FilterChip from '@/components/ui/FilterChip'
import SmartImage from '@/components/ui/SmartImage'
import EmptyState from '@/components/ui/EmptyState'
import SafetyNotice from '@/components/ui/SafetyNotice'
import CareLinkButton from '@/components/ui/CareLinkButton'
import { DemoTag } from '@/components/ui/StatusBadge'
import { pharmacyProducts, pharmacyCategories } from '@/data/mockData'
import { useCareLink } from '@/context/CareLinkContext'
import { formatNaira, cn } from '@/lib/utils'
import { fadeUp, scaleIn, EASE } from '@/lib/motion'

/** Demo pharmacy: browsable sample products with a purely local cart. */
export default function Pharmacy() {
  const { cart, addToCart, updateCartQty, clearCart, checkoutCart, orders, pending } = useCareLink()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return pharmacyProducts.filter((p) => {
      const inCategory = category === 'All' || p.category === category
      const inQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      return inCategory && inQuery
    })
  }, [category, query])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const delivery = cart.length ? 1500 : 0 // demo delivery fee
  const total = subtotal + delivery

  const cartPanel = (
    <div className="cl-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
        <p className="flex items-center gap-2 text-sm font-bold text-brand-navy">
          <ShoppingBag className="h-4 w-4 text-brand-blue" aria-hidden="true" />
          Demo cart ({cart.reduce((s, i) => s + i.qty, 0)})
        </p>
        {cart.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold text-brand-slate hover:bg-slate-100 hover:text-status-emergency"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-blue-soft">
            <ShoppingBag className="h-7 w-7 text-brand-blue" aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-semibold text-brand-navy">Your demo cart is empty</p>
          <p className="mt-1 text-[13px] text-brand-slate">
            Add sample products to see how the checkout flow behaves.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-3 p-3.5">
                    <SmartImage
                      src={item.image}
                      alt={`${item.name} sample photo`}
                      rounded="rounded-xl"
                      className="h-14 w-14 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold text-brand-navy">{item.name}</p>
                      <p className="text-[13px] font-semibold text-brand-blue">
                        {formatNaira(item.price)}
                        <span className="ml-1 text-[10px] font-bold uppercase text-status-warning">Demo</span>
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => updateCartQty(item.id, item.qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-brand-slate transition hover:border-brand-blue hover:text-brand-blue"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold tabular-nums text-brand-navy" aria-live="polite">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => updateCartQty(item.id, item.qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-brand-slate transition hover:border-brand-blue hover:text-brand-blue"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from demo cart`}
                          onClick={() => updateCartQty(item.id, 0)}
                          className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-brand-slate transition hover:bg-[#FEF3F2] hover:text-status-emergency"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="space-y-1.5 border-t border-slate-100 p-4 text-[13px]">
            <div className="flex justify-between text-brand-slate">
              <span>Subtotal (demo)</span>
              <span className="font-semibold text-brand-navy">{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-brand-slate">
              <span>Simulated delivery</span>
              <span className="font-semibold text-brand-navy">{formatNaira(delivery)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-bold text-brand-navy">
              <span>Total (demo price)</span>
              <span>{formatNaira(total)}</span>
            </div>

            <CareLinkButton
              className="mt-3 w-full"
              size="lg"
              loading={pending.checkoutCart}
              loadingText="Creating demo order…"
              icon={PackageCheck}
              onClick={checkoutCart}
            >
              Place demo order
            </CareLinkButton>
            <p className="cl-help text-center">
              No payment is taken. This never charges anyone or ships anything.
            </p>
          </div>
        </>
      )}

      {orders.length > 0 && (
        <div className="border-t border-slate-100 bg-brand-mint p-4">
          <p className="text-[13px] font-bold text-[#08615E]">Latest demo order</p>
          <p className="text-[13px] text-[#08615E]/90">Reference {orders[0].id}</p>
          <p className="mt-1 text-[12px] text-[#08615E]/80">
            Simulated only — no order will be delivered.
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="cl-page space-y-6">
      <SectionHeading
        eyebrow="Sample store"
        title="Pharmacy"
        subtitle="Everyday items listed at demo prices. Adding to the cart only changes local prototype state."
        action={
          <div className="relative">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="cl-btn cl-btn-secondary lg:hidden"
              aria-label="Open demo cart"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Cart ({cart.reduce((s, i) => s + i.qty, 0)})
            </button>
          </div>
        }
      />

      <div className="flex items-start gap-3">
        <div className="hidden w-[320px] shrink-0 lg:block">
          <div className="sticky top-24 space-y-4">{cartPanel}</div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="cl-card space-y-3 p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sample products…"
                aria-label="Search demo pharmacy products"
                className="cl-input pl-11"
              />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {pharmacyCategories.map((c) => (
                <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </FilterChip>
              ))}
            </div>
            <p aria-live="polite" className="text-[13px] font-semibold text-brand-slate">
              {results.length} sample product{results.length === 1 ? '' : 's'}
            </p>
          </div>

          {results.length === 0 ? (
            <EmptyState
              title="No sample products found"
              body="Try another category or clear your search to browse the demo catalogue."
              icon={Search}
              cta={{ label: 'Reset search' }}
              action={() => {
                setQuery('')
                setCategory('All')
              }}
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product, i) => (
                <motion.li
                  key={product.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  custom={i}
                  className="cl-card cl-card-hover flex flex-col overflow-hidden"
                >
                  <div className="relative h-36 bg-brand-blue-soft">
                    <SmartImage
                      src={product.image}
                      alt={`${product.name} — sample product photo`}
                      rounded="rounded-none"
                      className="h-36"
                      imgClassName="h-full w-full object-cover"
                    />
                    <span className="absolute left-2 top-2">
                      <DemoTag>Sample item</DemoTag>
                    </span>
                    {!product.inStock && (
                      <span className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[11px] font-bold text-brand-slate">
                        Out of stock
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wide text-brand-aqua">
                        {product.category}
                      </p>
                      <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-brand-navy">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 flex items-center gap-1 text-[12px] text-brand-slate">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {product.rating} ({product.reviews} sample reviews) · {product.brand}
                      </p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-brand-slate">{product.blurb}</p>
                    </div>

                    {product.requiresRx && (
                      <p className="rounded-lg bg-[#FFFAEB] px-2.5 py-1.5 text-[11px] font-semibold text-[#B54708]">
                        Demo prescription check required — simulated only
                      </p>
                    )}

                    <div className="mt-auto flex items-end justify-between gap-3 pt-1">
                      <p className="text-base font-extrabold text-brand-navy">
                        {formatNaira(product.price)}
                        <span className="ml-1.5 block text-[10px] font-bold uppercase text-status-warning">
                          Demo price
                        </span>
                      </p>
                      <CareLinkButton
                        size="sm"
                        variant="primary"
                        disabled={!product.inStock}
                        loading={pending[`cart:${product.id}`]}
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to demo cart`}
                      >
                        {product.inStock ? 'Add to cart' : 'Unavailable'}
                      </CareLinkButton>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}

          <SafetyNotice title="No real pharmacy" icon={ShieldAlert}>
            CareLink does not sell medicines or take payments. Product names, prices and stock are
            invented for demonstration. Never change real medication without speaking to a
            qualified healthcare professional.
          </SafetyNotice>
        </div>
      </div>

      {/* Mobile cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-navy/50"
              onClick={() => setCartOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-4"
              role="dialog"
              aria-label="Demo cart"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-brand-navy">Your demo cart</p>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close demo cart"
                  className="grid h-10 w-10 place-items-center rounded-xl text-brand-slate hover:bg-slate-100"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {cartPanel}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
