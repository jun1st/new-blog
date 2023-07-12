
import Script from 'next/script'

function GoogleAnalytics() {
    return (
      <div className="container">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Z1J88QGVFK" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
   
            gtag('config', 'G-Z1J88QGVFK');
          `}
        </Script>
      </div>
    )
  }
   
  export default GoogleAnalytics
