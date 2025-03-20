# BuyHive 🐝  
Your ultimate shopping assistant for a seamless and smarter online shopping experience.  

## 🛠 Features  
- **Price Comparison**: Automatically compare prices across multiple e-commerce sites.  
- **Wishlist Syncing**: Keep your wishlist organized and synced across platforms.  
- **Discount Alerts**: Get notified of the latest deals and price drops in real-time.  
- **Secure Purchase Tracker**: Track your orders without compromising privacy.  

## Installation  
1. Download BuyHive from the [Chrome Web Store](#) (replace this with the actual link when available).  
2. Click "Add to Chrome" and confirm installation.  
3. Pin the BuyHive icon to your browser toolbar for quick access.  

## Usage  
1. Visit any supported online store.  
2. BuyHive will automatically display:  
   - Price comparisons.  
   - Available discounts or coupon codes.  
   - An option to add items to your synced wishlist.  
3. Open the BuyHive toolbar for order tracking and settings.  

## Tech Stack  
- **Languages**: JavaScript, HTML, CSS  
- **Frameworks**: React for UI, Express for backend processing  
- **Browser APIs**: Chrome Extension APIs (e.g., runtime, storage, and alarms)  
- **Database**: IndexedDB for local storage and synchronization

## Folder Structure  

> **public/**  
> - `index.html`: Main HTML file for the extension.  
> - **icons/**: Folder containing extension icons.

> **src/**  
> - **components/**  
>   - `Header.js`: Navigation bar component.  
>   - `PriceComparison.js`: Displays price comparisons.  
>   - `Wishlist.js`: Manages user wishlist.  
>   - `Alerts.js`: Handles discount notifications.  
> - `background.js`: Background script for Chrome APIs.  
> - `content.js`: Injected script for page interaction.  
> - **popup/**  
>   - `Popup.js`: Main React component for popup.  
>   - `Popup.css`: Styles for the popup interface.

> `manifest.json`: Chrome extension configuration.  
> `README.md`: Project documentation.
