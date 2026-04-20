export default function TermsOfService() {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e8eaf0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ color: "#63b3ed", fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40 }}>← Back to Home</a>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#f0f4ff", marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: "#4a5878", marginBottom: 48 }}>Last updated: April 2026</p>

        {[
          { title: "1. Acceptance of Terms", content: "By accessing and using Universal Media Downloader, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service." },
          { title: "2. Description of Service", content: "Universal Media Downloader is a free online tool that allows users to download publicly available videos and audio from supported social media platforms. The service is provided 'as is' without any warranties." },
          { title: "3. Permitted Use", content: "You may only use this service for personal, non-commercial purposes. You must only download content that you have the legal right to download. You must comply with all applicable laws and the terms of service of the source platforms." },
          { title: "4. Prohibited Use", content: "You may not use this service to download copyrighted content without permission from the rights holder. You may not use this service for any illegal activity. You may not attempt to reverse engineer, disrupt, or abuse our service." },
          { title: "5. Copyright and Intellectual Property", content: "We respect intellectual property rights. Users are solely responsible for ensuring they have the right to download any content. We do not host, store, or distribute any downloaded media. All media is processed temporarily and deleted immediately." },
          { title: "6. Disclaimer of Warranties", content: "Our service is provided on an 'as is' and 'as available' basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the service. We are not responsible for any content downloaded through our service." },
          { title: "7. Limitation of Liability", content: "To the maximum extent permitted by law, Universal Media Downloader shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service." },
          { title: "8. Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms." },
          { title: "9. Governing Law", content: "These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the appropriate courts." },
        ].map((section) => (
          <div key={section.title} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#eef2ff", marginBottom: 10 }}>{section.title}</h2>
            <p style={{ fontSize: 15, color: "#6b7a99", lineHeight: 1.9 }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}