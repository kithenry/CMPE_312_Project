// frontend/src/js/components/footer.js
export const renderFooter = (app) => {
    app.innerHTML += `
        <footer class="bg-dark mx-5  text-white text-center p-3 mt-5">
            <p>&copy; 2025 UniBookSwap. All rights reserved.</p>
            <p>
                <a href="/about" class="text-white">About Us</a> | 
                <a href="/tos" class="text-white">Terms of Service</a> | 
                <a href="/privacy" class="text-white">Privacy Policy</a>
            </p>
            <p>Contact: support@unibookswap.com</p>
        </footer>
    `;
};
