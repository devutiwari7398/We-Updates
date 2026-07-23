export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-gray-600 mb-8">
        Last Updated: 22 may 2024
      </p>
      

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        Introduction
      </h2>

      <p>
        Welcome to Hello Swamy. Your privacy is critically important to us. This Privacy Policy outlines how we collect, use, and safeguard your personal information within our mobile application, which provides Ayurvedic health articles, product sales, and consultations with qualified Vaidyas.

      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        1. Information We Collect
      </h2>

      <p>
        We collect information to facilitate our health services and product deliveries:
        Identity & Contact Data: Name, email address, phone number, and account credentials used for Firebase Authentication.
        Health & Consultation Data: Symptoms, health descriptions, gender, age, and date of birth provided during appointment bookings with Vaidyas.
        Transaction & Shipping Data: Details of products purchased, billing records, and physical addresses for order fulfillment.
        User Content: Profile images or documents you upload to Firebase Storage for profile personalization or consultation support.
        Usage Analytics: Technical data including app interactions and performance logs collected via Firebase Analytics and Crashlytics.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        2. How We Use Your Information
      </h2>

      <p>
        Your data is processed to:
        Manage your user account and secure your login.
        Process and track orders made through the Hello Swamy store.
        Schedule and facilitate consultations between you and healthcare consultants.
        Provide a personalized health feed based on Ayurvedic principles.
        Improve app reliability and functionality through data analysis.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        3. Data Sharing and Third Parties
      </h2>

      <p>
        We do not sell your personal data. We share information only with service providers necessary for app operations:
        Google Cloud/Firebase: For secure authentication, database management (Firestore), and file storage.
        Razorpay: For secure payment processing. We do not store or process your credit card or sensitive payment details on our own infrastructure.
        Analytics Providers: To monitor user trends and app stability.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        4. Device Permissions
      </h2>

      <p>
        The App may request access to your device's Camera and Storage to enable photo uploads for your profile or for sharing relevant information during health consultations.
        These permissions are requested only when necessary.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        5. Account Deletion and Data Retention
      </h2>

      <p>
        You have the right to delete your account at any time through the "Delete account" option in the App Settings. Upon confirming deletion:
        Your authentication credentials will be removed from our systems immediately.
        Your primary user profile data in our database will be deleted.
        Operational data, including order history, payment records, and consultation logs, will be retained for a reasonable period to comply with legal, accounting, and regulatory obligations.
        Uploaded content (such as profile images) should be removed prior to account deletion if you wish it to be cleared from our storage buckets.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">
        6. Contact Information
      </h2>

      <p>
        For any questions or concerns regarding this policy, please contact us at 
        helloswamyji@gmail.com
      </p>

    </main>
  );
}