import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import type { Dispatch, SetStateAction } from 'react';

interface FooterProps {
    accountPageVisible: boolean;
    setAccountPageVisible: Dispatch<SetStateAction<boolean>>;
    addCartVisible: boolean;
    setAddCartVisible: Dispatch<SetStateAction<boolean>>;
}
const Footer = ({ setAccountPageVisible, setAddCartVisible } : FooterProps) => {
    const togglePage = (type: string) => {
        setAccountPageVisible(false);
        setAddCartVisible(false);
        if (type === "cart") setAddCartVisible(true);
    }
    // const [addItemState, setAddItemState] = useState(false); // toggles visiblity for add item
    // const [signInState, setSignInState] = useState(false); // toggles visiblity for profile page

    // const [fileName, setFileName] = useState(""); // stores folder name data

    // const [scrapedData, setScrapedData] = useState(null); // stores scraped price and title data
    // const [scrapedImage, setScrapedImage] = useState(null); // stores scraped image data
    // const [currentUrl, setCurrentUrl] = useState(null);
    // const [tabId, setTabId] = useState(null)
    // const [error, setError] = useState(null); // error if either scraping mechanism fails

    // const { isLocked, setIsLocked } = useLocked();
    // const { user, isAuthenticated, isLoading } = useAuth0();
    // const { userData, setUserData } = userDataContext();
    
    // // Locks screen if user is not logged in
    // useEffect(() => {
    //     setIsLocked(!isAuthenticated);
    // }, [isAuthenticated]);

    // // Sends user information to background.js for database managament
    // useEffect(() => {
    //     if (user) {
    //         setUserData(user);
    //         chrome.runtime.sendMessage({ action: "sendUserInfo", data: user }, (response) => {
    //             console.log('Response from background.js:', response);
    //         });
    //     }
    // }, [user]);

    // useEffect(() => {
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         if (tabs.length > 0) {
    //           const currentTab = tabs[0];
    //           const url = currentTab.url
    //           const tab = tabs[0].id;

    //           setCurrentUrl(url);
    //           setTabId(tab);
    //         } else {
    //         console.error("No active tab found.");
    //       }
    //     });
    // }, []);

    // // Gather text that is visible on the page for price and title
    // const gatherPriceTitleData = () => {
    //     chrome.scripting.executeScript({
    //         target: {tabId: tabId},
    //         func: () => {
    //             return document.body.innerText;
    //         }
    //     }, (results) => {
    //         const data = {
    //             innerText: results[0].result,
    //             accessToken: user,
    //         }
    //         chrome.runtime.sendMessage({ action: "scrapePage", data:data }, (response) => {
    //             if(response?.status === 'success' && !error) {
    //                 console.log("title/price: (status)", response.data.cart_items);
    //                 if(!response.data.cart_items.price || !response.data.cart_items.product_name) {
    //                     setError("invalid website");
    //                     return;
    //                 }
    //                 setScrapedData(response.data.cart_items);
    //             }
    //             else {
    //                 setError(response?.message);
    //             }
    //         });
    //     });  
    // }

    // // Gathers all images from the page
    // const gatherImageData = () => {
    //     console.log("CURRENT: ", currentUrl);
    //     chrome.scripting.executeScript({
    //         target: { tabId: tabId },
    //         func: () => {
    //             return Array.from(document.querySelectorAll("img")).map(img => ({
    //                 src: img.src,
    //                 width: img.naturalWidth,
    //                 height: img.naturalHeight
    //             }));
    //         },
    //     }, (results) => {
    //         if (results && results[0]?.result) {
    //             const imageSources = results[0].result;
    //             //console.log("Images found, length of: ", imageSources.length, " , ", imageSources);

    //             const imageSourcesLarge = [];

    //             imageSources.forEach(img => {
    //                 console.log(img.width);
    //                 if (img.width > 20 && img.height > 20) { 
    //                     imageSourcesLarge.push(img);
    //                 }
    //             });

    //             //console.log("filtered for size, length of:", imageSourcesLarge.length, " , ", imageSourcesLarge)

    //             let imagePlainText = "";
    //             imageSources.map((img) => {
    //                 imagePlainText += img.src;
    //                 imagePlainText += ", ";
    //             });

    //             //console.log(imagePlainText)
    //             const data = {
    //                 imageData: imagePlainText,
    //                 url: currentUrl,
    //             }
    //             chrome.runtime.sendMessage({action: "sendImageData", data:data }, (response) => {
    //                 if(response?.status === 'success' && !error) {
    //                     console.log("image data: ", response.data);
    //                     setScrapedImage(response.data);
    //                 }
    //                 else {
    //                     setError(response?.message);
    //                 }
    //             })
    //         } else {
    //             console.error("Failed to get images or no images found.");
    //             setError("failed to get images")
    //         }
    //         }
    //     );
    // }

    // // Add Item Button
    // const handleScrapeClick = () => {     
    //     const allUrls = organizationSections.flatMap(section => 
    //         section.items.map(item => item.url)
    //     );

    //     const alreadyIn = allUrls.includes(currentUrl);

    //     if(!isLocked && !error && !alreadyIn) {
    //         setAddItemState(!addItemState);
    //         setAddFileState(false);
    //         setSignInState(false);
    //         if(!addItemState) {
    //             gatherPriceTitleData();
    //             gatherImageData();
    //         }
    //     }
    //     else if(!isLocked && error && !alreadyIn) {
    //         showNotification("Invalid website", false);
    //     }
    //     else if(!isLocked && !error && alreadyIn) {
    //         showNotification("Item has already been added", false);
    //     }
    // };

    // // Add File Button
    // const handleFileClick = () => {
    //     if(!isLocked) {
    //         // Updates footer visulization
    //         setAddFileState(!addFileState);
    //         setAddItemState(false);
    //         setSignInState(false);
    //     }
    // };

    // // Profile Button
    // const signInClick = () => {
    //     if(!isLocked) {
    //         // Updates footer visulization
    //         setSignInState(!signInState);
    //         setAddFileState(false);
    //         setAddItemState(false);
    //     }
    // };

    return (
        <footer className="flex justify-between w-full h-14 items-center px-10 text-xl fixed bottom-0 shadow-top">
            <button className='hover:cursor-pointer'>
                <FontAwesomeIcon icon={faCartShopping} />    
            </button>
            <button 
                className='hover:cursor-pointer'
                onClick={() => togglePage("cart")}
            >
                <FontAwesomeIcon icon={faFolder} />
            </button>
            <button 
                className='hover:cursor-pointer'
                onClick={() => setAccountPageVisible(true)}
            >
                <FontAwesomeIcon icon={faUser} />
            </button>
        </footer>
    );
}

export default Footer;