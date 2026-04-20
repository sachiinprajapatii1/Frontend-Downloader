export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#e8eaf0", padding: "60px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <a href="/" style={{ color: "#63b3ed", fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40 }}>← Back to Home</a>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#f0f4ff", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: "#4a5878", marginBottom: 48 }}>Last updated: April 2026</p>

        {[
          { title: "1. Introduction", content: "Universal Media Downloader ('we', 'our', or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website at universal-media-downloader-tys.vercel.app." },
          { title: "2. Information We Collect", content: "We do not collect any personally identifiable information. When you use our tool, we temporarily process the URL you provide to fetch and download the requested media. This URL is not stored on our servers after your session ends. We may collect anonymous usage analytics (page views, feature usage) through third-party analytics services." },
          { title: "3. Cookies", content: "We use cookies to personalize your experience and display relevant advertisements through Google AdSense. You can choose to accept or decline cookies through the cookie consent banner on our website. Declining cookies may affect your experience on our site." },
          { title: "4. Google AdSense", content: "We use Google AdSense to display advertisements on our website. Google may use cookies and web beacons to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings at www.google.com/settings/ads." },
          { title: "5. Third-Party Services", content: "Our service uses third-party tools to process media downloads. We do not share your data with third parties for marketing purposes. All downloaded files are processed temporarily and deleted from our servers immediately after download." },
          { title: "6. Data Security", content: "We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security." },
          { title: "7. Children's Privacy", content: "Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us." },
          { title: "8. Changes to This Policy", content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date. Continued use of our service after changes constitutes acceptance of the new policy." },
          { title: "9. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us through our social media profiles linked on the website." },
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