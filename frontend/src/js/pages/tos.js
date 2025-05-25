// frontend/src/js/pages/terms.js
import { renderHeader } from '../partials/header.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    app.innerHTML += `
        <div class="container mt-5">
            <h1 class="text-center">Terms of Service</h1>
            <div class="row">
                <div class="col-md-12">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to UniBookSwap, a platform for university students to buy and sell textbooks. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the platform.
                    </p>

                    <h2>2. Acceptance of Terms</h2>
                    <p>
                        By creating an account or using UniBookSwap, you agree to comply with and be legally bound by these Terms, our Privacy Policy, and any other guidelines provided on the platform.
                    </p>

                    <h2>3. User Responsibilities</h2>
                    <ul>
                        <li>You must be a registered university student to use this platform.</li>
                        <li>You agree to provide accurate information when creating an account or listing books.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You agree not to engage in fraudulent activities, including misrepresenting book conditions or failing to complete transactions.</li>
                    </ul>

                    <h2>4. Transactions and Payments</h2>
                    <p>
                        UniBookSwap facilitates transactions between buyers and sellers but does not handle payments directly. Users are responsible for arranging payment and delivery of books. Both parties must confirm transactions to mark them as complete.
                    </p>

                    <h2>5. Limitation of Liability</h2>
                    <p>
                        UniBookSwap is not liable for any disputes, damages, or losses arising from transactions between users. We do not guarantee the quality, safety, or legality of listed books. Use the platform at your own risk.
                    </p>

                    <h2>6. Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or misuse the platform. You may also terminate your account at any time by contacting support.
                    </p>

                    <h2>7. Changes to Terms</h2>
                    <p>
                        We may update these Terms from time to time. Changes will be posted on this page, and continued use of the platform after changes constitutes acceptance of the new Terms.
                    </p>

                    <h2>8. Contact Information</h2>
                    <p>
                        For questions or concerns about these Terms, please contact us at <a href="mailto:support@unibookswap.com">support@unibookswap.com</a>.
                    </p>
                </div>
            </div>
        </div>
    `;
    renderFooter(app);
};
