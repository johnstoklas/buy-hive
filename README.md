# BuyHive 🐝  
BuyHive is an AI-powered shopping cart that utilizes web scraping to reduce clutter between websites. Have you ever been shopping on Amazon, Target, and Walmart at the same time? Or trying to collect a Christmas list or make a birthday list for your friend? Several tabs have to be open and stay open, causing headaches and confusion. 

BuyHive condenses all of that work into one cart, improving shopping efficiency and removing the hassle of having to keep track of where all your items are!

## Frontend Features  
[For more details about the backend, visit the backend repository](https://github.com/GustavoBelaunde2004/Extension-backend)

- **User Authentication**:  
  BuyHive provides a secure and streamlined login process by leveraging **Auth0** for user authentication. User profiles and session data are securely stored using **Chrome Extension APIs**, enabling a simple and seamless login experience. With this integration, users can easily manage their personalized folders and preferences across sessions.

  ![User Authentication](readme_assets/log%20in.gif)

- **Adding Items**:  
  BuyHive utilizes our backend AI models to scrape relevant product data (price, title, product image) from web pages. Users can add items to custom folders and annotate them with notes for better organization. All data is sent to our database using **MongoDB** and middleware for sending data using requests can be found in `background.js`.

   ![Adding Item](readme_assets/adding%20item.gif)

- **Folder Organization**:  
  Users can create multiple folders to categorize items based on purpose (e.g., gifts, personal purchases). Folder creation and updates are managed using **React state** via `useState`, ensuring smooth real-time **Virtual DOM** updates. Folders are sent to **MongoDB**, but while a user is on BuyHive in the same session, those changes are made locally, reducing data flow between client and server.

    ![Editing Folder Name](readme_assets/editing%20folder%20name.gif)

- **Item Management**:  
  Manage your items effortlessly using real-time updates to reduce client-server data flow:
  - Edit notes and titles using intuitive, inline-edit functionality built with **React hooks**.  
  - Delete items or folders with real-time updates.
  - Move items between folders, ensuring maximum organization without clutter.
 
    ![Editing and Moving Item](readme_assets/moving%20-%20editing%20notes.gif)
 
- **Email Sharing**:  
  BuyHive allows users to share folders directly via email. This feature allows users to send items to friends and family without the hassle of having to send several links.

    ![Sharing Items](readme_assets/sharing%20cart.gif)

- **Popup and Click Handling**:  
  To reduce clutter and optimize the limited space in the extension window, BuyHive uses **useRef** to handle user clicks effectively. When a user clicks outside a pop-up, the pop-up disappears to minimize distractions. In addition, global variables are implemented to track the visibility of active popups, ensuring that multiple popups cannot be displayed simultaneously.
  
  ![Reduce Clutter](readme_assets/ui%20declutter.gif)

## Local Installation
Follow these steps to run BuyHive locally:

1. **Clone the Repository**:
   Clone this repository to your local machine using the following command:
   ```git clone https://https://github.com/johnstoklas/buy-hive```

2. **Enable Developer Mode in Chrome**:
   Open Google Chrome.
   Go to the Extensions page by visiting chrome://extensions/ in the address bar.
   Toggle Developer mode (found at the top-right corner of the page).
3. **Load the Extension**:
   Click on the "Load unpacked" button.
   Select the folder where the project files are located.
   Copy and paste the ID associated with the Chrome extension.

4. **Create an Auth0 Account**:
   Go to the [Auth0 Sign-Up Page](https://auth0.com/signup).
   Once logged in, create an API key.
   Navigate to the **Applications** section in the Auth0 dashboard and create a new application:
   Add the Chrome extension ID to the **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**.

5. **Create a `.env` File**:
   In the root directory of your project, create a new file named `.env`.
   Add the following environment variables to the `.env` file:
   ```
   REACT_APP_AUTH0_DOMAIN=(put your domain key)
   REACT_APP_AUTH0_CLIENT_ID=(put your client id here)
   REACT_APP_REDIRECT_URI=(put your id that you copued and pasted here)
   ```

6. **Install npm Dependencies**:
   Ensure you have Node.js and npm installed. You can download them from Node.js.
   Open a terminal and navigate to your project directory and run:
   ```npm install```
   Once the installation is complete, you’ll see a node_modules folder in your project directory, which contains all the installed packages.
   Then run:
   ```npm start```

7. **Download Backend Repo**:
   At this point you are connected to the frontend but must follow the steps found on the backend repo to get the full BuyHive experience:
   [For more details about the backend, visit the backend repository](https://github.com/GustavoBelaunde2004/Extension-backend)

## Troubleshooting  
- **Error: Extension Failed to Load**:  
   Ensure the `manifest.json` file is correctly formatted and that all files referenced (e.g., images, scripts) are in the correct locations.

- **Auth0 Login Issues**:  
   Double-check the **Allowed Callback URLs**, **Allowed Web Origins**, and **Allowed Logout URLs** in the Auth0 dashboard to ensure they match your setup.

- **Environment Variable Issues**:  
   Ensure the `.env` file is in the root directory and properly formatted without extra spaces or special characters.

## Usage  
1. Visit any shopping website and view a product.
2. Click the shopping cart icon, and BuyHive will scan the page.
3. Once completed, select which folders to add your item to and press the **Add Item** button.

## Tech Stack for Frontend
- **Languages**: JavaScript, HTML, CSS  
- **Frameworks**: React for UI
- **Browser APIs**: Chrome Extension APIs (e.g., runtime, storage, tabs, and scripting), Auth0
- **Build Tools**: Babel for transpilation

## Folder Structure  
**public**
- `images`: Folder containing extension icons.
- `popup.html`: Main HTML file for the extension (utilized Babel because of React framework).  
---
**src/**  
- **components/**: Handles components for adding items, modifying folders, and modifying items.
- **css/**: Handles styling for all components
- `index.js`: Handles log-in, utilizing Auth0.
---
- `background.js`: Handles API requests to MongoDB on user interaction.
- `manifest.json`: Chrome extension configuration.  
- `README.md`: Project documentation.

## Future Features  
- **Website Auto-Detection**: Introduce a smart detection button that automatically appears when users visit supported shopping websites. This feature minimizes the need to manually interact with the extension, saving time and making the shopping process more seamless.
- **Search Functionality**: Implement a search bar to allow users to quickly locate items or folders within their carts. This will help improve shopping efficency so if users know what they are looking for they don't have to search through folders.
- **Recently Added Items Section**: Provide users with a dedicated section that displays the last few items added to their account. This feature improves efficiency by offering quick access to recently interacted items, reducing the need to navigate through folders. 

