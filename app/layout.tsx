import type { Metadata } from 'next'; 
import "./globals.css";
import Script from "next/script";
import { Header } from '@/components/Header'; 
import { Footer } from '@/components/Footer';
export const metadata:Metadata={metadataBase:new URL('https://weupdates.example'),
    title:{default:'WeUpdates | Learn Skills. Build Your Future.',template:'%s | WeUpdates'},
    description:'Premium PDF and video courses built for practical progress.',
    keywords:['online courses','PDF courses','video courses','career learning','WeUpdates'],
    openGraph:{title:'WeUpdates | Learn Skills. Build Your Future.',
        description:'Practical PDF and video courses for the skills that move you forward.',type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>
  <Script
    src="https://checkout.razorpay.com/v1/checkout.js"
    strategy="beforeInteractive"
  />

  <Header />

  <main>{children}</main>

  <Footer />
</body></html>}
