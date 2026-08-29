export const metadata = {
  title: 'LENO PERFUME',
  description: 'متجر إلكتروني متكامل متخصص في تركيب العطور',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0f172a' }}>
        {children}
      </body>
    </html>
  )
}
