// src/pages/privacy.tsx
export default function Privacy() {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy explains how From Within (“we”, “us”, “our”) collects, uses, and protects your information when you use our website and mobile applications (“Services”).
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <p className="mb-4">We may collect:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Account Information (name, email)</li>
          <li>Wearable Data (HRV, sleep, activity — only with your permission)</li>
          <li>Usage data, device data, IP address</li>
          <li>Information you submit (journal entries, check-ins, etc.)</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide personalized insights and recommendations</li>
          <li>Improve app performance and experience</li>
          <li>Provide customer support</li>
          <li>Comply with legal obligations</li>
        </ul>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
        <p className="mb-4">
          We do not sell your data. We may share information with trusted vendors (e.g., cloud services) solely to operate our platform.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Security</h2>
        <p className="mb-4">
          We use industry-standard security to protect your data, but no system is completely secure.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Rights</h2>
        <p className="mb-4">
          You may request deletion, export, or correction of your data by contacting us at support@fromwithinapp.com.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Children’s Privacy</h2>
        <p className="mb-4">
          Our Services are not intended for individuals under 13 without parental permission.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this policy. Continued use of the Services indicates acceptance of the updated policy.
        </p>
  
        <p className="mt-6 text-sm text-slate-400">Last updated: {new Date().getFullYear()}</p>
      </div>
    );
  }
  