// src/pages/terms.tsx
export default function Terms() {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Terms of Use</h1>
  
        <p className="mb-4">
          These Terms of Use (“Terms”) govern your use of From Within’s website and mobile apps (“Services”). By accessing or using the Services, you agree to these Terms.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Services</h2>
        <p className="mb-4">You agree to use the Services only for lawful and personal purposes.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">2. No Medical Advice</h2>
        <p className="mb-4">
          From Within provides wellness insights but does not offer medical advice. Consult a qualified professional for medical, psychological, or health issues.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Accounts</h2>
        <p className="mb-4">
          You are responsible for maintaining your login credentials and any activity on your account.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Subscriptions & Payments</h2>
        <p className="mb-4">
          If you purchase a subscription or lifetime plan, you authorize us to charge your payment method. All sales are final unless required by law.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Intellectual Property</h2>
        <p className="mb-4">
          All content, logos, features, and designs are owned by From Within. You may not reproduce or distribute them without permission.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
        <p className="mb-4">We may suspend or terminate accounts that violate these Terms.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
        <p className="mb-4">
          To the fullest extent permitted by law, From Within is not liable for damages arising from use of the Services.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">8. Governing Law</h2>
        <p className="mb-4">These Terms are governed by the laws of the State of California.</p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
        <p className="mb-4">
          For questions, email us at support@fromwithinapp.com.
        </p>
  
        <p className="mt-6 text-sm text-slate-400">Last updated: {new Date().getFullYear()}</p>
      </div>
    );
  }
  