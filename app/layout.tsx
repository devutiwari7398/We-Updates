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
  {/* Meta Pixel Code */}
  <Script
    id="meta-pixel"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1611911963766284');
        fbq('track', 'PageView');
      `,
    }}
  />

  <noscript>
    <img
      height="1"
      width="1"
      style={{ display: "none" }}
      src="https://www.facebook.com/tr?id=1611911963766284&ev=PageView&noscript=1"
      alt=""
    />
  </noscript>
  {/* End Meta Pixel Code */}
  <Header />

  <main>{children}</main>

  <Footer />
</body></html>}
