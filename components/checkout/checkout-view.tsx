"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag, ChevronRight, Truck, MapPin, User, Phone, Mail,
    CheckCircle2, CreditCard, Landmark, Package, Lock, ArrowLeft, Loader2, Tag, X,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useCart } from "../../lib/context/cart-context";
import { StripeCheckout } from "./stripe-checkout";

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
};

type PaymentMethod = "card" | "cod" | "paypal";
type CheckoutStep = "cart-review" | "delivery" | "payment" | "success";

const STEPS = [
    { id: "cart-review", label: "Panier", icon: ShoppingBag },
    { id: "delivery", label: "Livraison", icon: Truck },
    { id: "payment", label: "Paiement", icon: CreditCard },
];

const PAYMENT_OPTIONS = [
    {
        id: "card" as PaymentMethod,
        label: "Carte bancaire",
        description: "Visa, Mastercard, CIH, Attijariwafa...",
        icon: CreditCard,
    },
    {
        id: "cod" as PaymentMethod,
        label: "Paiement à la livraison",
        description: "Payez en cash lors de la réception",
        icon: Package,
    },
    {
        id: "paypal" as PaymentMethod,
        label: "PayPal",
        description: "Paiement sécurisé via PayPal",
        icon: Landmark,
    },
];

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
    "Meknès", "Oujda", "Kénitra", "Tétouan", "El Jadida", "Nador",
    "Safi", "Mohammedia", "Béni Mellal", "Khouribga",
];

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: string }) {
    const stepIds = STEPS.map((s) => s.id);
    const currentIdx = stepIds.indexOf(current);

    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((step, idx) => {
                const done = idx < currentIdx;
                const active = idx === currentIdx;
                const Icon = step.icon;
                return (
                    <div key={step.id} className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 ${active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground"}`}>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${done ? "border-emerald-500 bg-emerald-50" : active ? "border-primary bg-primary/10" : "border-muted-foreground/30 bg-muted/30"
                                }`}>
                                {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Icon className="h-4 w-4" />}
                            </div>
                            <span className={`text-sm font-semibold hidden sm:block ${active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground"}`}>
                                {step.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={`h-px w-8 sm:w-16 ${done ? "bg-emerald-400" : "bg-muted-foreground/20"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({
    compact = false,
    onPromoChange,
}: {
    compact?: boolean;
    onPromoChange?: (discountAmount: number) => void;
}) {
    const { items, totalPrice } = useCart();

    const [code, setCode] = useState("");
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [promoData, setPromoData] = useState<{ discount: number; type: string } | null>(null);
    const [promoError, setPromoError] = useState("");
    const [promoLoading, setPromoLoading] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => { fetch("/api/settings").then(r => r.json()).then(d => setSettings(d)); }, []);

    const discountAmount = promoData
        ? promoData.type === "percent"
            ? Math.round(totalPrice * promoData.discount / 100)
            : Math.min(promoData.discount, totalPrice)
        : 0;
    const discountedSubtotal = totalPrice - discountAmount;

    const freeAbove = Number(settings?.livraison?.freeAbove ?? 500);
    const standardCost = Number(settings?.livraison?.standardCost ?? 35);
    const shipping = discountedSubtotal >= freeAbove ? 0 : standardCost;
    const grandTotal = discountedSubtotal + shipping;

    const applyCode = async () => {
        const upper = code.trim().toUpperCase();
        if (!upper) return;
        setPromoLoading(true);
        try {
            const res = await fetch(`/api/promo?code=${encodeURIComponent(upper)}`);
            const data = await res.json();
            if (data.valid) {
                setAppliedCode(upper);
                setPromoData({ discount: data.discount, type: data.type });
                setPromoError("");
                setCode("");
                const disc = data.type === "percent"
                    ? Math.round(totalPrice * data.discount / 100)
                    : Math.min(data.discount, totalPrice);
                onPromoChange?.(disc);
            } else {
                setPromoError(data.error ?? "Code invalide ou expiré.");
            }
        } catch {
            setPromoError("Erreur de vérification.");
        }
        setPromoLoading(false);
    };

    const removeCode = () => {
        setAppliedCode(null);
        setPromoData(null);
        setPromoError("");
        onPromoChange?.(0);
    };

    return (
        <div className={`bg-card rounded-2xl border ${compact ? "p-4" : "p-6"} space-y-4`}>
            <h3 className="font-bold text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Récapitulatif de commande
                <span className="ml-auto text-sm text-muted-foreground font-normal">
                    {items.reduce((s, i) => s + i.quantity, 0)} article(s)
                </span>
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => {
                    const price = item.product.salePrice ?? item.product.price;
                    const rawImg = item.product.image || (Array.isArray(item.product.images) ? item.product.images[0] : (typeof item.product.images === "string" ? (() => { try { return JSON.parse(item.product.images)[0] || ""; } catch { return ""; } })() : ""));
                    const isBase64 = rawImg && typeof rawImg === "string" && (rawImg.startsWith("data:") || rawImg.length > 500);
                    const imageSrc = rawImg;
                    return (
                        <div key={item.product.id} className="flex items-center gap-3">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border flex items-center justify-center">
                                    {imageSrc ? (
                                        <img 
                                            src={imageSrc} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover" 
                                        />                                    ) : (
                                        <span className="text-lg font-bold text-slate-400">{item.product.name[0]}</span>
                                    )}
                                </div>
                                <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-primary truncate">{item.product.brand}</p>
                                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                            </div>
                            <p className="text-sm font-bold shrink-0">{(price * item.quantity)} Dhs</p>
                        </div>
                    );
                })}
            </div>

            <Separator />

            {/* ── Code promo ── */}
            {!appliedCode ? (
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Code promo"
                                value={code}
                                onChange={(e) => { setCode(e.target.value.toUpperCase()); setPromoError(""); }}
                                onKeyDown={(e) => e.key === "Enter" && applyCode()}
                                className="pl-9 h-9 text-sm uppercase tracking-widest"
                                id="promo-code-input"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={applyCode}
                            disabled={promoLoading}
                            className="h-9 px-4 shrink-0"
                            id="promo-code-apply"
                        >
                            {promoLoading ? "..." : "Appliquer"}
                        </Button>
                    </div>
                    {promoError && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-xs text-destructive flex items-center gap-1">
                            <span>✗</span> {promoError}
                        </motion.p>
                    )}
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 text-emerald-700">
                        <Tag className="h-4 w-4 shrink-0" />
                        <div>
                            <p className="text-xs font-bold tracking-widest">{appliedCode}</p>
                            <p className="text-[10px] text-emerald-600">
                                {promoData?.type === "percent" ? `-${promoData.discount}%` : `-${promoData?.discount} MAD`}
                            </p>
                        </div>
                    </div>
                    <button onClick={removeCode} className="text-emerald-500 hover:text-destructive transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </motion.div>
            )}

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Sous-total</span>
                    <span>{totalPrice} Dhs</span>
                </div>
                {discountAmount > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex justify-between text-emerald-600 font-semibold">
                        <span>Réduction ({promoData?.discount}%)</span>
                        <span>-{discountAmount} Dhs</span>
                    </motion.div>
                )}
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                        {shipping === 0 ? <><FontAwesomeIcon icon={faGift} className="mr-1 text-emerald-600" />Gratuite</> : `${shipping} Dhs`}
                    </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base pt-1">
                    <span>Total TTC</span>
                    <span className="text-primary text-lg">{grandTotal} Dhs</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <Lock className="h-3 w-3" />
                Paiement 100% sécurisé & crypté
            </div>
        </div>
    );
}

// ─── Main Checkout View ───────────────────────────────────────────────────────
export function CheckoutView() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<CheckoutStep>("cart-review");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [isPlacing, setIsPlacing] = useState(false);
    const [form, setForm] = useState<FormData>({
        firstName: "", lastName: "", email: "", phone: "",
        address: "", city: "", postalCode: "", notes: "",
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [settings, setSettings] = useState<any>(null);

    const freeAbove = Number(settings?.livraison?.freeAbove ?? 500);
    const standardCost = Number(settings?.livraison?.standardCost ?? 35);

    const shipping = totalPrice >= freeAbove ? 0 : standardCost;
    const grandTotal = totalPrice + shipping;

    useEffect(() => {
        setMounted(true);
        fetch("/api/settings").then(r => r.json()).then(d => setSettings(d));
    }, []);

    useEffect(() => {
        if (mounted && items.length === 0 && step !== "success") {
            router.push("/shop");
        }
    }, [mounted, items.length]);

    const updateForm = (field: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validateDelivery = (): boolean => {
        const newErrors: Partial<FormData> = {};
        if (!form.firstName.trim()) newErrors.firstName = "Prénom requis";
        if (!form.lastName.trim()) newErrors.lastName = "Nom requis";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email invalide";
        if (!form.phone.trim() || form.phone.length < 10) newErrors.phone = "Téléphone invalide";
        if (!form.address.trim()) newErrors.address = "Adresse requise";
        if (!form.city.trim()) newErrors.city = "Ville requise";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        setIsPlacing(true);
        try {
            const orderItems = items.map((item) => ({
                productId: String(item.product.id),
                quantity: item.quantity,
                price: item.product.salePrice ?? item.product.price,
            }));

            const currentShipping = totalPrice >= freeAbove ? 0 : standardCost;

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: orderItems,
                    totalAmount: totalPrice + currentShipping,
                    paymentMethod: paymentMethod === "cod" ? "Paiement à la livraison" : paymentMethod === "paypal" ? "PayPal" : "Carte bancaire",
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                }),
            });

            if (!res.ok) throw new Error("Erreur commande");
            clearCart();
            setStep("success");
        } catch {
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsPlacing(false);
        }
    };

    if (!mounted) return null;
    if (items.length === 0 && step !== "success") return null;

    // ── Success Screen ─────────────────────────────────────────────────────────
    if (step === "success") {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="mx-auto w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center"
                    >
                        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">Commande confirmée !</h1>
                        <p className="text-muted-foreground">
                            Merci {form.firstName} ! Votre commande a été passée avec succès.
                            Vous recevrez une confirmation à <strong>{form.email || "votre adresse email"}</strong>.
                        </p>
                    </div>

                    <div className="bg-card rounded-2xl border p-5 space-y-3 text-sm text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Préparation en cours</p>
                                <p className="text-xs text-muted-foreground">Votre commande est en cours de préparation</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Truck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">Livraison estimée</p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-MA", {
                                        weekday: "long", day: "numeric", month: "long",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Button size="lg" asChild>
                            <Link href="/shop">Continuer mes achats</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/">Retour à l&apos;accueil</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Main Checkout Layout ───────────────────────────────────────────────────
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <Link href="/" className="hover:text-primary">Accueil</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/shop" className="hover:text-primary">Boutique</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Commander</span>
            </nav>

            <h1 className="text-3xl font-extrabold tracking-tight mb-8">Finaliser ma commande</h1>
            <StepIndicator current={step} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* ── Left Panel ── */}
                <div className="lg:col-span-3 space-y-6">
                    <AnimatePresence mode="wait">
                        {/* STEP 1: Cart Review */}
                        {step === "cart-review" && (
                            <motion.div key="cart-review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="bg-card rounded-2xl border p-6 space-y-4">
                                    <h2 className="font-bold text-xl flex items-center gap-2">
                                        <ShoppingBag className="h-5 w-5 text-primary" /> Vérifiez votre panier
                                    </h2>
                                    <div className="space-y-3">
                                        {items.map((item) => {
                                            const price = item.product.salePrice ?? item.product.price;
                                            const rawImg2 = item.product.image || (Array.isArray(item.product.images) ? item.product.images[0] : (typeof item.product.images === "string" ? (() => { try { return JSON.parse(item.product.images)[0] || ""; } catch { return ""; } })() : ""));
                                            const isBase642 = rawImg2 && typeof rawImg2 === "string" && (rawImg2.startsWith("data:") || rawImg2.length > 500);
                                            const imgSrc2 = rawImg2;
                                            return (
                                                <div key={item.product.id} className="flex gap-4 py-3 border-b last:border-b-0">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border shrink-0 flex items-center justify-center">
                                                        {imgSrc2 ? (
                                                        <img 
                                            src={imgSrc2} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover" 
                                        />                                                        ) : (
                                                            <span className="text-xl font-bold text-slate-400">{item.product.name[0]}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-primary">{item.product.brand}</p>
                                                        <p className="font-semibold line-clamp-2 text-sm">{item.product.name}</p>
                                                        <p className="text-sm text-muted-foreground mt-1">Qté : {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">{(price * item.quantity)} Dhs</p>
                                                        {item.product.salePrice && (
                                                            <p className="text-xs text-muted-foreground line-through">{item.product.price * item.quantity} Dhs</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Button className="w-full h-12 gap-2 shadow-md shadow-primary/20" onClick={() => setStep("delivery")}>
                                        Continuer vers la livraison <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" className="w-full gap-2 text-muted-foreground" asChild>
                                        <Link href="/shop"><ArrowLeft className="h-4 w-4" /> Modifier le panier</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Delivery */}
                        {step === "delivery" && (
                            <motion.div key="delivery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="bg-card rounded-2xl border p-6 space-y-6">
                                    <h2 className="font-bold text-xl flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" /> Adresse de livraison
                                    </h2>

                                    {/* Name */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Prénom *</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="firstName" placeholder="Mohamed" value={form.firstName}
                                                    onChange={(e) => updateForm("firstName", e.target.value)}
                                                    className={`pl-9 ${errors.firstName ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nom *</Label>
                                            <Input
                                                id="lastName" placeholder="Alami" value={form.lastName}
                                                onChange={(e) => updateForm("lastName", e.target.value)}
                                                className={errors.lastName ? "border-destructive" : ""}
                                            />
                                            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email" type="email" placeholder="exemple@email.com" value={form.email}
                                                    onChange={(e) => updateForm("email", e.target.value)}
                                                    className={`pl-9 ${errors.email ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone *</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="phone" type="tel" placeholder="06 XX XX XX XX" value={form.phone}
                                                    onChange={(e) => updateForm("phone", e.target.value)}
                                                    className={`pl-9 ${errors.phone ? "border-destructive" : ""}`}
                                                />
                                            </div>
                                            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adresse complète *</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="address" placeholder="N°, Rue, Quartier..." value={form.address}
                                                onChange={(e) => updateForm("address", e.target.value)}
                                                className={`pl-9 ${errors.address ? "border-destructive" : ""}`}
                                            />
                                        </div>
                                        {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                                    </div>

                                    {/* City & Postal */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Ville *</Label>
                                            <select
                                                id="city"
                                                value={form.city}
                                                onChange={(e) => updateForm("city", e.target.value)}
                                                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.city ? "border-destructive" : "border-input"}`}
                                            >
                                                <option value="">Sélectionner une ville</option>
                                                {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode">Code postal</Label>
                                            <Input
                                                id="postalCode" placeholder="20000" value={form.postalCode}
                                                onChange={(e) => updateForm("postalCode", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notes de commande (optionnel)</Label>
                                        <textarea
                                            id="notes"
                                            value={form.notes}
                                            onChange={(e) => updateForm("notes", e.target.value)}
                                            placeholder="Instructions spéciales pour la livraison..."
                                            rows={3}
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button variant="outline" onClick={() => setStep("cart-review")} className="gap-2">
                                            <ArrowLeft className="h-4 w-4" /> Retour
                                        </Button>
                                        <Button
                                            className="flex-1 h-12 gap-2 shadow-md shadow-primary/20"
                                            onClick={() => { if (validateDelivery()) setStep("payment"); }}
                                        >
                                            Continuer vers le paiement <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Payment */}
                        {step === "payment" && (
                            <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <div className="bg-card rounded-2xl border p-6 space-y-6">
                                    <h2 className="font-bold text-xl flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" /> Mode de paiement
                                    </h2>

                                    <RadioGroup
                                        value={paymentMethod}
                                        onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                                        className="space-y-3"
                                    >
                                        {PAYMENT_OPTIONS.map((opt) => {
                                            const Icon = opt.icon;
                                            return (
                                                <label
                                                    key={opt.id}
                                                    htmlFor={`pay-${opt.id}`}
                                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.id
                                                        ? "border-primary bg-primary/5"
                                                        : "border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    <RadioGroupItem value={opt.id} id={`pay-${opt.id}`} />
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                        <Icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-sm">{opt.label}</p>
                                                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                                                    </div>
                                                    {paymentMethod === opt.id && (
                                                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </RadioGroup>

                                    {/* Stripe card form */}
                                    <AnimatePresence>
                                        {paymentMethod === "card" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="bg-muted/30 rounded-xl p-4 overflow-hidden"
                                            >
                                                <StripeCheckout
                                                    items={items.map((i) => ({
                                                        productId: String(i.product.id),
                                                        quantity: i.quantity,
                                                        price: i.product.salePrice ?? i.product.price,
                                                    }))}
                                                    grandTotal={grandTotal}
                                                    onSuccess={async () => {
                                                        await handlePlaceOrder();
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Delivery info recap */}
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-2 text-sm">
                                        <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2">Livraison à</p>
                                        <p className="font-medium">{form.firstName} {form.lastName}</p>
                                        <p className="text-muted-foreground">{form.address}, {form.city} {form.postalCode}</p>
                                        <p className="text-muted-foreground">{form.phone}</p>
                                        <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => setStep("delivery")}>
                                            Modifier l&apos;adresse
                                        </Button>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button variant="outline" onClick={() => setStep("delivery")} className="gap-2">
                                            <ArrowLeft className="h-4 w-4" /> Retour
                                        </Button>
                                        {paymentMethod !== "card" && (
                                            <Button
                                                className="flex-1 h-12 gap-2 shadow-md shadow-primary/20"
                                                onClick={handlePlaceOrder}
                                                disabled={isPlacing}
                                                id="place-order-btn"
                                            >
                                                {isPlacing ? (
                                                    <><Loader2 className="h-5 w-5 animate-spin" /> Traitement en cours...</>
                                                ) : (
                                                    <><Lock className="h-5 w-5" /> Confirmer et payer {grandTotal} Dhs</>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Right Panel: Order Summary ── */}
                <div className="lg:col-span-2 lg:sticky lg:top-24">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
