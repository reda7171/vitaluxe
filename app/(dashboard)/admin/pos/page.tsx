"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, CheckCircle, PackageSearch, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Product = {
    id: string;
    name: string;
    price: number;
    salePrice: number | null;
    stock: number;
    images: string | null;
    category: { name: string };
};

type CartItem = Product & { quantity: number };

export default function POSPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    // Checkout Modal State
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"POS_CASH" | "POS_CARD">("POS_CASH");
    const [cashReceived, setCashReceived] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [completedOrderData, setCompletedOrderData] = useState<{
        items: CartItem[];
        total: number;
        paymentMethod: string;
        cashReceived: string;
        date: Date;
        orderId?: string;
    } | null>(null);
    const [isModuleEnabled, setIsModuleEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        fetchSettings();
        fetchProducts();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.modules) {
                const parsed = JSON.parse(data.modules);
                setIsModuleEnabled(parsed.enablePOS !== false);
            } else {
                setIsModuleEnabled(true);
            }
        } catch (e) {
            setIsModuleEnabled(true);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/admin/pos/products");
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!search) return products;
        return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }, [products, search]);

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;
        
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // Cannot add more than stock
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta;
                if (newQuantity <= 0) return item; // Handled by remove
                if (newQuantity > item.stock) return item;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const totalAmount = useMemo(() => {
        return cart.reduce((sum, item) => sum + ((item.salePrice || item.price) * item.quantity), 0);
    }, [cart]);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/pos/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart.map(i => ({ id: i.id, quantity: i.quantity, name: i.name })),
                    paymentMethod
                })
            });
            const data = await res.json();
            if (data.success) {
                setCompletedOrderData({
                    items: [...cart],
                    total: totalAmount,
                    paymentMethod,
                    cashReceived,
                    date: new Date(),
                    orderId: data.order?.id
                });
                setOrderComplete(true);
                setCart([]);
                fetchProducts(); // Refresh stock
            } else {
                alert(data.error || "Erreur lors de l'encaissement");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetPOS = () => {
        setOrderComplete(false);
        setIsCheckingOut(false);
        setCashReceived("");
        setCompletedOrderData(null);
    };

    if (isModuleEnabled === false) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)] -m-4 lg:-m-6 bg-slate-50 p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md">
                    <PackageSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Module désactivé</h2>
                    <p className="text-slate-500 mb-6">Le module Point de Vente (POS) est actuellement désactivé. Vous pouvez l'activer depuis les paramètres d'administration.</p>
                </div>
            </div>
        );
    }

    if (isLoading || isModuleEnabled === null) return <div className="p-6 text-slate-500">Chargement du Point de Vente...</div>;

    return (
        <div className="h-[calc(100vh-6rem)] -m-4 lg:-m-6 flex flex-col bg-slate-50 overflow-hidden print:bg-white print:h-auto print:m-0 print:overflow-visible">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 print:hidden">
                <h1 className="text-xl font-bold text-[#103178]">Point de Vente (POS)</h1>
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un produit (nom, code...)" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 h-10 rounded-full border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#103178]/20 focus:border-[#103178] transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden print:hidden">
                {/* Left: Products Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <PackageSearch className="w-16 h-16 mb-4 opacity-50" />
                            <p>Aucun produit trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredProducts.map(product => {
                                const mainImage = product.images ? JSON.parse(product.images)[0] : null;
                                const isOutOfStock = product.stock <= 0;
                                
                                return (
                                    <div 
                                        key={product.id} 
                                        onClick={() => !isOutOfStock && addToCart(product)}
                                        className={`bg-white p-3 rounded-xl border shadow-sm transition-all ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:border-[#103178]'}`}
                                    >
                                        <div className="aspect-square bg-slate-100 rounded-lg mb-3 relative overflow-hidden flex items-center justify-center">
                                            {mainImage ? (
                                                <Image src={mainImage} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <PackageSearch className="w-8 h-8 text-slate-300" />
                                            )}
                                        </div>
                                        <div className="text-xs text-slate-500 mb-1">{product.category.name}</div>
                                        <div className="font-medium text-sm text-slate-800 line-clamp-2 leading-tight mb-2 h-10">{product.name}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="font-bold text-[#103178]">{product.salePrice || product.price} MAD</div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {product.stock} {isOutOfStock ? 'Rupture' : 'Stock'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: Cart */}
                <div className="w-[400px] bg-white border-l flex flex-col shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                    <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                        <h2 className="font-semibold flex items-center"><ShoppingCart className="w-5 h-5 mr-2 text-[#103178]" /> Panier en cours</h2>
                        <span className="bg-[#103178] text-white text-xs px-2 py-1 rounded-full font-medium">{cart.length} articles</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm">
                                <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                                Le panier est vide
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex flex-col p-3 border rounded-lg border-slate-100 bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-sm text-slate-800 line-clamp-2 flex-1">{item.name}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 ml-2">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-[#103178]">{item.salePrice || item.price} MAD</div>
                                        <div className="flex items-center space-x-3 bg-slate-50 rounded-md p-1 border">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                disabled={item.quantity <= 1}
                                                className="w-6 h-6 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-slate-200 rounded"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                disabled={item.quantity >= item.stock}
                                                className="w-6 h-6 flex items-center justify-center text-slate-600 disabled:opacity-30 hover:bg-slate-200 rounded"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer */}
                    <div className="p-6 bg-slate-50 border-t">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-slate-600 font-medium">Total à payer</span>
                            <span className="text-2xl font-bold text-[#103178]">{totalAmount.toFixed(2)} MAD</span>
                        </div>
                        <Button 
                            className="w-full h-14 text-lg bg-[#103178] hover:bg-[#0a2050] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                            disabled={cart.length === 0}
                            onClick={() => setIsCheckingOut(true)}
                        >
                            Encaisser
                        </Button>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {isCheckingOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {orderComplete ? (
                            <div className="p-10 text-center flex flex-col items-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">Encaissement réussi</h2>
                                <p className="text-slate-500 mb-8">La commande a été enregistrée avec succès.</p>
                                <Button variant="outline" className="w-full h-12 mb-3 text-[#103178] border-[#103178]" onClick={() => window.print()}>
                                    <Printer className="w-4 h-4 mr-2" /> Imprimer le ticket
                                </Button>
                                <Button className="w-full h-12 bg-[#103178]" onClick={resetPOS}>Nouvelle vente</Button>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                                    <h2 className="text-xl font-bold text-slate-800">Encaissement</h2>
                                    <button onClick={() => setIsCheckingOut(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <div className="text-sm text-blue-600 font-medium mb-1">Montant total</div>
                                        <div className="text-3xl font-bold text-[#103178]">{totalAmount.toFixed(2)} MAD</div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 block mb-3">Moyen de paiement</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                className={`flex flex-col items-center justify-center py-4 px-3 border rounded-xl transition-all ${paymentMethod === 'POS_CASH' ? 'border-[#103178] bg-[#103178]/5 shadow-sm text-[#103178]' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                                onClick={() => setPaymentMethod('POS_CASH')}
                                            >
                                                <Banknote className="w-6 h-6 mb-2" />
                                                <span className="font-medium text-sm">Espèces</span>
                                            </button>
                                            <button 
                                                className={`flex flex-col items-center justify-center py-4 px-3 border rounded-xl transition-all ${paymentMethod === 'POS_CARD' ? 'border-[#103178] bg-[#103178]/5 shadow-sm text-[#103178]' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                                onClick={() => setPaymentMethod('POS_CARD')}
                                            >
                                                <CreditCard className="w-6 h-6 mb-2" />
                                                <span className="font-medium text-sm">Carte bancaire</span>
                                            </button>
                                        </div>
                                    </div>

                                    {paymentMethod === 'POS_CASH' && (
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Montant perçu (MAD)</label>
                                            <input 
                                                type="number" 
                                                className="w-full h-12 text-lg px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#103178]/20 focus:border-[#103178] outline-none"
                                                placeholder="Ex: 500"
                                                value={cashReceived}
                                                onChange={e => setCashReceived(e.target.value)}
                                            />
                                            {Number(cashReceived) >= totalAmount && (
                                                <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg flex justify-between items-center border border-green-100">
                                                    <span className="text-sm font-medium">Monnaie à rendre :</span>
                                                    <span className="font-bold text-lg">{(Number(cashReceived) - totalAmount).toFixed(2)} MAD</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                                <div className="p-6 border-t bg-slate-50 flex gap-3">
                                    <Button variant="outline" className="flex-1 h-12" onClick={() => setIsCheckingOut(false)}>Annuler</Button>
                                    <Button 
                                        className="flex-1 h-12 bg-[#103178] hover:bg-[#0a2050] text-white" 
                                        disabled={isSubmitting || (paymentMethod === 'POS_CASH' && cashReceived !== "" && Number(cashReceived) < totalAmount)}
                                        onClick={handleCheckout}
                                    >
                                        {isSubmitting ? "Validation..." : "Valider le paiement"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Receipt (Print only) */}
            {completedOrderData && (
                <div className="hidden print:block text-black bg-white" style={{ width: '58mm', margin: '0 auto', fontFamily: 'monospace' }}>
                    <style type="text/css" media="print">
                        {`@page { margin: 0; size: auto; } body { margin: 0; }`}
                    </style>
                    <div className="text-center mb-2 pt-4">
                        <h2 className="font-bold text-xl leading-tight">VITALUXE</h2>
                        <p className="text-[10px] leading-tight mt-1">Parapharmacie & Beauté</p>
                        <p className="text-[10px] leading-tight">123 Blvd Anfa, Casablanca</p>
                        <p className="text-[10px] leading-tight">Tél: 05 22 00 00 00</p>
                    </div>
                    
                    <div className="text-center text-[9px] border-t border-b border-black border-dashed py-1 mb-2">
                        <p>ICE: 000012345678900</p>
                        <p>RC: 12345 | IF: 12345678</p>
                    </div>

                    <div className="text-[10px] mb-2">
                        <p>Date: {completedOrderData.date.toLocaleDateString()} à {completedOrderData.date.toLocaleTimeString()}</p>
                        {completedOrderData.orderId && <p>Ticket: #{completedOrderData.orderId.slice(-6).toUpperCase()}</p>}
                        <p>Caissier: Admin</p>
                    </div>
                    
                    <div className="border-t border-b border-black border-dashed py-2 mb-2">
                        {completedOrderData.items.map(item => (
                            <div key={item.id} className="flex justify-between text-[11px] mb-1">
                                <span className="pr-1">{item.quantity}x {item.name.substring(0, 12)}</span>
                                <span>{((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex justify-between font-bold text-sm mb-2">
                        <span>TOTAL</span>
                        <span>{completedOrderData.total.toFixed(2)} MAD</span>
                    </div>
                    
                    <div className="text-[10px] mb-3 space-y-1">
                        <div className="flex justify-between">
                            <span>Paiement:</span>
                            <span>{completedOrderData.paymentMethod === 'POS_CASH' ? 'Espèces' : 'Carte Bancaire'}</span>
                        </div>
                        {completedOrderData.paymentMethod === 'POS_CASH' && completedOrderData.cashReceived && (
                            <>
                                <div className="flex justify-between">
                                    <span>Espèces:</span>
                                    <span>{Number(completedOrderData.cashReceived).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rendu:</span>
                                    <span>{(Number(completedOrderData.cashReceived) - completedOrderData.total).toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex justify-center mb-2">
                        {completedOrderData.orderId && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=TICKET:${completedOrderData.orderId}`} 
                                alt="QR Code"
                                className="w-16 h-16 grayscale"
                            />
                        )}
                    </div>
                    
                    <div className="text-center text-[10px] border-t border-black border-dashed pt-2 pb-4">
                        <p>Merci de votre visite !</p>
                        <p>À bientôt sur www.vitaluxe.ma</p>
                    </div>
                </div>
            )}
        </div>
    );
}
