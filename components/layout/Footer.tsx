import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Image src="/VITALUXE.png" alt="Vitaluxe Logo" width={150} height={40} className="h-10 w-auto object-contain mb-2" />
                        <p className="text-sm text-muted-foreground">
                            Votre parapharmacie en ligne de confiance pour tous vos besoins en santé, beauté et bien-être.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Liens Rapides</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">À propos de nous</Link></li>
                            <li><Link href="/shop" className="hover:text-primary">Boutique</Link></li>
                            <li><Link href="/categories" className="hover:text-primary">Catégories</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Service Client</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary">Contactez-nous</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary">Livraison et Retours</Link></li>
                            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
                            <li><Link href="/terms" className="hover:text-primary">Conditions générales</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-primary mr-2 shrink-0" />
                                <span>123 Avenue de la Beauté, Casablanca, Maroc</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-primary mr-2 shrink-0" />
                                <span>+212 5 12 34 56 78</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-primary mr-2 shrink-0" />
                                <span>contact@vitaluxe.ma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Vitaluxe. Tous droits réservés.</p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <span>Paiement 100% sécurisé</span>
                        <div className="flex space-x-3 items-center text-slate-400">
                            {/* FontAwesome Brands or Lucide icons equivalent */}
                            <svg className="h-6 w-auto" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-visa"><title id="pi-visa">Visa</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path d="M28.3 10.1l2.8-8.1h3l-4.5 13h-3.3l-2.6-8.5c-.1-.5-.3-.7-.8-.9l-2.6-.9v-.3c.7 0 1.6-.1 2.8-.1.9 0 2.2.1 2.5 1.1l1.7 4.7zm-9.3 4.9h2.9l-2.3-13h-4c-.6 0-1 .4-1.2 1l-3 8.7h3zM15.2 2H12l-2.6 13h3zM4 3.8C4 3.4 4.3 3 4.8 3h4.6c1.1 0 2.1.2 3.1.6l-1 3.5c-.7-.3-1.6-.5-2.4-.4-1.1.1-1.6.6-1.5 1.4.1.8 1.4 1.1 2.3 1.5 1.1.5 2.5 1.3 2.5 3.1v.1c-.1 2-1.9 2.5-3.8 2.5-1.4 0-2.8-.4-3.8-1l1.1-3.6c.9.5 2 .8 2.9.8s1.6-.4 1.5-1.2c0-.7-1-1.1-2-1.5-1-.4-2.5-1.2-2.5-3z" fill="#1434CB"></path></svg>
                            <svg className="h-6 w-auto" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-master"><title id="pi-master">Mastercard</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#F79E1B" cx="23" cy="12" r="7"></circle><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path></svg>
                            <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" width="38" height="24" aria-labelledby="pi-paypal"><title id="pi-paypal">PayPal</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4h2.6l-.8 5.4c0 .2.1.4.4.4h2.6c.2 0 .4-.1.5-.3l2-12.7c.1-.2 0-.3-.1-.5z"></path><path fill="#009CDE" d="M23.9 8.3c-.2.6-.5 1.1-.9 1.5-.9.9-2.4 1.3-4.2 1.3h-2.1c-.2 0-.4.1-.4.3l-1.9 11.8c-.1.2.1.4.3.4h3c.2 0 .4-.1.5-.3l.7-4.6c.1-.2.3-.3.5-.3h1c1.8 0 3.1-.7 3.8-2 .4-.8.6-1.7.5-2.6-.1-2-1.2-3.8-3.3-4.1 1.2.2 2 1.2 1.9 2.5z"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
